'use client';

import { useMemo, useState, useEffect, ChangeEvent } from 'react';
import Link from 'next/link';
import styles from './ConfirmPage.module.css';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

const BANK_DETAILS: Array<{ label: string; value: string }> = [
  { label: 'Bank Name', value: 'Brooklyn First National Bank' },
  { label: 'Account Name', value: 'Zevarone Travel Experiences LLC' },
  { label: 'Account Number', value: '0234 5678 9012' },
  { label: 'Routing Number', value: '021000021' },
  { label: 'SWIFT / BIC', value: 'BROOUS33' },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const getParam = (params: PageProps['searchParams'], key: string) => {
  const raw = params[key];
  if (!raw) return '';
  return Array.isArray(raw) ? raw[0] ?? '' : raw;
};

export default function BookingConfirmationPage({ searchParams }: PageProps) {
  const bookingData = useMemo(() => {
    const totalPrice = Number(getParam(searchParams, 'totalPrice')) || 0;
    return {
      bookingId: Number(getParam(searchParams, 'bookingId')) || null,
      packageId: getParam(searchParams, 'packageId'),
      packageTitle: getParam(searchParams, 'packageTitle'),
      category: getParam(searchParams, 'category'),
      duration: getParam(searchParams, 'duration'),
      difficulty: getParam(searchParams, 'difficulty'),
      pricePerPerson: Number(getParam(searchParams, 'pricePerPerson')) || 0,
      totalPrice,
      name: getParam(searchParams, 'name'),
      email: getParam(searchParams, 'email'),
      phone: getParam(searchParams, 'phone'),
      date: getParam(searchParams, 'date'),
      guests: Number(getParam(searchParams, 'guests')) || 1,
      message: getParam(searchParams, 'message'),
      reference: getParam(searchParams, 'reference'),
    };
  }, [searchParams]);

  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (receiptPreview) {
        URL.revokeObjectURL(receiptPreview);
      }
    };
  }, [receiptPreview]);

  if (!bookingData.packageTitle) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>
          <h2>No booking details found</h2>
          <p>
            We couldn&apos;t find the information for this booking confirmation. Please start again from the
            packages page.
          </p>
          <Link href="/packages">Browse Packages</Link>
        </div>
      </div>
    );
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      setUploadStatus('error');
      setUploadMessage('Please choose an image or PDF receipt.');
      setReceiptFile(null);
      setReceiptPreview(null);
      return;
    }

    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      setUploadStatus('error');
      setUploadMessage('Receipts must be 10MB or smaller.');
      setReceiptFile(null);
      setReceiptPreview(null);
      return;
    }

    setReceiptFile(file);
    setUploadStatus('idle');
    setUploadMessage(null);

    if (file.type.startsWith('image/')) {
      if (receiptPreview) {
        URL.revokeObjectURL(receiptPreview);
      }
      const previewUrl = URL.createObjectURL(file);
      setReceiptPreview(previewUrl);
    } else {
      setReceiptPreview(null);
    }
  };

  const handleClearReceipt = () => {
    setReceiptFile(null);
    if (receiptPreview) {
      URL.revokeObjectURL(receiptPreview);
    }
    setReceiptPreview(null);
    setUploadStatus('idle');
    setUploadMessage(null);
  };

  const handleUploadReceipt = async () => {
    if (!receiptFile) {
      setUploadStatus('error');
      setUploadMessage('Please attach your payment receipt first.');
      return;
    }

    if (!bookingData.bookingId) {
      setUploadStatus('error');
      setUploadMessage('Missing booking reference. Please contact support.');
      return;
    }

    const formData = new FormData();
    formData.append('file', receiptFile);

    setUploadStatus('uploading');
    setUploadMessage('Uploading receipt…');

    try {
      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data?.url) {
        throw new Error(data?.message || 'Receipt upload failed');
      }

      const persistResponse = await fetch(`/api/bookings/${bookingData.bookingId}/receipt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiptUrl: data.url,
          mimeType: receiptFile.type,
        }),
      });

      const persistPayload = await persistResponse.json().catch(() => ({}));

      if (!persistResponse.ok) {
        throw new Error(persistPayload?.message || 'Could not save receipt to booking.');
      }

      setUploadStatus('success');
      setUploadMessage(
        'Thank you for your patience. Our travel agents will review your payment shortly and get back to you by email and in your My Trips page.'
      );
    } catch (error) {
      console.error(error);
      setUploadStatus('error');
      setUploadMessage(
        error instanceof Error ? error.message : 'We could not upload your receipt. Please try again.'
      );
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <span className={styles.stepBadge}>Step 2</span>
          <h1 className={styles.headerTitle}>Confirm your booking details</h1>
          <p className={styles.headerSubtitle}>
            Please review the summary below, transfer the total amount to the bank account, and upload your payment
            receipt so we can lock in your experience.
          </p>
        </header>

        <div className={styles.layout}>
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Guest & booking summary</h2>
            </div>

            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Guest name</span>
                <span className={styles.detailValue}>{bookingData.name}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Email</span>
                <span className={styles.detailValue}>{bookingData.email}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Phone</span>
                <span className={styles.detailValue}>{bookingData.phone}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Preferred date</span>
                <span className={styles.detailValue}>{bookingData.date}</span>
              </div>
            </div>

            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Tour package</span>
                <span className={styles.detailValue}>{bookingData.packageTitle}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Category</span>
                <span className={styles.detailValue}>{bookingData.category}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Duration</span>
                <span className={styles.detailValue}>{bookingData.duration}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Difficulty</span>
                <span className={styles.detailValue}>{bookingData.difficulty}</span>
              </div>
            </div>

            <div className={styles.summaryList}>
              <div className={styles.summaryRow}>
                <span>Guests</span>
                <strong>{bookingData.guests}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Price per guest</span>
                <strong>{formatCurrency(bookingData.pricePerPerson)}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Total amount</span>
                <strong>{formatCurrency(bookingData.totalPrice)}</strong>
              </div>
              {bookingData.reference && (
                <div className={styles.summaryRow}>
                  <span>Booking reference</span>
                  <strong>{bookingData.reference}</strong>
                </div>
              )}
            </div>

            {bookingData.message && (
              <div className={styles.note}>
                <strong>Special notes:</strong>
                <br />
                {bookingData.message}
              </div>
            )}
          </section>

          <aside className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Payment instructions</h2>
              <span className={styles.stepBadge}>Step 3</span>
            </div>

            <p>
              Transfer the total amount using the bank details below. Include your booking reference in the payment
              description if available.
            </p>

            <div className={styles.bankList}>
              {BANK_DETAILS.map(detail => (
                <div key={detail.label} className={styles.bankRow}>
                  <span className={styles.bankLabel}>{detail.label}</span>
                  <span className={styles.bankValue}>{detail.value}</span>
                </div>
              ))}
            </div>

            <div className={styles.receiptSection}>
              <h3 className={styles.cardTitle}>Upload payment receipt</h3>
              <label className={styles.receiptDropzone}>
                <strong>Drag & drop your receipt here</strong>
                <span>Supported formats: JPG, PNG, PDF (max 10MB)</span>
                <input
                  className={styles.fileInput}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                />
              </label>

              {receiptFile && (
                <div className={styles.previewWrapper}>
                  {receiptPreview ? (
                    <img src={receiptPreview} alt="Receipt preview" className={styles.previewImage} />
                  ) : (
                    <span className={styles.pdfBadge}>
                      <i className="far fa-file-pdf" aria-hidden="true"></i>
                      {receiptFile.name}
                    </span>
                  )}
                </div>
              )}

              <div className={styles.receiptActions}>
                <button
                  type="button"
                  className={`${styles.uploadBtn} ${styles.uploadPrimary}`}
                  onClick={handleUploadReceipt}
                  disabled={uploadStatus === 'uploading'}
                >
                  {uploadStatus === 'uploading' ? 'Uploading…' : 'Submit receipt'}
                </button>
                {receiptFile && (
                  <button
                    type="button"
                    className={`${styles.uploadBtn} ${styles.uploadSecondary}`}
                    onClick={handleClearReceipt}
                    disabled={uploadStatus === 'uploading'}
                  >
                    Remove file
                  </button>
                )}
              </div>

              {uploadMessage && (
                <p
                  className={`${styles.statusMessage} ${
                    uploadStatus === 'success'
                      ? styles.statusSuccess
                      : uploadStatus === 'error'
                        ? styles.statusError
                        : ''
                  }`}
                >
                  {uploadMessage}
                  {uploadStatus === 'success' && (
                    <>
                      <br />
                      <Link href="/user_dashboard" className={styles.statusLink}>
                        View updates in My Trips
                      </Link>
                    </>
                  )}
                </p>
              )}
            </div>
          </aside>
        </div>

        <Link className={styles.backLink} href="/packages">
          <i className="fas fa-arrow-left" aria-hidden="true" /> Back to packages
        </Link>
      </div>
    </div>
  );
}
