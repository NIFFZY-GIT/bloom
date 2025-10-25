'use client';

import { useState } from 'react';

interface AddPackageFormProps {
  isOpen: boolean;
  onClose: () => void;
  onPackageAdded: () => void;
}

export default function AddPackageForm({ isOpen, onClose, onPackageAdded }: AddPackageFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    image_path: '',
    category: '',
    highlights: '',
    includes: '',
    difficulty: 'Moderate',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          highlights: formData.highlights
            .split(',')
            .map(s => s.trim())
            .filter(Boolean),
          includes: formData.includes
            .split(',')
            .map(s => s.trim())
            .filter(Boolean),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add package');
      }

      onPackageAdded();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Tour Package</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="package-form">
          {error && <p className="error-message">{error}</p>}
          
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="price">Price ($)</label>
              <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="duration">Duration (days)</label>
              <input
                type="number"
                min="1"
                step="1"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="image_path">Image URL</label>
            <input type="text" id="image_path" name="image_path" value={formData.image_path} onChange={handleChange} />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input type="text" id="category" name="category" value={formData.category} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="difficulty">Difficulty</label>
              <select id="difficulty" name="difficulty" value={formData.difficulty} onChange={handleChange}>
                <option>Easy</option>
                <option>Moderate</option>
                <option>Challenging</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="highlights">Highlights (comma-separated)</label>
            <input type="text" id="highlights" name="highlights" value={formData.highlights} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="includes">Includes (comma-separated)</label>
            <input type="text" id="includes" name="includes" value={formData.includes} onChange={handleChange} />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel" disabled={isSubmitting}>Cancel</button>
            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Package'}
            </button>
          </div>
        </form>
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 1rem;
          margin-bottom: 1.5rem;
        }
        .modal-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }
        .close-button {
          background: none;
          border: none;
          font-size: 2rem;
          cursor: pointer;
          color: #9ca3af;
        }
        .package-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
        }
        .form-group label {
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #374151;
        }
        .form-group input,
        .form-group textarea,
        .form-group select {
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 1rem;
        }
        .form-group textarea {
          min-height: 100px;
          resize: vertical;
        }
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        .btn-cancel, .btn-submit {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          border: none;
        }
        .btn-cancel {
          background: #e5e7eb;
          color: #374151;
        }
        .btn-submit {
          background: #f59e0b;
          color: white;
        }
        .error-message {
          color: #ef4444;
          background: #fee2e2;
          padding: 0.75rem;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}
