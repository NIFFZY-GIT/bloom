'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ChangeEvent, FormEvent, MouseEvent as ReactMouseEvent } from 'react';
import { useRouter } from 'next/navigation';

import styles from '@/app/admin/admingallery/AdminGallery.module.css';

export interface ReviewRecord {
  id: number;
  name: string;
  position: string | null;
  avatar: string | null;
  rating: number;
  text: string;
}

interface ReviewsManagerProps {
  reviews: ReviewRecord[];
}

export interface ReviewsManagerHandle {
  openCreateModal: () => void;
}

const clampRating = (value: number) => {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.min(5, Math.max(0, value));
};

const initialsForName = (name: string) => {
  if (!name) {
    return '?';
  }

  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map(part => part.charAt(0).toUpperCase()).join('') || '?';
};

const ReviewsManager = forwardRef<ReviewsManagerHandle, ReviewsManagerProps>(function ReviewsManager(
  { reviews },
  ref,
) {
  const router = useRouter();
  const createNameRef = useRef<HTMLInputElement | null>(null);
  const editNameRef = useRef<HTMLInputElement | null>(null);

  const [createState, setCreateState] = useState({
    name: '',
    position: '',
    avatar: '',
    rating: '5',
    text: '',
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createUploading, setCreateUploading] = useState(false);
  const [createUploadError, setCreateUploadError] = useState<string | null>(null);
  const [createUploadMessage, setCreateUploadMessage] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editState, setEditState] = useState({
    name: '',
    position: '',
    avatar: '',
    rating: '5',
    text: '',
  });
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUploading, setEditUploading] = useState(false);
  const [editUploadError, setEditUploadError] = useState<string | null>(null);
  const [editUploadMessage, setEditUploadMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const resetCreateForm = useCallback(() => {
    setCreateState({ name: '', position: '', avatar: '', rating: '5', text: '' });
    setCreateError(null);
    setCreateUploadError(null);
    setCreateUploadMessage(null);
  }, []);

  const openCreateModal = useCallback(() => {
    resetCreateForm();
    setIsCreateModalOpen(true);
  }, [resetCreateForm]);

  const closeCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
    resetCreateForm();
  }, [resetCreateForm]);

  useImperativeHandle(ref, () => ({
    openCreateModal,
  }), [openCreateModal]);

  const uploadFile = async (
    file: File,
    options: {
      onSuccess: (url: string) => void;
      setUploading: (value: boolean) => void;
      setError: (value: string | null) => void;
      setMessage: (value: string | null) => void;
    },
  ) => {
    const { onSuccess, setUploading, setError, setMessage } = options;
    setUploading(true);
    setError(null);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'reviews');

      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to upload file');
      }

      const uploadedUrl = data?.url;
      if (!uploadedUrl || typeof uploadedUrl !== 'string') {
        throw new Error('Upload did not return a file path');
      }

      onSuccess(uploadedUrl);
      setMessage(`Uploaded as ${uploadedUrl}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload file';
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  const handleCreateFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    await uploadFile(file, {
      onSuccess: url => setCreateState(prev => ({ ...prev, avatar: url })),
      setUploading: setCreateUploading,
      setError: setCreateUploadError,
      setMessage: setCreateUploadMessage,
    });

    event.target.value = '';
  };

  const handleEditFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!editingId) {
      return;
    }

    await uploadFile(file, {
      onSuccess: url => setEditState(prev => ({ ...prev, avatar: url })),
      setUploading: setEditUploading,
      setError: setEditUploadError,
      setMessage: setEditUploadMessage,
    });

    event.target.value = '';
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreating(true);
    setCreateError(null);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createState),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to create review');
      }

      closeCreateModal();
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create review';
      setCreateError(message);
    } finally {
      setCreating(false);
    }
  };

  const beginEdit = useCallback((review: ReviewRecord) => {
    setEditingId(review.id);
    setEditState({
      name: review.name ?? '',
      position: review.position ?? '',
      avatar: review.avatar ?? '',
      rating: String(clampRating(review.rating)),
      text: review.text ?? '',
    });
    setUpdateError(null);
    setEditUploadError(null);
    setEditUploadMessage(null);
    setIsEditModalOpen(true);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setIsEditModalOpen(false);
    setEditState({ name: '', position: '', avatar: '', rating: '5', text: '' });
    setUpdateError(null);
    setEditUploadError(null);
    setEditUploadMessage(null);
  }, []);

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingId) {
      return;
    }

    setUpdating(true);
    setUpdateError(null);

    try {
      const response = await fetch(`/api/reviews/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editState),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to update review');
      }

      cancelEdit();
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update review';
      setUpdateError(message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Delete this testimonial? This action cannot be undone.');
    if (!confirmed) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to delete review');
      }

      if (editingId === id) {
        cancelEdit();
      }

      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete review';
      // eslint-disable-next-line no-alert
      window.alert(message);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    if (!isCreateModalOpen) {
      return;
    }

    createNameRef.current?.focus();
  }, [isCreateModalOpen]);

  useEffect(() => {
    if (!isEditModalOpen) {
      return;
    }

    editNameRef.current?.focus();
  }, [isEditModalOpen]);

  useEffect(() => {
    if (!isCreateModalOpen && !isEditModalOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      if (isEditModalOpen && !updating && !editUploading) {
        cancelEdit();
        return;
      }

      if (isCreateModalOpen && !creating && !createUploading) {
        closeCreateModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    cancelEdit,
    closeCreateModal,
    creating,
    createUploading,
    editUploading,
    isCreateModalOpen,
    isEditModalOpen,
    updating,
  ]);

  const handleCreateModalBackdropClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && !creating && !createUploading) {
      closeCreateModal();
    }
  };

  const handleEditModalBackdropClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && !updating && !editUploading) {
      cancelEdit();
    }
  };

  const sortedReviews = useMemo(() => reviews.slice().sort((a, b) => b.id - a.id), [reviews]);

  return (
    <>
      <div className={styles.listCard}>
        {sortedReviews.length === 0 ? (
          <div className={styles.emptyState}>
            <strong>No testimonials yet.</strong>
            <span>Add your first client story to build trust with visitors.</span>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHeadRow}>
                  <th className={styles.tableHeaderCell}>Client</th>
                  <th className={styles.tableHeaderCell}>Rating</th>
                  <th className={styles.tableHeaderCell}>Testimonial</th>
                  <th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellActions}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedReviews.map(review => (
                  <tr key={review.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      <div className={styles.clientCell}>
                        {review.avatar ? (
                          <img
                            src={review.avatar}
                            alt={review.name ? `${review.name} avatar` : 'Client avatar'}
                            className={styles.clientAvatar}
                          />
                        ) : (
                          <div className={`${styles.clientAvatar} ${styles.clientAvatarFallback}`}>
                            {initialsForName(review.name)}
                          </div>
                        )}
                        <div className={styles.clientInfo}>
                          <span className={styles.clientName}>{review.name}</span>
                          <span className={styles.clientRole}>{review.position || 'Client'}</span>
                        </div>
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <span className={styles.ratingBadge}>{clampRating(review.rating).toFixed(1)}</span>
                    </td>
                    <td className={styles.tableCell}>
                      <p className={styles.testimonialText}>{review.text}</p>
                    </td>
                    <td className={`${styles.tableCell} ${styles.actionsCell}`}>
                      <div className={styles.actionsGroup}>
                        <button
                          type="button"
                          className={styles.editBtn}
                          onClick={() => beginEdit(review)}
                          disabled={updating && editingId === review.id}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(review.id)}
                          disabled={deletingId === review.id}
                        >
                          {deletingId === review.id ? 'Deleting…' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isCreateModalOpen && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-review-modal-title"
          onClick={handleCreateModalBackdropClick}
        >
          <div className={styles.modalCard}>
            <button
              type="button"
              className={styles.modalCloseBtn}
              aria-label="Close create dialog"
              onClick={closeCreateModal}
              disabled={creating || createUploading}
            >
              X
            </button>
            <form className={styles.modalForm} onSubmit={handleCreate}>
              <div className={styles.modalHeader}>
                <h2 id="create-review-modal-title" className={styles.formTitle}>Add New Testimonial</h2>
                <p className={styles.formDescription}>
                  Upload a client portrait, set their rating, and add their quote to the testimonial wall.
                </p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="create-review-name">Client Name</label>
                <input
                  id="create-review-name"
                  className={styles.formInput}
                  ref={createNameRef}
                  value={createState.name}
                  onChange={event => setCreateState(prev => ({ ...prev, name: event.target.value }))}
                  placeholder="Jane Doe"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="create-review-position">Role / Company</label>
                <input
                  id="create-review-position"
                  className={styles.formInput}
                  value={createState.position}
                  onChange={event => setCreateState(prev => ({ ...prev, position: event.target.value }))}
                  placeholder="Marketing Director"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="create-review-avatar-upload">Client Portrait</label>
                <input
                  id="create-review-avatar-upload"
                  type="file"
                  accept="image/*"
                  className={styles.fileInput}
                  onChange={handleCreateFileChange}
                  disabled={createUploading}
                />
                <p className={styles.inputHint}>Portraits upload to <code>/public/uploads/reviews</code> for immediate reuse.</p>
                {createUploading && <span className={styles.uploadStatus}>Uploading…</span>}
                {createUploadMessage && <span className={styles.uploadStatus}>{createUploadMessage}</span>}
                {createUploadError && <span className={styles.uploadStatusError}>{createUploadError}</span>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="create-review-avatar-path">Stored Path</label>
                <input
                  id="create-review-avatar-path"
                  className={styles.formInput}
                  value={createState.avatar}
                  readOnly
                  placeholder="Upload an image to generate the stored path"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="create-review-rating">Rating</label>
                <input
                  id="create-review-rating"
                  className={styles.formInput}
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={createState.rating}
                  onChange={event => setCreateState(prev => ({ ...prev, rating: event.target.value }))}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="create-review-text">Testimonial</label>
                <textarea
                  id="create-review-text"
                  className={styles.formTextarea}
                  value={createState.text}
                  onChange={event => setCreateState(prev => ({ ...prev, text: event.target.value }))}
                  placeholder="Include a direct quote from the client"
                  required
                />
              </div>

              {createError && <span className={styles.errorText}>{createError}</span>}

              <div className={styles.formActions}>
                <button
                  className={styles.secondaryBtn}
                  type="button"
                  onClick={closeCreateModal}
                  disabled={creating || createUploading}
                >
                  Cancel
                </button>
                <button
                  className={styles.submitBtn}
                  type="submit"
                  disabled={creating || createUploading || !createState.avatar}
                >
                  {creating ? 'Saving…' : 'Add Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-review-modal-title"
          onClick={handleEditModalBackdropClick}
        >
          <div className={styles.modalCard}>
            <button
              type="button"
              className={styles.modalCloseBtn}
              aria-label="Close edit dialog"
              onClick={cancelEdit}
              disabled={updating || editUploading}
            >
              X
            </button>
            <form className={styles.modalForm} onSubmit={handleUpdate}>
              <div className={styles.modalHeader}>
                <h2 id="edit-review-modal-title" className={styles.formTitle}>Edit Testimonial</h2>
                <p className={styles.formDescription}>
                  Update the testimonial details or replace the portrait to keep the story current.
                </p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="edit-review-name">Client Name</label>
                <input
                  id="edit-review-name"
                  className={styles.formInput}
                  ref={editNameRef}
                  value={editState.name}
                  onChange={event => setEditState(prev => ({ ...prev, name: event.target.value }))}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="edit-review-position">Role / Company</label>
                <input
                  id="edit-review-position"
                  className={styles.formInput}
                  value={editState.position}
                  onChange={event => setEditState(prev => ({ ...prev, position: event.target.value }))}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="edit-review-avatar-upload">Replace Portrait</label>
                <input
                  id="edit-review-avatar-upload"
                  type="file"
                  accept="image/*"
                  className={styles.fileInput}
                  onChange={handleEditFileChange}
                  disabled={editUploading}
                />
                <p className={styles.inputHint}>Upload a new portrait to replace the existing file.</p>
                {editUploading && <span className={styles.uploadStatus}>Uploading…</span>}
                {editUploadMessage && <span className={styles.uploadStatus}>{editUploadMessage}</span>}
                {editUploadError && <span className={styles.uploadStatusError}>{editUploadError}</span>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="edit-review-avatar-path">Stored Path</label>
                <input
                  id="edit-review-avatar-path"
                  className={styles.formInput}
                  value={editState.avatar}
                  readOnly
                  placeholder="Upload an image to generate the stored path"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="edit-review-rating">Rating</label>
                <input
                  id="edit-review-rating"
                  className={styles.formInput}
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={editState.rating}
                  onChange={event => setEditState(prev => ({ ...prev, rating: event.target.value }))}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="edit-review-text">Testimonial</label>
                <textarea
                  id="edit-review-text"
                  className={styles.formTextarea}
                  value={editState.text}
                  onChange={event => setEditState(prev => ({ ...prev, text: event.target.value }))}
                  required
                />
              </div>

              {updateError && <span className={styles.errorText}>{updateError}</span>}

              <div className={styles.formActions}>
                <button
                  className={styles.secondaryBtn}
                  type="button"
                  onClick={cancelEdit}
                  disabled={updating || editUploading}
                >
                  Cancel
                </button>
                <button
                  className={styles.submitBtn}
                  type="submit"
                  disabled={updating || editUploading || !editState.avatar}
                >
                  {updating ? 'Updating…' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
});

export default ReviewsManager;
