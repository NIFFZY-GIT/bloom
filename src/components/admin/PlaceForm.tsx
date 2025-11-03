'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import styles from './PlaceForm.module.css';

interface PlaceFormInitialData {
  name: string;
  description: string;
  duration: string;
  category: string;
  location: string;
  highlights: string[] | null;
  galleryImages: string[] | null;
}

interface PlaceFormProps {
  mode: 'create' | 'edit';
  placeId?: number;
  initialData?: PlaceFormInitialData;
}

interface FormState {
  name: string;
  description: string;
  duration: string;
  category: string;
  location: string;
  highlights: string;
}

const CATEGORIES = [
  'landmark',
  'cultural',
  'nature',
  'food',
  'entertainment',
];

export default function PlaceForm({ mode, placeId, initialData }: PlaceFormProps) {
  const router = useRouter();

  const [formState, setFormState] = useState<FormState>(() => ({
    name: initialData?.name ?? '',
    description: initialData?.description ?? '',
    duration: initialData?.duration ?? '',
    category: initialData?.category ?? '',
    location: initialData?.location ?? '',
    highlights: initialData?.highlights?.join(', ') ?? '',
  }));
  
  const [galleryImages, setGalleryImages] = useState<string[]>(
    initialData?.galleryImages || []
  );
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const galleryFileInputRef = useRef<HTMLInputElement | null>(null);

  const isEdit = mode === 'edit';

  const highlightTags = formState.highlights
    .split(',')
    .map(entry => entry.trim())
    .filter(Boolean);

  const requiredFields: Array<keyof Pick<FormState, 'name' | 'description' | 'duration' | 'category' | 'location'>> = [
    'name',
    'description',
    'duration',
    'category',
    'location',
  ];

  const completedRequired = requiredFields.filter(field => formState[field]?.trim().length);
  const hasGalleryImages = galleryImages.length > 0;
  const totalRequirements = requiredFields.length + 1; // +1 for gallery images
  const totalCompleted = completedRequired.length + (hasGalleryImages ? 1 : 0);
  const completionPercent = Math.round((totalCompleted / totalRequirements) * 100);

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

  const handleGalleryUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setGalleryUploading(true);
    setError(null);

    try {
      const url = await uploadImageToServer(file);
      setGalleryImages(prev => [...prev, url]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload image';
      setError(message);
    } finally {
      setGalleryUploading(false);
      if (galleryFileInputRef.current) {
        galleryFileInputRef.current.value = '';
      }
    }
  };

  const handleAddImageUrl = () => {
    const trimmed = newImageUrl.trim();
    if (!trimmed) {
      return;
    }
    
    if (galleryImages.includes(trimmed)) {
      setError('This image URL is already in the gallery');
      return;
    }

    setGalleryImages(prev => [...prev, trimmed]);
    setNewImageUrl('');
    setError(null);
  };

  const handleRemoveImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleMoveImageToFirst = (index: number) => {
    if (index === 0) return; // Already first
    const newGallery = [...galleryImages];
    const [movedImage] = newGallery.splice(index, 1);
    newGallery.unshift(movedImage);
    setGalleryImages(newGallery);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const name = formState.name.trim();
    const description = formState.description.trim();
    const duration = formState.duration.trim();
    const category = formState.category.trim();
    const location = formState.location.trim();

    if (!name || !description || !duration || !category || !location) {
      setError('Name, description, duration, category, and location are required.');
      setIsSubmitting(false);
      return;
    }

    if (galleryImages.length === 0) {
      setError('Please add at least one image to the gallery.');
      setIsSubmitting(false);
      return;
    }

    const highlights = highlightTags.length > 0 ? highlightTags : [];

    // First image in gallery is the main image
    const imagePath = galleryImages.length > 0 ? galleryImages[0] : null;

    const payload = {
      name,
      description,
      duration,
      category,
      location,
      imagePath,
      highlights,
      galleryImages,
    };

    try {
      const url = isEdit ? `/api/places/${placeId}` : '/api/places';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        const message = data?.message || `Failed to ${isEdit ? 'update' : 'create'} place`;
        throw new Error(message);
      }

      setSuccess(data.message || `Place ${isEdit ? 'updated' : 'created'} successfully!`);
      
      setTimeout(() => {
        router.push('/admin/places');
        router.refresh();
      }, 1200);
    } catch (err) {
      const message = err instanceof Error ? err.message : `Failed to ${isEdit ? 'update' : 'create'} place`;
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/places');
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      {error && (
        <div className={styles.errorBanner}>
          {error}
        </div>
      )}
      {success && (
        <div className={styles.successBanner}>
          {success}
        </div>
      )}

      <div className={styles.formGrid}>
        {/* Left Column: Main Info */}
        <div className={styles.leftColumn}>
          <section className={styles.section}>
            <h3 className={styles.sectionHeading}>Place Information</h3>

            <div className={styles.field}>
              <label htmlFor="name" className={styles.label}>
                Place Name <span className={styles.required}>*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className={styles.input}
                value={formState.name}
                onChange={handleChange}
                placeholder="e.g., Brooklyn Bridge"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="description" className={styles.label}>
                Description <span className={styles.required}>*</span>
              </label>
              <textarea
                id="description"
                name="description"
                className={styles.textarea}
                value={formState.description}
                onChange={handleChange}
                placeholder="Describe this place..."
                rows={6}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="location" className={styles.label}>
                Location <span className={styles.required}>*</span>
              </label>
              <input
                id="location"
                name="location"
                type="text"
                className={styles.input}
                value={formState.location}
                onChange={handleChange}
                placeholder="e.g., Brooklyn, NY"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="duration" className={styles.label}>
                Duration <span className={styles.required}>*</span>
              </label>
              <input
                id="duration"
                name="duration"
                type="text"
                className={styles.input}
                value={formState.duration}
                onChange={handleChange}
                placeholder="e.g., 2 hours, 30 minutes"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="category" className={styles.label}>
                Category <span className={styles.required}>*</span>
              </label>
              <select
                id="category"
                name="category"
                className={styles.select}
                value={formState.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="highlights" className={styles.label}>
                Highlights (comma-separated)
              </label>
              <input
                id="highlights"
                name="highlights"
                type="text"
                className={styles.input}
                value={formState.highlights}
                onChange={handleChange}
                placeholder="e.g., Iconic, Photography, Historic"
              />
              {highlightTags.length > 0 && (
                <div className={styles.tagsList}>
                  {highlightTags.map((tag, idx) => (
                    <span key={idx} className={styles.tag}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Image Gallery */}
        <div className={styles.rightColumn}>
          <section className={styles.section}>
            <h3 className={styles.sectionHeading}>Image Gallery <span className={styles.required}>*</span></h3>
            <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '1rem' }}>
              The first image will be used as the main image for this place
            </p>

            <div className={styles.field}>
              <label className={styles.label}>Add Image URL</label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  type="text"
                  className={styles.input}
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddImageUrl();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className={styles.addImageBtn}
                  disabled={!newImageUrl.trim()}
                >
                  Add
                </button>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Or Upload Images</label>
              <input
                ref={galleryFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleGalleryUpload}
                className={styles.fileInput}
                disabled={galleryUploading}
              />
              {galleryUploading && <p className={styles.uploadingText}>Uploading...</p>}
            </div>

            {galleryImages.length > 0 && (
              <div className={styles.galleryGrid}>
                {galleryImages.map((imageUrl, index) => (
                  <div key={index} className={styles.galleryCard}>
                    <div className={styles.galleryCardImage}>
                      <Image src={imageUrl} alt={`Gallery ${index + 1}`} width={200} height={150} style={{ objectFit: 'cover' }} />
                      {index === 0 && (
                        <span className={styles.mainImageBadge}>Main Image</span>
                      )}
                    </div>
                    <div className={styles.galleryCardActions}>
                      {index !== 0 && (
                        <button
                          type="button"
                          onClick={() => handleMoveImageToFirst(index)}
                          className={styles.setMainBtn}
                        >
                          Set as Main
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className={styles.removeImageBtn}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {galleryImages.length === 0 && (
              <div className={styles.emptyGallery}>
                <i className="fas fa-images" style={{ fontSize: '2rem', color: '#9ca3af', marginBottom: '0.5rem' }}></i>
                <p>No images in gallery yet</p>
                <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Add images using URL or upload files</span>
              </div>
            )}
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionHeading}>Summary</h3>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Duration:</span>
              <span className={styles.summaryValue}>{formState.duration || 'Not set yet'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Category:</span>
              <span className={styles.summaryValue}>
                {formState.category ? formState.category.charAt(0).toUpperCase() + formState.category.slice(1) : 'Not set yet'}
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Location:</span>
              <span className={styles.summaryValue}>{formState.location || 'Not set yet'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Gallery Images:</span>
              <span className={styles.summaryValue}>{galleryImages.length > 0 ? `${galleryImages.length} image${galleryImages.length > 1 ? 's' : ''}` : 'None added yet'}</span>
            </div>

            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${completionPercent}%` }} />
            </div>
            <p className={styles.progressText}>{completionPercent}% Complete</p>
          </section>
        </div>
      </div>

      <div className={styles.formActions}>
        <button
          type="button"
          onClick={handleCancel}
          className={styles.cancelButton}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting || completionPercent < 100}
        >
          {isSubmitting ? `${isEdit ? 'Updating' : 'Creating'}...` : `${isEdit ? 'Update' : 'Create'} Place`}
        </button>
      </div>
    </form>
  );
}
