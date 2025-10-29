'use client';

import { useState, useEffect } from 'react';
import { Category, Place } from '@/Types';
import styles from './Places.module.css';

export default function PlacesPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    categoryId: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [placesRes, categoriesRes] = await Promise.all([
        fetch('/api/places'),
        fetch('/api/categories')
      ]);

      const placesData = await placesRes.json();
      const categoriesData = await categoriesRes.json();

      if (placesData.success) {
        setPlaces(placesData.places);
      }

      if (categoriesData.success) {
        setCategories(categoriesData.categories);
      }
    } catch (err) {
      setError('Error loading data');
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
      const url = editingPlace 
        ? `/api/places/${editingPlace.id}`
        : '/api/places';
      
      const method = editingPlace ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          categoryId: parseInt(formData.categoryId)
        })
      });

      const data = await response.json();

      if (data.success) {
        await fetchData();
        closeModal();
        alert(editingPlace ? 'Place updated successfully!' : 'Place created successfully!');
      } else {
        setError(data.message || 'Operation failed');
      }
    } catch (err) {
      setError('Error saving place');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this place?')) {
      return;
    }

    try {
      const response = await fetch(`/api/places/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        await fetchData();
        alert('Place deleted successfully!');
      } else {
        alert(data.message || 'Failed to delete place');
      }
    } catch (err) {
      alert('Error deleting place');
      console.error(err);
    }
  };

  const openModal = (place?: Place) => {
    if (place) {
      setEditingPlace(place);
      setFormData({
        name: place.name,
        description: place.description,
        image: place.image,
        categoryId: place.categoryId.toString()
      });
      setImagePreview(place.image);
    } else {
      setEditingPlace(null);
      setFormData({
        name: '',
        description: '',
        image: '',
        categoryId: categories[0]?.id?.toString() || ''
      });
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPlace(null);
    setError(null);
    setImagePreview(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'places');

      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setFormData(prev => ({ ...prev, image: data.url }));
        setImagePreview(data.url);
      } else {
        setError(data.message || 'Failed to upload image');
      }
    } catch (err) {
      setError('Error uploading image');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const filteredPlaces = selectedCategoryFilter === 'all' 
    ? places 
    : places.filter(place => place.categoryId === parseInt(selectedCategoryFilter));

  const getCategoryName = (categoryId: number) => {
    return categories.find(cat => cat.id === categoryId)?.name || 'Unknown';
  };

  const getCategoryColor = (categoryId: number) => {
    return categories.find(cat => cat.id === categoryId)?.color || '#6b7280';
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading places...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Places Management</h1>
          <p className={styles.subtitle}>Create and manage destination places</p>
        </div>
        <button className={styles.addButton} onClick={() => openModal()}>
          <span>➕</span> Add Place
        </button>
      </div>

      {error && !isModalOpen && (
        <div className={styles.errorBanner}>{error}</div>
      )}

      <div className={styles.filterBar}>
        <label htmlFor="categoryFilter">Filter by Category:</label>
        <select 
          id="categoryFilter"
          value={selectedCategoryFilter}
          onChange={(e) => setSelectedCategoryFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <span className={styles.count}>
          {filteredPlaces.length} {filteredPlaces.length === 1 ? 'place' : 'places'}
        </span>
      </div>

      <div className={styles.grid}>
        {filteredPlaces.map(place => (
          <div key={place.id} className={styles.card}>
            <div className={styles.cardImage} style={{ backgroundImage: `url(${place.image})` }}>
              <div className={styles.categoryBadge} style={{ backgroundColor: getCategoryColor(place.categoryId) }}>
                {getCategoryName(place.categoryId)}
              </div>
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{place.name}</h3>
              <p className={styles.cardDescription}>{place.description}</p>
              <div className={styles.cardActions}>
                <button 
                  className={styles.editButton}
                  onClick={() => openModal(place)}
                >
                  ✏️ Edit
                </button>
                <button 
                  className={styles.deleteButton}
                  onClick={() => handleDelete(place.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPlaces.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📍</div>
          <h3>No places found</h3>
          <p>
            {selectedCategoryFilter === 'all' 
              ? 'Create your first place to get started'
              : 'No places in this category yet'}
          </p>
          <button className={styles.addButton} onClick={() => openModal()}>
            Add Place
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{editingPlace ? 'Edit Place' : 'Add New Place'}</h2>
              <button className={styles.closeButton} onClick={closeModal}>✕</button>
            </div>

            {error && (
              <div className={styles.errorMessage}>{error}</div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Place Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Mirissa Beach"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="categoryId">Category *</label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="image">Place Image *</label>
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
                      <img src={imagePreview} alt="Preview" />
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
                  placeholder="/images/places/mirissa.png"
                  className={styles.pathInput}
                />
                <small>Upload an image or enter path manually</small>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  placeholder="Describe the place and its attractions..."
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
                  {submitting ? 'Saving...' : (editingPlace ? 'Update Place' : 'Create Place')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
