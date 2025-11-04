'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import styles from './PackageForm.module.css';

const MAX_GALLERY_IMAGES = 10;

interface PackageFormInitialData {
  title: string;
  description: string;
  price: number;
  duration: number;
  image_path: string | null;
  category: string;
  highlights: string[] | null;
  includes: string[] | null;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  galleryImages: string[] | null;
}

interface PackageFormProps {
  mode: 'create' | 'edit';
  packageId?: number;
  initialData?: PackageFormInitialData;
}

interface FormState {
  title: string;
  description: string;
  price: string;
  duration: string;
  image_path: string;
  category: string;
  highlights: string;
  includes: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
}

export default function PackageForm({ mode, packageId, initialData }: PackageFormProps) {
  const router = useRouter();
  const initialGalleryImages = (() => {
    const base = (initialData?.galleryImages ?? [])
      .map(image => image.trim())
      .filter(Boolean);
    const cover = initialData?.image_path?.trim();
    const combined = cover ? [...base, cover] : base;
    return Array.from(new Set(combined));
  })();

  const [galleryImages, setGalleryImages] = useState<string[]>(initialGalleryImages);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const [formState, setFormState] = useState<FormState>(() => ({
    title: initialData?.title ?? '',
    description: initialData?.description ?? '',
    price: initialData ? String(initialData.price ?? '') : '',
    duration: initialData ? String(initialData.duration ?? '') : '',
    image_path: initialData?.image_path ?? initialGalleryImages[0] ?? '',
    category: initialData?.category ?? '',
    highlights: initialData?.highlights?.join(', ') ?? '',
    includes: initialData?.includes?.join(', ') ?? '',
    difficulty: initialData?.difficulty ?? 'Moderate',
  }));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [galleryUploadError, setGalleryUploadError] = useState<string | null>(null);
  const [galleryUploadSuccess, setGalleryUploadSuccess] = useState<string | null>(null);
  const galleryFileInputRef = useRef<HTMLInputElement | null>(null);

  const isEdit = mode === 'edit';
  const totalImages = galleryImages.length + pendingFiles.length;
  const galleryLimitReached = totalImages >= MAX_GALLERY_IMAGES;

  const coverImage = formState.image_path.trim();

  const highlightTags = formState.highlights
    .split(',')
    .map(entry => entry.trim())
    .filter(Boolean);

  const includeTags = formState.includes
    .split(',')
    .map(entry => entry.trim())
    .filter(Boolean);

  const requiredFields: Array<keyof Pick<FormState, 'title' | 'description' | 'price' | 'duration' | 'category'>> = [
    'title',
    'description',
    'price',
    'duration',
    'category',
  ];

  const completedRequired = requiredFields.filter(field => formState[field]?.trim().length);
  const completionPercent = Math.round((completedRequired.length / requiredFields.length) * 100);

  const numericPrice = Number(formState.price);
  const priceDisplay = !Number.isNaN(numericPrice) && formState.price.trim().length
    ? numericPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    : 'Not set yet';

  const durationValue = Number(formState.duration);
  const durationDisplay = !Number.isNaN(durationValue) && durationValue > 0
    ? `${durationValue} day${durationValue === 1 ? '' : 's'}`
    : 'Not set yet';

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setSuccess(null);
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const uploadImageToServer = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      throw new Error('Please select a valid image file.');
    }

    const maxBytes = 4 * 1024 * 1024;
    if (file.size > maxBytes) {
      throw new Error('Image is too large. Maximum size is 4MB.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'packages');

    const response = await fetch('/api/uploads', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data?.success || !data?.url) {
      const message = data?.message || 'Failed to upload image';
      throw new Error(message);
    }

    return data.url as string;
  };

  const appendGalleryImage = (url: string, successMessage: string) => {
    const trimmed = url.trim();
    if (!trimmed) {
      setGalleryUploadError('Enter a valid image path or URL.');
      setGalleryUploadSuccess(null);
      return false;
    }
    setSuccess(null);
    let added = false;
    setGalleryImages(prev => {
      if (prev.includes(trimmed)) {
        setGalleryUploadError('That image is already in the gallery.');
        setGalleryUploadSuccess(null);
        return prev;
      }
      if (prev.length >= MAX_GALLERY_IMAGES) {
        setGalleryUploadError(`You can add up to ${MAX_GALLERY_IMAGES} images.`);
        setGalleryUploadSuccess(null);
        return prev;
      }
      added = true;
      return [...prev, trimmed];
    });

    if (!added) {
      return false;
    }

    setFormState(prev => {
      if (prev.image_path.trim()) {
        return prev;
      }
      return { ...prev, image_path: trimmed };
    });

    setGalleryUploadError(null);
    if (successMessage) {
      setGalleryUploadSuccess(successMessage);
    } else {
      setGalleryUploadSuccess(null);
    }
    return true;
  };

  const handleAddGalleryUrl = () => {
    if (appendGalleryImage(newGalleryUrl, 'Image added to gallery.')) {
      setNewGalleryUrl('');
    }
  };

  const handleGalleryFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) {
      return;
    }

    const currentTotal = galleryImages.length + pendingFiles.length;
    if (currentTotal >= MAX_GALLERY_IMAGES) {
      setGalleryUploadError(`You can add up to ${MAX_GALLERY_IMAGES} images.`);
      setGalleryUploadSuccess(null);
      if (galleryFileInputRef.current) {
        galleryFileInputRef.current.value = '';
      }
      return;
    }

    setGalleryUploadError(null);
    setGalleryUploadSuccess(null);
    setSuccess(null);

    const remainingSlots = MAX_GALLERY_IMAGES - currentTotal;
    const selectedFiles = Array.from(files).slice(0, remainingSlots);

    if (selectedFiles.length !== files.length) {
      setGalleryUploadError(`Only ${remainingSlots} more image${remainingSlots === 1 ? '' : 's'} allowed.`);
    }

    // Validate and create previews for files
    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    for (const file of selectedFiles) {
      if (!file.type.startsWith('image/')) {
        setGalleryUploadError('Only image files are allowed.');
        continue;
      }

      const maxBytes = 4 * 1024 * 1024;
      if (file.size > maxBytes) {
        setGalleryUploadError('Some images are too large. Maximum size is 4MB.');
        continue;
      }

      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    if (validFiles.length > 0) {
      setPendingFiles(prev => [...prev, ...validFiles]);
      setPreviewUrls(prev => [...prev, ...newPreviews]);
      setGalleryUploadSuccess(`${validFiles.length} file(s) ready to upload`);
    }

    if (galleryFileInputRef.current) {
      galleryFileInputRef.current.value = '';
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    const totalExisting = galleryImages.length;
    
    if (index < totalExisting) {
      // Removing an existing uploaded image
      setGalleryImages(prev => {
        const next = prev.filter((_, idx) => idx !== index);
        const removedUrl = prev[index];
        setFormState(prevState => {
          if (prevState.image_path.trim() === removedUrl) {
            return { ...prevState, image_path: next[0] ?? previewUrls[0] ?? '' };
          }
          return prevState;
        });
        return next;
      });
    } else {
      // Removing a pending file
      const pendingIndex = index - totalExisting;
      
      // Revoke the preview URL to free memory
      if (previewUrls[pendingIndex]) {
        URL.revokeObjectURL(previewUrls[pendingIndex]);
      }
      
      setPendingFiles(prev => prev.filter((_, i) => i !== pendingIndex));
      setPreviewUrls(prev => prev.filter((_, i) => i !== pendingIndex));
    }
    
    setGalleryUploadError(null);
    setGalleryUploadSuccess(null);
    setSuccess(null);
  };

  const handleSetCoverImage = (url: string) => {
    setFormState(prev => ({ ...prev, image_path: url }));
    setGalleryUploadError(null);
    setGalleryUploadSuccess('Cover image updated.');
    setSuccess(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      // Upload pending files first
      const uploadedUrls: string[] = [];
      for (const file of pendingFiles) {
        try {
          const url = await uploadImageToServer(file);
          uploadedUrls.push(url);
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to upload images';
          setError(message);
          setIsSubmitting(false);
          return;
        }
      }

      // Combine existing images with newly uploaded ones
      const allGalleryImages = [...galleryImages, ...uploadedUrls].map(image => image.trim()).filter(Boolean);

      const endpoint = isEdit && packageId ? `/api/packages/${packageId}` : '/api/packages';
      const method = isEdit ? 'PUT' : 'POST';

      const trimmedImagePath = formState.image_path.trim() || allGalleryImages[0] || null;
      const payload = {
        title: formState.title.trim(),
        description: formState.description.trim(),
        price: parseFloat(formState.price),
        duration: formState.duration.trim(),
        image_path: trimmedImagePath,
        category: formState.category.trim(),
        difficulty: formState.difficulty,
        highlights: formState.highlights
          .split(',')
          .map(entry => entry.trim())
          .filter(Boolean),
        includes: formState.includes
          .split(',')
          .map(entry => entry.trim())
          .filter(Boolean),
        galleryImages: allGalleryImages,
      };

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || (isEdit ? 'Failed to update package' : 'Failed to create package'));
      }

      setSuccess(isEdit ? 'Package updated successfully' : 'Package created successfully');
      setTimeout(() => {
        router.push('/admin/packages');
        router.refresh();
      }, 800);
    } catch (submitError) {
      const message = submitError instanceof Error
        ? submitError.message
        : isEdit
          ? 'Failed to update package'
          : 'Failed to create package';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>{isEdit ? 'Edit Tour Package' : 'Create Tour Package'}</h1>
          <p className={styles.pageSubtitle}>
            {isEdit
              ? 'Update the details below to keep this package fresh and accurate.'
              : 'Fill in the details below to add a new tour experience to your catalog.'}
          </p>
        </div>
      </header>

      <main className={styles.formShell}>
        <div className={styles.layoutGrid}>
          <section className={styles.formCard}>
            <form className={styles.form} onSubmit={handleSubmit}>
              {error && <p className={`${styles.alert} ${styles.alertError}`}>{error}</p>}
              {success && <p className={`${styles.alert} ${styles.alertSuccess}`}>{success}</p>}

              <section className={styles.formSection}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Package overview</h2>
                  <p className={styles.sectionDescription}>
                    Set the essentials travellers see first — a standout title, category, and a clear description.
                  </p>
                </div>
                <div className={styles.fieldGrid}>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Title *</span>
                    <input
                      type="text"
                      name="title"
                      value={formState.title}
                      onChange={handleChange}
                      required
                      className={styles.input}
                    />
                  </label>

                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Category *</span>
                    <input
                      type="text"
                      name="category"
                      value={formState.category}
                      onChange={handleChange}
                      required
                      className={styles.input}
                    />
                  </label>

                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Difficulty *</span>
                    <select
                      name="difficulty"
                      value={formState.difficulty}
                      onChange={handleChange}
                      className={styles.select}
                    >
                      <option value="Easy">Easy</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Challenging">Challenging</option>
                    </select>
                  </label>
                </div>

                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Description *</span>
                  <textarea
                    name="description"
                    value={formState.description}
                    onChange={handleChange}
                    rows={6}
                    required
                    className={styles.textarea}
                  />
                </label>
              </section>

              <div className={styles.divider} />

              <section className={styles.formSection}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Pricing & logistics</h2>
                  <p className={styles.sectionDescription}>
                    Keep costs transparent and share how long the experience runs so travellers can plan with ease.
                  </p>
                </div>
                <div className={styles.fieldGrid}>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Price (USD) *</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      name="price"
                      value={formState.price}
                      onChange={handleChange}
                      required
                      className={styles.input}
                    />
                  </label>

                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Duration (days) *</span>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      name="duration"
                      value={formState.duration}
                      onChange={handleChange}
                      required
                      className={styles.input}
                    />
                  </label>
                </div>

              </section>

              <div className={styles.divider} />

              <section className={styles.formSection}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Visual assets</h2>
                  <p className={styles.sectionDescription}>
                    Upload imagery that captures the mood. Add multiple gallery shots to showcase different moments.
                  </p>
                </div>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Manage images</span>
                  <div className={styles.galleryControls}>
                    <input
                      type="text"
                      value={newGalleryUrl}
                      onChange={event => {
                        setNewGalleryUrl(event.target.value);
                        setGalleryUploadError(null);
                        setGalleryUploadSuccess(null);
                        setSuccess(null);
                      }}
                      onKeyDown={event => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          handleAddGalleryUrl();
                        }
                      }}
                      placeholder="https://example.com/gallery.jpg or /uploads/gallery-file.png"
                      className={styles.galleryInput}
                      disabled={galleryLimitReached}
                    />
                    <button
                      type="button"
                      className={styles.galleryAddBtn}
                      onClick={handleAddGalleryUrl}
                      disabled={galleryLimitReached}
                    >
                      Add Image
                    </button>
                  </div>
                  <div className={styles.fileUpload}>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      ref={galleryFileInputRef}
                      onChange={handleGalleryFileChange}
                      disabled={isSubmitting || galleryLimitReached}
                      className={styles.hiddenFileInput}
                    />
                    <button
                      type="button"
                      className={styles.uploadBtn}
                      onClick={() => galleryFileInputRef.current?.click()}
                      disabled={isSubmitting || galleryLimitReached}
                    >
                      Select Images
                    </button>
                  </div>
                  <span className={styles.fieldHelp}>
                    Upload or paste up to {MAX_GALLERY_IMAGES} images. Set one as the cover using the gallery below.
                    {pendingFiles.length > 0 && ` (${pendingFiles.length} file(s) ready to upload)`}
                  </span>
                  {galleryUploadError && <p className={styles.fieldError}>{galleryUploadError}</p>}
                  {galleryUploadSuccess && <p className={styles.fieldSuccess}>{galleryUploadSuccess}</p>}
                </div>

                {(galleryImages.length > 0 || previewUrls.length > 0) ? (
                  <div className={styles.galleryGrid}>
                    {[...galleryImages, ...previewUrls].map((url, index) => {
                      const isCover = coverImage === url;
                      const isPending = index >= galleryImages.length;
                      return (
                        <div
                          key={`${url}-${index}`}
                          className={`${styles.galleryCard} ${isCover ? styles.galleryCardCover : ''}`}
                        >
                          <div className={styles.galleryCardImage}>
                            {isCover && <span className={styles.coverBadge}>Cover image</span>}
                            {isPending && <span className={styles.pendingBadge}>Pending Upload</span>}
                            <Image 
                              src={url} 
                              alt={`Gallery asset ${index + 1}`} 
                              width={200} 
                              height={150} 
                              style={{ objectFit: 'cover' }}
                              unoptimized={isPending || url.startsWith('/uploads/')}
                            />
                          </div>
                          <div className={styles.galleryCardBody}>
                            <p className={styles.galleryUrl} title={url}>
                              {isPending ? 'Pending upload...' : url}
                            </p>
                            <div className={styles.galleryCardActions}>
                              {!isCover && !isPending && (
                                <button
                                  type="button"
                                  className={styles.galleryActionBtn}
                                  onClick={() => handleSetCoverImage(url)}
                                  disabled={isSubmitting}
                                >
                                  Set as cover
                                </button>
                              )}
                              <button
                                type="button"
                                className={`${styles.galleryActionBtn} ${styles.galleryActionDanger}`}
                                onClick={() => handleRemoveGalleryImage(index)}
                                disabled={isSubmitting}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className={styles.galleryEmpty}>Add at least one image to bring this package to life.</p>
                )}
              </section>

              <div className={styles.divider} />

              <section className={styles.formSection}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Selling points</h2>
                  <p className={styles.sectionDescription}>
                    Highlight what makes this experience special and spell out what’s included to build trust.
                  </p>
                </div>
                <div className={styles.fieldGrid}>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Highlights (comma separated)</span>
                    <input
                      type="text"
                      name="highlights"
                      placeholder="Sunrise trek, Local cuisine, ..."
                      value={formState.highlights}
                      onChange={handleChange}
                      className={styles.input}
                    />
                  </label>

                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Included (comma separated)</span>
                    <input
                      type="text"
                      name="includes"
                      placeholder="Guide, Meals, Transport, ..."
                      value={formState.includes}
                      onChange={handleChange}
                      className={styles.input}
                    />
                  </label>
                </div>
              </section>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.primaryBtn}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (isEdit ? 'Saving…' : 'Creating…') : isEdit ? 'Save Changes' : 'Create Package'}
                </button>
              </div>
            </form>
          </section>

          <aside className={styles.helperPanel}>
            <div className={styles.helperCard}>
              <div className={styles.progressWrap}>
                <div className={styles.progressLabel}>
                  <span>Form progress</span>
                  <span>{completionPercent}%</span>
                </div>
                <div className={styles.progressMeter}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${Math.min(Math.max(completionPercent, 0), 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <span className={styles.previewHeading}>Package title</span>
                <p className={styles.previewValue}>{formState.title.trim() || 'Untitled experience'}</p>
                <p className={styles.previewMuted}>{formState.category.trim() || 'No category yet'}</p>
              </div>

              <div className={styles.previewImageFrame}>
                {coverImage ? (
                  <Image src={coverImage} alt="Cover preview" width={300} height={200} style={{ objectFit: 'cover' }} />
                ) : (
                  'Cover image preview'
                )}
              </div>

              <div>
                <span className={styles.previewHeading}>Price</span>
                <p className={styles.previewValue}>{priceDisplay}</p>
              </div>

              <div>
                <span className={styles.previewHeading}>Duration</span>
                <p className={styles.previewMuted}>{durationDisplay}</p>
              </div>

              <div>
                <span className={styles.previewHeading}>Highlights</span>
                {highlightTags.length ? (
                  <div className={styles.previewTagList}>
                    {highlightTags.map(tag => (
                      <span key={tag} className={styles.previewTag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className={styles.previewMuted}>Add highlights to surface key moments.</p>
                )}
              </div>

              {includeTags.length > 0 && (
                <div>
                  <span className={styles.previewHeading}>Includes</span>
                  <div className={styles.previewTagList}>
                    {includeTags.map(tag => (
                      <span key={tag} className={styles.previewTag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={styles.helperCard}>
              <p className={styles.helperTitle}>Quick tips</p>
              <div className={styles.helperList}>
                <div className={styles.helperListItem}>
                  <span className={styles.helperIcon}>1</span>
                  <p>
                    Start with an outcome-focused title so travellers instantly understand the experience.
                  </p>
                </div>
                <div className={styles.helperListItem}>
                  <span className={styles.helperIcon}>2</span>
                  <p>
                    Aim for a description around <strong>150-250 words</strong> to balance inspiration with detail.
                  </p>
                </div>
                <div className={styles.helperListItem}>
                  <span className={styles.helperIcon}>3</span>
                  <p>
                    Gallery images should cover different trip moments — arrival, activities, and the big finale.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
