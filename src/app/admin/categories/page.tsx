'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Category } from '@/Types';
import { readJson } from '@/lib/http';
import { MAX_UPLOAD_BYTES, MAX_UPLOAD_LABEL } from '@/lib/upload-limits';
import styles from './Categories.module.css';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    color: '#1e40af',
    bgColor: 'linear-gradient(135deg, #1e40af, #3b82f6)',
    description: '',
    animation: 'waves'
  });
  const [gradientStart, setGradientStart] = useState('#1e40af');
  const [gradientEnd, setGradientEnd] = useState('#3b82f6');
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await readJson<{ success?: boolean; categories?: Category[]; message?: string }>(
        response,
        'Failed to load categories',
      );
      if (data.success) {
        setCategories(data.categories ?? []);
      } else {
        setError(data.message || 'Failed to load categories');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading categories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const url = editingCategory 
        ? `/api/categories/${editingCategory.id}`
        : '/api/categories';
      
      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await readJson<{ success?: boolean; message?: string }>(
        response,
        editingCategory ? 'Failed to update category' : 'Failed to create category',
      );

      if (data.success) {
        await fetchCategories();
        closeModal();
        alert(editingCategory ? 'Category updated successfully!' : 'Category created successfully!');
      } else {
        setError(data.message || 'Operation failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving category');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category? This will also delete all associated places.')) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE'
      });

      const data = await readJson<{ success?: boolean; message?: string }>(
        response,
        'Failed to delete category',
      );

      if (data.success) {
        await fetchCategories();
        alert('Category deleted successfully!');
      } else {
        alert(data.message || 'Failed to delete category');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error deleting category');
      console.error(err);
    }
  };

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        image: category.image,
        color: category.color,
        bgColor: category.bgColor,
        description: category.description,
        animation: category.animation
      });
      setImagePreview(category.image);
      
      // Extract gradient colors if possible
      const gradientMatch = category.bgColor.match(/#[0-9a-fA-F]{6}/g);
      if (gradientMatch && gradientMatch.length >= 2) {
        setGradientStart(gradientMatch[0]);
        setGradientEnd(gradientMatch[1]);
      }
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        image: '',
        color: '#1e40af',
        bgColor: 'linear-gradient(135deg, #1e40af, #3b82f6)',
        description: '',
        animation: 'waves'
      });
      setImagePreview(null);
      setGradientStart('#1e40af');
      setGradientEnd('#3b82f6');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setError(null);
    setImagePreview(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGradientStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setGradientStart(color);
    const gradient = `linear-gradient(135deg, ${color}, ${gradientEnd})`;
    setFormData(prev => ({ ...prev, bgColor: gradient }));
  };

  const handleGradientEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setGradientEnd(color);
    const gradient = `linear-gradient(135deg, ${gradientStart}, ${color})`;
    setFormData(prev => ({ ...prev, bgColor: gradient }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      setError(`Image size must be less than ${MAX_UPLOAD_LABEL}`);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'categories');

      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData
      });

      const data = await readJson<{ success?: boolean; url?: string; message?: string }>(
        response,
        'Failed to upload image',
      );

      if (data.success && data.url) {
        setFormData(prev => ({ ...prev, image: data.url as string }));
        setImagePreview(data.url);
      } else {
        setError(data.message || 'Failed to upload image');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error uploading image');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading categories...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Categories Management</h1>
          <p className={styles.subtitle}>Create and manage journey categories</p>
        </div>
        <button className={styles.addButton} onClick={() => openModal()}>
          <span>➕</span> Add Category
        </button>
      </div>

      {error && !isModalOpen && (
        <div className={styles.errorBanner}>{error}</div>
      )}

      <div className={styles.grid}>
        {categories.map(category => (
          <div key={category.id} className={styles.card}>
            <div className={styles.cardImage} style={{ backgroundImage: `url(${category.image})` }}>
              <div className={styles.cardOverlay} style={{ background: category.bgColor }}></div>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{category.name}</h3>
                <div className={styles.cardBadge} style={{ backgroundColor: category.color }}>
                  {category.animation}
                </div>
              </div>
              <p className={styles.cardDescription}>{category.description}</p>
              <div className={styles.cardActions}>
                <button 
                  className={styles.editButton}
                  onClick={() => openModal(category)}
                >
                  ✏️ Edit
                </button>
                <button 
                  className={styles.deleteButton}
                  onClick={() => handleDelete(category.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📂</div>
          <h3>No categories yet</h3>
          <p>Create your first category to get started</p>
          <button className={styles.addButton} onClick={() => openModal()}>
            Add Category
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
              <button className={styles.closeButton} onClick={closeModal}>✕</button>
            </div>

            {error && (
              <div className={styles.errorMessage}>{error}</div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Category Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Beaches & Coastal"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="image">Category Image *</label>
                <div className={styles.fileUploadWrapper}>
                  <input
                    type="file"
                    id="imageFile"
                    accept="image/*"
                    onChange={handleFileChange}
                    className={styles.fileInput}
                  />
                  <label htmlFor="imageFile" className={styles.fileLabel}>
                    {uploading ? '⏳ Uploading...' : '📁 Choose Image'}
                  </label>
                  {imagePreview && (
                    <div className={styles.imagePreview}>
                      <Image src={imagePreview} alt="Preview" width={200} height={200} style={{ objectFit: 'cover' }} />
                      <button 
                        type="button" 
                        className={styles.removeImage}
                        onClick={() => {
                          setImagePreview(null);
                          setFormData(prev => ({ ...prev, image: '' }));
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  required
                  placeholder="/uploads/categories/example.png"
                  className={styles.pathInput}
                />
                <small>Upload an image or enter path manually (files saved to /uploads/)</small>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="color">Color *</label>
                  <input
                    type="color"
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="animation">Animation Type *</label>
                  <select
                    id="animation"
                    name="animation"
                    value={formData.animation}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="waves">Waves</option>
                    <option value="forest">Forest</option>
                    <option value="wildlife">Wildlife</option>
                    <option value="heritage">Heritage</option>
                    <option value="mountains">Mountains</option>
                    <option value="spiritual">Spiritual</option>
                    <option value="urban">Urban</option>
                    <option value="waterfalls">Waterfalls</option>
                    <option value="adventure">Adventure</option>
                    <option value="village">Village</option>
                    <option value="fortresses">Fortresses</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Background Gradient *</label>
                <div className={styles.gradientPickers}>
                  <div className={styles.colorPickerGroup}>
                    <label htmlFor="gradientStart">Start Color</label>
                    <input
                      type="color"
                      id="gradientStart"
                      value={gradientStart}
                      onChange={handleGradientStartChange}
                    />
                    <span className={styles.colorValue}>{gradientStart}</span>
                  </div>
                  <div className={styles.gradientArrow}>→</div>
                  <div className={styles.colorPickerGroup}>
                    <label htmlFor="gradientEnd">End Color</label>
                    <input
                      type="color"
                      id="gradientEnd"
                      value={gradientEnd}
                      onChange={handleGradientEndChange}
                    />
                    <span className={styles.colorValue}>{gradientEnd}</span>
                  </div>
                </div>
                <div 
                  className={styles.gradientPreview}
                  style={{ background: formData.bgColor }}
                >
                  <span>Preview</span>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  placeholder="Brief description of the category..."
                />
              </div>

              <div className={styles.formActions}>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={closeModal}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : (editingCategory ? 'Update Category' : 'Create Category')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
