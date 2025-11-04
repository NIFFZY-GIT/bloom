'use client';

import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent, MouseEvent as ReactMouseEvent } from 'react';
import { useRouter } from 'next/navigation';

import styles from '@/app/admin/admingallery/AdminGallery.module.css';

export interface GalleryItem {
  id: number;
  category: string;
  image_path?: string;
  imagePath?: string;
  title: string;
  description?: string | null;
}

interface GalleryManagerProps {
  items: GalleryItem[];
}

export interface GalleryManagerHandle {
  openCreateModal: () => void;
}

const toFormValue = (value: string | null | undefined) => value ?? '';

const GalleryManager = forwardRef<GalleryManagerHandle, GalleryManagerProps>(function GalleryManager(
  { items },
  ref,
) {
  const router = useRouter();
  const createCategoryRef = useRef<HTMLInputElement | null>(null);
  const editTitleRef = useRef<HTMLInputElement | null>(null);

  const [createState, setCreateState] = useState({
    category: '',
    imagePath: '',
    title: '',
    description: '',
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createUploading, setCreateUploading] = useState(false);
  const [createUploadError, setCreateUploadError] = useState<string | null>(null);
  const [createUploadMessage, setCreateUploadMessage] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editState, setEditState] = useState({
    category: '',
    imagePath: '',
    title: '',
    description: '',
  });
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editUploading, setEditUploading] = useState(false);
  const [editUploadError, setEditUploadError] = useState<string | null>(null);
  const [editUploadMessage, setEditUploadMessage] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach(item => {
      if (item.category) {
        set.add(item.category);
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const resetCreateForm = useCallback(() => {
    setCreateState({ category: '', imagePath: '', title: '', description: '' });
    setCreateError(null);
    setCreateUploadError(null);
    setCreateUploadMessage(null);
  }, []);

  const closeCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
    resetCreateForm();
  }, [resetCreateForm]);

  const openCreateModal = useCallback(() => {
    resetCreateForm();
    setIsCreateModalOpen(true);
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
      formData.append('folder', 'gallery');

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
      onSuccess: url => setCreateState(prev => ({ ...prev, imagePath: url })),
      setUploading: setCreateUploading,
      setError: setCreateUploadError,
      setMessage: setCreateUploadMessage,
    });

    event.target.value = '';
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreating(true);
    setCreateError(null);

    try {
      const response = await fetch('/api/gallery-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createState),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to create gallery item');
      }

      closeCreateModal();
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create gallery item';
      setCreateError(message);
    } finally {
      setCreating(false);
    }
  };

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditState({ category: '', imagePath: '', title: '', description: '' });
    setUpdateError(null);
    setEditUploadError(null);
    setEditUploadMessage(null);
    setIsEditModalOpen(false);
  }, []);

  const beginEdit = useCallback((item: GalleryItem) => {
    setEditingId(item.id);
    setEditState({
      category: item.category ?? '',
      imagePath: item.imagePath ?? item.image_path ?? '',
      title: item.title ?? '',
      description: toFormValue(item.description),
    });
    setUpdateError(null);
    setEditUploadError(null);
    setEditUploadMessage(null);
    setIsEditModalOpen(true);
  }, []);

  useEffect(() => {
    if (!isEditModalOpen) {
      return;
    }

    if (editTitleRef.current) {
      editTitleRef.current.focus();
    }
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

  const handleEditFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!editingId) {
      return;
    }

    await uploadFile(file, {
      onSuccess: url => setEditState(prev => ({ ...prev, imagePath: url })),
      setUploading: setEditUploading,
      setError: setEditUploadError,
      setMessage: setEditUploadMessage,
    });

    event.target.value = '';
  };

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingId) {
      return;
    }

    setUpdating(true);
    setUpdateError(null);

    try {
      const response = await fetch(`/api/gallery-items/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editState),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to update gallery item');
      }

      cancelEdit();
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update gallery item';
      setUpdateError(message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Delete this gallery item? This action cannot be undone.');
    if (!confirmed) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/gallery-items/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to delete gallery item');
      }

      if (editingId === id) {
        cancelEdit();
      }

      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete gallery item';
       
      window.alert(message);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    if (!isCreateModalOpen) {
      return;
    }

    if (createCategoryRef.current) {
      createCategoryRef.current.focus();
    }
  }, [isCreateModalOpen]);

  return (
    <>
      <div className={styles.listCard}>
        {items.length === 0 ? (
          <div className={styles.emptyState}>
            <strong>No gallery items yet.</strong>
            <span>Add your first project to populate the public gallery page.</span>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHeadRow}>
                  <th className={styles.tableHeaderCell}>Title</th>
                  <th className={styles.tableHeaderCell}>Category</th>
                  <th className={styles.tableHeaderCell}>Image</th>
                  <th className={styles.tableHeaderCell}>Description</th>
                  <th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellActions}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr
                    key={item.id}
                    className={`${styles.tableRow} ${editingId === item.id ? styles.tableRowEditing : ''}`}
                  >
                    <td className={styles.tableCell}>{item.title}</td>
                    <td className={styles.tableCell}>{item.category}</td>
                    <td className={styles.tableCell}>{item.imagePath ?? item.image_path}</td>
                    <td className={styles.tableCell}>{item.description || '—'}</td>
                    <td className={`${styles.tableCell} ${styles.actionsCell}`}>
                      <div className={styles.actionsGroup}>
                        <button
                          type="button"
                          className={styles.editBtn}
                          onClick={() => beginEdit(item)}
                          disabled={updating && editingId === item.id}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                        >
                          {deletingId === item.id ? 'Deleting…' : 'Delete'}
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
          id="create-gallery-dialog"
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-modal-title"
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
                <h2 id="create-modal-title" className={styles.formTitle}>Add New Project</h2>
                <p className={styles.formDescription}>Upload a new gallery item to feature on the public gallery page.</p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="create-category">Category</label>
                <input
                  id="create-category"
                  name="category"
                  className={styles.formInput}
                  ref={createCategoryRef}
                  value={createState.category}
                  onChange={event => setCreateState(prev => ({ ...prev, category: event.target.value }))}
                  list="gallery-categories"
                  placeholder="e.g., web, branding, ui"
                  required
                />
                {categories.length > 0 && (
                  <datalist id="gallery-categories">
                    {categories.map(value => (
                      <option key={value} value={value} />
                    ))}
                  </datalist>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="create-title">Title</label>
                <input
                  id="create-title"
                  name="title"
                  className={styles.formInput}
                  value={createState.title}
                  onChange={event => setCreateState(prev => ({ ...prev, title: event.target.value }))}
                  placeholder="Project title"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="create-image-upload">Upload Image</label>
                <input
                  id="create-image-upload"
                  type="file"
                  accept="image/*"
                  className={styles.fileInput}
                  onChange={handleCreateFileChange}
                  disabled={createUploading}
                />
                <p className={styles.inputHint}>Select an image file to store it under <code>/public/uploads</code>.</p>
                {createUploading && <span className={styles.uploadStatus}>Uploading…</span>}
                {createUploadMessage && <span className={styles.uploadStatus}>{createUploadMessage}</span>}
                {createUploadError && <span className={styles.uploadStatusError}>{createUploadError}</span>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="create-image-path">Stored Path</label>
                <input
                  id="create-image-path"
                  name="imagePath"
                  className={styles.formInput}
                  value={createState.imagePath}
                  readOnly
                  placeholder="Upload an image to generate the stored path"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="create-description">Description</label>
                <textarea
                  id="create-description"
                  name="description"
                  className={styles.formTextarea}
                  value={createState.description}
                  onChange={event => setCreateState(prev => ({ ...prev, description: event.target.value }))}
                  placeholder="Short project summary"
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
                  disabled={creating || createUploading || !createState.imagePath}
                >
                  {creating ? 'Saving…' : 'Add Project'}
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
          aria-labelledby="edit-modal-title"
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
                <h2 id="edit-modal-title" className={styles.formTitle}>Edit Project</h2>
                <p className={styles.formDescription}>Update the selected gallery entry and refresh the page to preview changes.</p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="edit-category">Category</label>
                <input
                  id="edit-category"
                  className={styles.formInput}
                  value={editState.category}
                  onChange={event => setEditState(prev => ({ ...prev, category: event.target.value }))}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="edit-title">Title</label>
                <input
                  id="edit-title"
                  ref={editTitleRef}
                  className={styles.formInput}
                  value={editState.title}
                  onChange={event => setEditState(prev => ({ ...prev, title: event.target.value }))}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="edit-image-upload">Replace Image</label>
                <input
                  id="edit-image-upload"
                  type="file"
                  accept="image/*"
                  className={styles.fileInput}
                  onChange={handleEditFileChange}
                  disabled={editUploading}
                />
                <p className={styles.inputHint}>Upload a new image to replace the existing file.</p>
                {editUploading && <span className={styles.uploadStatus}>Uploading…</span>}
                {editUploadMessage && <span className={styles.uploadStatus}>{editUploadMessage}</span>}
                {editUploadError && <span className={styles.uploadStatusError}>{editUploadError}</span>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="edit-image-path">Stored Path</label>
                <input
                  id="edit-image-path"
                  className={styles.formInput}
                  value={editState.imagePath}
                  readOnly
                  placeholder="Upload an image to generate the stored path"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="edit-description">Description</label>
                <textarea
                  id="edit-description"
                  className={styles.formTextarea}
                  value={editState.description}
                  onChange={event => setEditState(prev => ({ ...prev, description: event.target.value }))}
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
                  disabled={updating || editUploading || !editState.imagePath}
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

export default GalleryManager;
