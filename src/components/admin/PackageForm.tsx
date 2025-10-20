'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import styles from './PackageForm.module.css';

interface PackageFormInitialData {
  title: string;
  description: string;
  price: number;
  duration: string;
  image_path: string | null;
  category: string;
  highlights: string[] | null;
  includes: string[] | null;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
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
  const [formState, setFormState] = useState<FormState>(() => ({
    title: initialData?.title ?? '',
    description: initialData?.description ?? '',
    price: initialData ? String(initialData.price ?? '') : '',
    duration: initialData?.duration ?? '',
    image_path: initialData?.image_path ?? '',
    category: initialData?.category ?? '',
    highlights: initialData?.highlights?.join(', ') ?? '',
    includes: initialData?.includes?.join(', ') ?? '',
    difficulty: initialData?.difficulty ?? 'Moderate',
  }));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_path ?? null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isEdit = mode === 'edit';

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    if (name !== 'image_path') {
      setSuccess(null);
    }
    if (name === 'image_path') {
      setImagePreview(value.trim() ? value.trim() : null);
      setUploadError(null);
      setUploadSuccess(null);
    }
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploadError(null);
    setUploadSuccess(null);
    setSuccess(null);

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    const maxBytes = 4 * 1024 * 1024;
    if (file.size > maxBytes) {
      setUploadError('Image is too large. Maximum size is 4MB.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setUploading(true);

    try {
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

      setFormState(prev => ({ ...prev, image_path: data.url }));
      setImagePreview(data.url);
      setUploadSuccess('Image uploaded successfully');
    } catch (uploadIssue) {
      const message = uploadIssue instanceof Error ? uploadIssue.message : 'Failed to upload image';
      setUploadError(message);
      setUploadSuccess(null);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormState(prev => ({ ...prev, image_path: '' }));
    setImagePreview(null);
    setUploadError(null);
    setUploadSuccess(null);
    setSuccess(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const endpoint = isEdit && packageId ? `/api/packages/${packageId}` : '/api/packages';
      const method = isEdit ? 'PUT' : 'POST';

      const trimmedImagePath = formState.image_path.trim();
      const payload = {
        title: formState.title.trim(),
        description: formState.description.trim(),
        price: parseFloat(formState.price),
        duration: formState.duration.trim(),
        image_path: trimmedImagePath.length > 0 ? trimmedImagePath : null,
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

      <main className={styles.formCard}>
        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <p className={`${styles.alert} ${styles.alertError}`}>{error}</p>}
          {success && <p className={`${styles.alert} ${styles.alertSuccess}`}>{success}</p>}

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
          </div>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>Description *</span>
            <textarea
              name="description"
              value={formState.description}
              onChange={handleChange}
              rows={5}
              required
              className={styles.textarea}
            />
          </label>

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
              <span className={styles.fieldLabel}>Duration *</span>
              <input
                type="text"
                name="duration"
                placeholder="e.g. 5 days"
                value={formState.duration}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </label>
          </div>

          <div className={styles.fieldGrid}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Image URL (optional)</span>
              <input
                type="url"
                name="image_path"
                placeholder="https://example.com/image.jpg"
                value={formState.image_path}
                onChange={handleChange}
                className={styles.input}
              />
              <span className={styles.fieldHelp}>Paste a URL or upload a file below.</span>
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
            <span className={styles.fieldLabel}>Upload Cover Image</span>
            <div className={styles.fileUpload}>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={uploading}
                className={styles.hiddenFileInput}
              />
              <button
                type="button"
                className={styles.uploadBtn}
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? 'Uploading…' : 'Select Image'}
              </button>
            </div>
            <span className={styles.fieldHelp}>Supports JPG, PNG up to 4MB.</span>
            {uploadError && <p className={styles.fieldError}>{uploadError}</p>}
            {uploadSuccess && <p className={styles.fieldSuccess}>{uploadSuccess}</p>}
            {imagePreview && (
              <div className={styles.imagePreview}>
                <img src={imagePreview} alt="Package preview" className={styles.previewImage} />
                <button type="button" className={styles.removeImageBtn} onClick={handleRemoveImage}>
                  Remove Image
                </button>
              </div>
            )}
          </label>

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
      </main>
    </div>
  );
}
