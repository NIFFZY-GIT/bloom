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
      // Reset form
      setFormData({
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Tour Package</h2>
          <button 
            onClick={onClose} 
            className="close-button"
            aria-label="Close modal"
            disabled={isSubmitting}
          >
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="package-form">
          {error && (
            <div className="error-message" role="alert">
              <svg className="error-icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
          
          <div className="form-scroll-container">
            <div className="form-group">
              <label htmlFor="title">Package Title *</label>
              <input 
                type="text" 
                id="title" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                required 
                disabled={isSubmitting}
                placeholder="Enter package title"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                required 
                disabled={isSubmitting}
                placeholder="Describe the tour package"
                rows={4}
              />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="price">Price ($) *</label>
                <input 
                  type="number" 
                  id="price" 
                  name="price" 
                  value={formData.price} 
                  onChange={handleChange} 
                  required 
                  disabled={isSubmitting}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label htmlFor="duration">Duration (days) *</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  placeholder="Number of days"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="image_path">Image URL</label>
              <input 
                type="url" 
                id="image_path" 
                name="image_path" 
                value={formData.image_path} 
                onChange={handleChange} 
                disabled={isSubmitting}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <input 
                  type="text" 
                  id="category" 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange} 
                  required 
                  disabled={isSubmitting}
                  placeholder="e.g., Adventure, Cultural, Beach"
                />
              </div>
              <div className="form-group">
                <label htmlFor="difficulty">Difficulty Level</label>
                <select 
                  id="difficulty" 
                  name="difficulty" 
                  value={formData.difficulty} 
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  <option value="Easy">Easy</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Challenging">Challenging</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="highlights">Highlights (comma-separated)</label>
              <input 
                type="text" 
                id="highlights" 
                name="highlights" 
                value={formData.highlights} 
                onChange={handleChange} 
                disabled={isSubmitting}
                placeholder="Scenic views, Wildlife, Photography, etc."
              />
              <div className="input-hint">Separate multiple highlights with commas</div>
            </div>

            <div className="form-group">
              <label htmlFor="includes">What's Included (comma-separated)</label>
              <input 
                type="text" 
                id="includes" 
                name="includes" 
                value={formData.includes} 
                onChange={handleChange} 
                disabled={isSubmitting}
                placeholder="Accommodation, Meals, Guide, Transportation, etc."
              />
              <div className="input-hint">Separate multiple items with commas</div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={onClose} 
              className="btn-cancel" 
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="spinner" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding Package...
                </>
              ) : (
                'Add Package'
              )}
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
          padding: 1rem;
          animation: fadeIn 0.2s ease-out;
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          animation: slideUp 0.3s ease-out;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e5e7eb;
          padding: 1.5rem;
          flex-shrink: 0;
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
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .close-button:hover:not(:disabled) {
          background: #f3f4f6;
          color: #374151;
        }

        .close-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .package-form {
          display: flex;
          flex-direction: column;
          flex: 1;
          overflow: hidden;
        }

        .form-scroll-container {
          padding: 0 1.5rem 1.5rem;
          overflow-y: auto;
          flex: 1;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          margin-bottom: 1.25rem;
        }

        .form-group label {
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #374151;
          font-size: 0.95rem;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.2s ease;
          background: white;
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          outline: none;
          border-color: #f59e0b;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
        }

        .form-group input:disabled,
        .form-group textarea:disabled,
        .form-group select:disabled {
          background-color: #f9fafb;
          color: #6b7280;
          cursor: not-allowed;
        }

        .form-group textarea {
          min-height: 100px;
          resize: vertical;
          line-height: 1.5;
        }

        .input-hint {
          font-size: 0.75rem;
          color: #6b7280;
          margin-top: 0.25rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding: 1.5rem;
          border-top: 1px solid #e5e7eb;
          background: #f9fafb;
          flex-shrink: 0;
        }

        .btn-cancel, .btn-submit {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          font-size: 0.95rem;
          transition: all 0.2s ease;
          min-height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .btn-cancel {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .btn-cancel:hover:not(:disabled) {
          background: #e5e7eb;
        }

        .btn-submit {
          background: #f59e0b;
          color: white;
        }

        .btn-submit:hover:not(:disabled) {
          background: #d97706;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }

        .btn-cancel:disabled,
        .btn-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .error-message {
          color: #dc2626;
          background: #fef2f2;
          padding: 0.75rem;
          border-radius: 8px;
          border: 1px solid #fecaca;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          font-size: 0.95rem;
        }

        .error-icon {
          width: 1.25rem;
          height: 1.25rem;
          flex-shrink: 0;
        }

        .spinner {
          width: 1.25rem;
          height: 1.25rem;
          animation: spin 1s linear infinite;
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .modal-overlay {
            padding: 0.5rem;
          }

          .modal-content {
            max-height: 95vh;
          }

          .modal-header {
            padding: 1.25rem;
          }

          .modal-header h2 {
            font-size: 1.35rem;
          }

          .form-scroll-container {
            padding: 0 1.25rem 1.25rem;
          }

          .form-actions {
            padding: 1.25rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
            gap: 0;
          }
        }

        @media (max-width: 640px) {
          .modal-header {
            padding: 1rem;
          }

          .modal-header h2 {
            font-size: 1.25rem;
          }

          .form-scroll-container {
            padding: 0 1rem 1rem;
          }

          .form-actions {
            padding: 1rem;
            flex-direction: column-reverse;
          }

          .btn-cancel,
          .btn-submit {
            width: 100%;
          }

          .close-button {
            width: 36px;
            height: 36px;
            font-size: 1.75rem;
          }
        }

        @media (max-width: 480px) {
          .modal-overlay {
            padding: 0.25rem;
          }

          .modal-content {
            border-radius: 12px;
          }

          .form-group {
            margin-bottom: 1rem;
          }

          .form-group input,
          .form-group textarea,
          .form-group select {
            padding: 0.675rem;
            font-size: 16px; /* Prevents zoom on iOS */
          }

          .btn-cancel, .btn-submit {
            padding: 0.875rem 1.25rem;
            min-height: 44px;
          }
        }

        @media (max-width: 375px) {
          .modal-header h2 {
            font-size: 1.15rem;
          }

          .form-group label {
            font-size: 0.9rem;
          }

          .btn-cancel, .btn-submit {
            font-size: 0.9rem;
          }
        }

        @media (max-height: 600px) {
          .modal-content {
            max-height: 98vh;
          }

          .form-scroll-container {
            max-height: 60vh;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .modal-overlay,
          .modal-content,
          .close-button,
          .form-group input,
          .form-group textarea,
          .form-group select,
          .btn-cancel,
          .btn-submit {
            animation: none;
            transition: none;
          }

          .btn-submit:hover:not(:disabled) {
            transform: none;
          }
        }

        /* Safe area insets for notched devices */
        @supports(padding: max(0px)) {
          .modal-overlay {
            padding-left: max(0.5rem, env(safe-area-inset-left));
            padding-right: max(0.5rem, env(safe-area-inset-right));
            padding-top: max(0.5rem, env(safe-area-inset-top));
            padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
          }
        }
      `}</style>
    </div>
  );
}