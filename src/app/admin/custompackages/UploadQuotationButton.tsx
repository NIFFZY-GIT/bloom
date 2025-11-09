'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface UploadQuotationButtonProps {
  packageId: string;
  currentPdfPath: string | null;
}

export default function UploadQuotationButton({ 
  packageId, 
  currentPdfPath 
}: UploadQuotationButtonProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      setUploadError('Please select a PDF file');
      return;
    }

    // Validate file size (max 15MB)
    const maxSize = 15 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError('PDF file is too large. Maximum size is 15MB.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('packageId', packageId.toString());

      const response = await fetch('/api/custom-packages/upload-quotation', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to upload quotation');
      }

      setUploadSuccess(true);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Refresh the page after a short delay
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload quotation';
      setUploadError(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
      <label style={{ 
        display: 'block', 
        fontSize: '0.85rem', 
        fontWeight: 600, 
        color: '#475569', 
        marginBottom: '0.5rem' 
      }}>
        <i className="fas fa-file-pdf" style={{ marginRight: '0.5rem', color: '#ef4444' }}></i>
        Quotation PDF
      </label>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            disabled={isUploading}
          />
          <button
            type="button"
            onClick={handleButtonClick}
            disabled={isUploading}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              background: currentPdfPath ? '#10b981' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: isUploading ? 'not-allowed' : 'pointer',
              opacity: isUploading ? 0.6 : 1,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s',
            }}
          >
            <i className={isUploading ? 'fas fa-spinner fa-spin' : currentPdfPath ? 'fas fa-sync-alt' : 'fas fa-upload'}></i>
            {isUploading ? 'Uploading...' : currentPdfPath ? 'Update PDF' : 'Upload PDF'}
          </button>
          
          {currentPdfPath && (
            <a
              href={currentPdfPath}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                background: '#64748b',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s',
              }}
            >
              <i className="fas fa-eye"></i>
              View PDF
            </a>
          )}
        </div>

        {uploadError && (
          <div style={{
            padding: '0.75rem',
            background: '#fee2e2',
            border: '1px solid #fca5a5',
            borderRadius: '6px',
            color: '#991b1b',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <i className="fas fa-exclamation-circle"></i>
            {uploadError}
          </div>
        )}

        {uploadSuccess && (
          <div style={{
            padding: '0.75rem',
            background: '#d1fae5',
            border: '1px solid #6ee7b7',
            borderRadius: '6px',
            color: '#065f46',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <i className="fas fa-check-circle"></i>
            Quotation uploaded successfully!
          </div>
        )}

        {currentPdfPath && !uploadError && !uploadSuccess && !isUploading && (
          <div style={{
            padding: '0.5rem',
            fontSize: '0.8rem',
            color: '#059669',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <i className="fas fa-check-circle"></i>
            Quotation available
          </div>
        )}
      </div>
    </div>
  );
}
