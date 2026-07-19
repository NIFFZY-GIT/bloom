'use client';

import { useMemo, useState, useEffect, ChangeEvent, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { readJson } from '@/lib/http';
import { MAX_UPLOAD_BYTES, MAX_UPLOAD_LABEL } from '@/lib/upload-limits';
import styles from './ConfirmPage.module.css';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
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

const getParam = (params: Record<string, string | string[] | undefined>, key: string) => {
  const raw = params[key];
  if (!raw) return '';
  return Array.isArray(raw) ? raw[0] ?? '' : raw;
};

const formatDateLabel = (isoDate: string) => {
  if (!isoDate) {
    return '';
  }
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.valueOf())) {
    return isoDate;
  }
  return parsed.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatDateRangeLabel = (startIso: string, endIso: string, fallback: string) => {
  if (startIso) {
    const normalizedEnd = endIso || startIso;
    const startLabel = formatDateLabel(startIso);
    const endLabel = formatDateLabel(normalizedEnd);
    return startIso === normalizedEnd ? startLabel : `${startLabel} – ${endLabel}`;
  }
  return fallback || '—';
};

export default function BookingConfirmationPage({ searchParams }: PageProps) {
  // Unwrap the searchParams Promise
  const params = use(searchParams);
  
  const bookingData = useMemo(() => {
    const totalPrice = Number(getParam(params, 'totalPrice')) || 0;
    const startDateParam = getParam(params, 'startDate');
    const endDateParam = getParam(params, 'endDate');
    const rangeParam = getParam(params, 'dateRange');
    const [rangeStart, rangeEnd] = rangeParam.includes(':') ? rangeParam.split(':') : ['', ''];
    const fallbackDate = getParam(params, 'date');
    const startIso = startDateParam || rangeStart || fallbackDate;
    const endIso = endDateParam || rangeEnd || startIso;
    const dateDisplay = formatDateRangeLabel(startIso, endIso, fallbackDate);
    return {
      bookingId: Number(getParam(params, 'bookingId')) || null,
      packageId: getParam(params, 'packageId'),
      packageTitle: getParam(params, 'packageTitle'),
      category: getParam(params, 'category'),
      duration: getParam(params, 'duration'),
      difficulty: getParam(params, 'difficulty'),
      pricePerPerson: Number(getParam(params, 'pricePerPerson')) || 0,
      totalPrice,
      name: getParam(params, 'name'),
      email: getParam(params, 'email'),
      phone: getParam(params, 'phone'),
      startDate: startIso,
      endDate: endIso,
      dateDisplay,
      guests: Number(getParam(params, 'guests')) || 1,
      message: getParam(params, 'message'),
      reference: getParam(params, 'reference'),
    };
  }, [params]);

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

  const hasTotalPrice = bookingData.totalPrice > 0;
  const depositAmount = hasTotalPrice ? Math.round(bookingData.totalPrice * 0.1 * 100) / 100 : 0;
  const secondPaymentAmount = hasTotalPrice ? Math.round(bookingData.totalPrice * 0.4 * 100) / 100 : 0;
  const finalBalanceAmount = hasTotalPrice
    ? Math.max(Math.round((bookingData.totalPrice - depositAmount - secondPaymentAmount) * 100) / 100, 0)
    : 0;
  const secondPaymentDueDescription = (() => {
    if (!bookingData.startDate) {
      return 'At least 2 weeks before your tour date';
    }
    const startDate = new Date(bookingData.startDate);
    if (Number.isNaN(startDate.valueOf())) {
      return 'At least 2 weeks before your tour date';
    }
    const dueDate = new Date(startDate);
    dueDate.setDate(dueDate.getDate() - 14);
    const dueIso = dueDate.toISOString().split('T')[0];
    return `${formatDateLabel(dueIso)} (2 weeks before departure)`;
  })();
  const progressSteps = [
    { label: 'Choose your tour', status: 'complete' as const },
    { label: 'Confirm & pay deposit', status: 'current' as const },
    { label: 'Get ready for travel', status: 'upcoming' as const },
  ];
  const guestCountLabel = bookingData.guests === 1 ? 'guest' : 'guests';
  const nextSteps = [
    {
      title: 'Send your deposit',
      description: hasTotalPrice
        ? `Transfer ${formatCurrency(depositAmount)} today using the bank details provided.`
        : 'Transfer your 10% deposit today using the bank details provided.',
    },
    {
      title: 'Watch for our email',
      description: 'Our travel agents will confirm receipt, finalize logistics, and share tips tailored to your trip.',
    },
    {
      title: 'Plan the remaining payments',
      description: hasTotalPrice
        ? `${formatCurrency(secondPaymentAmount)} is due ${secondPaymentDueDescription}. Pay the remaining ${formatCurrency(finalBalanceAmount)} before you arrive.`
        : 'Pay 40% two weeks before your tour and settle the remaining balance before arriving in Sri Lanka.',
    },
  ];
  const overviewHighlights = [
    { label: 'Category', value: bookingData.category, icon: 'fas fa-compass' },
    { label: 'Difficulty', value: bookingData.difficulty, icon: 'fas fa-mountain' },
    { label: 'Duration', value: bookingData.duration, icon: 'fas fa-clock' },
    { label: 'Guests', value: bookingData.guests ? `${bookingData.guests} ${bookingData.guests === 1 ? 'Guest' : 'Guests'}` : '', icon: 'fas fa-user-friends' },
    { label: 'Preferred dates', value: bookingData.dateDisplay, icon: 'fas fa-calendar-alt' },
  ].filter(item => Boolean(item.value));
  const guestDetails = [
    { label: 'Guest name', value: bookingData.name, icon: 'fas fa-user' },
    { label: 'Email', value: bookingData.email, icon: 'fas fa-envelope' },
    { label: 'Phone', value: bookingData.phone, icon: 'fas fa-phone-alt' },
    { label: 'Preferred dates', value: bookingData.dateDisplay, icon: 'fas fa-calendar-day' },
  ];
  
  // Get food and special requirements from URL params
  const foodAndSpecialRequests = getParam(params, 'foodAndSpecialRequests') || '';
  
  const tourDetails = [
    { label: 'Tour package', value: bookingData.packageTitle, icon: 'fas fa-map-marked-alt' },
    { label: 'Category', value: bookingData.category, icon: 'fas fa-tags' },
    { label: 'Duration', value: bookingData.duration, icon: 'fas fa-hourglass-half' },
    { label: 'Difficulty', value: bookingData.difficulty, icon: 'fas fa-hiking' },
  ];
  const totalPriceDisplay = hasTotalPrice ? formatCurrency(bookingData.totalPrice) : '—';
  const summaryRows = [
    { label: 'Guests', value: String(bookingData.guests), icon: 'fas fa-users' },
    hasTotalPrice
      ? { label: 'Deposit due now (10%)', value: formatCurrency(depositAmount), icon: 'fas fa-piggy-bank', highlight: true }
      : null,
    { label: 'Price per guest', value: formatCurrency(bookingData.pricePerPerson), icon: 'fas fa-ticket-alt' },
    { label: 'Total amount', value: totalPriceDisplay, icon: 'fas fa-wallet', emphasis: true },
    bookingData.reference
      ? { label: 'Booking reference', value: bookingData.reference, icon: 'fas fa-receipt' }
      : null,
  ].filter(Boolean) as Array<{ label: string; value: string; icon: string; highlight?: boolean; emphasis?: boolean }>;
  const bankIcons: Record<string, string> = {
    'Bank Name': 'fas fa-university',
    'Account Name': 'fas fa-id-badge',
    'Account Number': 'fas fa-credit-card',
    'Routing Number': 'fas fa-random',
    'SWIFT / BIC': 'fas fa-globe',
  };

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

    if (file.size > MAX_UPLOAD_BYTES) {
      setUploadStatus('error');
      setUploadMessage(`Receipts must be ${MAX_UPLOAD_LABEL} or smaller.`);
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

      const data = await readJson<{ url?: string; message?: string }>(response, 'Receipt upload failed');

      if (!data?.url) {
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
            Review everything below, pay the 10% deposit to secure your experience, and follow the payment schedule so
            we can lock in every detail for your trip.
          </p>
          <ol className={styles.progressTracker}>
            {progressSteps.map(step => (
              <li key={step.label} className={`${styles.progressItem} ${styles[`progressItem_${step.status}`]}`}>
                <span className={styles.progressBullet}></span>
                <span className={styles.progressLabel}>{step.label}</span>
              </li>
            ))}
          </ol>
        </header>

        <section className={styles.overviewCard}>
          <div className={styles.overviewMain}>
            <span className={styles.overviewBadge}>Almost booked</span>
            <h2 className={styles.overviewTitle}>{bookingData.packageTitle}</h2>
            <p className={styles.overviewSubtitle}>
              Secure your {bookingData.duration?.toLowerCase() || 'tour'} for {bookingData.dateDisplay || 'your selected dates'}.
              Pay the deposit today and our experts will finalize every adventure-ready detail for you.
            </p>
            {overviewHighlights.length > 0 && (
              <div className={styles.overviewChips}>
                {overviewHighlights.map(highlight => (
                  <span key={highlight.label} className={styles.overviewChip}>
                    <i className={highlight.icon} aria-hidden="true"></i>
                    <span>
                      <small>{highlight.label}</small>
                      {highlight.value}
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className={styles.overviewStats}>
            <div className={styles.statCard}>
              <span>Total trip value</span>
              <strong>{totalPriceDisplay}</strong>
              <small>{bookingData.guests} {guestCountLabel}</small>
            </div>
            <div className={styles.statCard}>
              <span>Deposit due now</span>
              <strong>{hasTotalPrice ? formatCurrency(depositAmount) : '10%'}</strong>
              <small>Secure your preferred dates</small>
            </div>
            {bookingData.reference && (
              <div className={styles.statCard}>
                <span>Booking reference</span>
                <strong>{bookingData.reference}</strong>
                <small>Include this in payment notes</small>
              </div>
            )}
          </div>
        </section>

        {/* Step 1: Booking Overview */}
        <section className={styles.flowStep}>
          <div className={styles.stepHeader}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepTitle}>
              <h2>Your Booking Details</h2>
              <p>Review your trip information below</p>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.detailsGrid}>
              {guestDetails.map(detail => (
                <div key={detail.label} className={styles.detailItem}>
                  <span className={styles.detailIcon} aria-hidden="true">
                    <i className={detail.icon}></i>
                  </span>
                  <div className={styles.detailText}>
                    <span className={styles.detailLabel}>{detail.label}</span>
                    <span className={styles.detailValue}>{detail.value || '—'}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.detailsGrid}>
              {tourDetails.map(detail => (
                <div key={detail.label} className={styles.detailItem}>
                  <span className={styles.detailIcon} aria-hidden="true">
                    <i className={detail.icon}></i>
                  </span>
                  <div className={styles.detailText}>
                    <span className={styles.detailLabel}>{detail.label}</span>
                    <span className={styles.detailValue}>{detail.value || '—'}</span>
                  </div>
                </div>
              ))}
            </div>

            {foodAndSpecialRequests && (
              <>
                <h3 style={{ margin: '1rem 0 0.5rem', fontSize: '1.1rem', color: '#1f2937', fontWeight: 600 }}>
                  <i className="fas fa-utensils" style={{ marginRight: '0.5rem', color: '#f59e0b' }}></i>
                  Food & Special Requirements
                </h3>
                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailIcon} aria-hidden="true">
                      <i className="fas fa-clipboard-list"></i>
                    </span>
                    <div className={styles.detailText}>
                      <span className={styles.detailLabel}>Food Preferences, Allergies & Additional Information</span>
                      <span className={styles.detailValue}>{foodAndSpecialRequests}</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className={styles.summaryList}>
              {summaryRows.map(row => (
                <div
                  key={row.label}
                  className={`${styles.summaryRow} ${row.highlight ? styles.summaryRowHighlight : ''}`}
                >
                  <span className={styles.summaryRowLabel}>
                    <i className={row.icon} aria-hidden="true"></i>
                    {row.label}
                  </span>
                  <strong className={row.emphasis ? styles.summaryRowEmphasis : ''}>{row.value}</strong>
                </div>
              ))}
            </div>

            {bookingData.message && (
              <div className={styles.note}>
                <strong>Special notes:</strong>
                <br />
                {bookingData.message}
              </div>
            )}
          </div>
        </section>

        {/* Step 2: Payment Instructions */}
        <section className={styles.flowStep}>
          <div className={styles.stepHeader}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepTitle}>
              <h2>Make Your Payment</h2>
              <p>Transfer the deposit to secure your booking</p>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.paymentNotice}>
              <h3>Payment schedule</h3>
              <ul className={styles.paymentSchedule}>
                <li>
                  <strong>Today · 10% deposit</strong>
                  <span>
                    Pay {hasTotalPrice ? formatCurrency(depositAmount) : '10% of your total'} now to secure your booking
                    and keep your preferred dates.
                  </span>
                </li>
                <li>
                  <strong>Two weeks before your tour · 40%</strong>
                  <span>
                    Settle {hasTotalPrice ? formatCurrency(secondPaymentAmount) : '40% of your total'} by {secondPaymentDueDescription}
                    so we can finalize reservations.
                  </span>
                </li>
                <li>
                  <strong>Before arriving in Sri Lanka · Remaining balance</strong>
                  <span>
                    Pay {hasTotalPrice ? formatCurrency(finalBalanceAmount) : 'the remaining balance'} before you arrive to ensure
                    everything is ready when you land.
                  </span>
                </li>
              </ul>
              <p className={styles.paymentNote}>
                Include your booking reference in each transfer description. This helps us verify payments quickly and keep
                your agents in the loop.
              </p>
            </div>

            <div className={styles.bankDetailsSection}>
              <h3>Bank transfer details</h3>
              <p className={styles.bankIntro}>Use these details to send your {hasTotalPrice ? formatCurrency(depositAmount) : '10%'} deposit:</p>
              <div className={styles.bankList}>
                {BANK_DETAILS.map(detail => (
                  <div key={detail.label} className={styles.bankRow}>
                    <span className={styles.bankIcon} aria-hidden="true">
                      <i className={bankIcons[detail.label] ?? 'fas fa-info-circle'}></i>
                    </span>
                    <div className={styles.bankText}>
                      <span className={styles.bankLabel}>{detail.label}</span>
                      <span className={styles.bankValue}>{detail.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Step 3: Upload Receipt */}
        <section className={styles.flowStep}>
          <div className={styles.stepHeader}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepTitle}>
              <h2>Upload Your Payment Receipt</h2>
              <p>After making the payment, upload proof here so we can confirm your booking</p>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.receiptSection}>
              <div className={styles.receiptInstructions}>
                <i className="fas fa-info-circle"></i>
                <div>
                  <strong>Why do I need to upload a receipt?</strong>
                  <p>Your receipt helps us verify your payment quickly so we can start preparing your amazing trip right away!</p>
                </div>
              </div>

              <label className={styles.receiptDropzone}>
                <i className="fas fa-cloud-upload-alt" style={{ fontSize: '3rem', color: '#6366f1', marginBottom: '1rem' }}></i>
                <strong>Click here to choose your receipt file</strong>
                <span>or drag and drop it here</span>
                <span style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Accepted: JPG, PNG, PDF (max {MAX_UPLOAD_LABEL})</span>
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
                    <Image src={receiptPreview} alt="Receipt preview" className={styles.previewImage} width={300} height={400} style={{ objectFit: 'contain' }} />
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
                  {uploadStatus === 'uploading' ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Uploading…
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check-circle"></i> Submit receipt
                    </>
                  )}
                </button>
                {receiptFile && (
                  <button
                    type="button"
                    className={`${styles.uploadBtn} ${styles.uploadSecondary}`}
                    onClick={handleClearReceipt}
                    disabled={uploadStatus === 'uploading'}
                  >
                    <i className="fas fa-times"></i> Remove file
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
                  {uploadStatus === 'success' && <i className="fas fa-check-circle"></i>}
                  {uploadStatus === 'error' && <i className="fas fa-exclamation-circle"></i>}
                  {uploadMessage}
                  {uploadStatus === 'success' && (
                    <>
                      <br />
                      <Link href="/user_dashboard" className={styles.statusLink}>
                        <i className="fas fa-arrow-right"></i> View updates in My Trips
                      </Link>
                    </>
                  )}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* What's Next Section */}
        <div className={styles.bottomSection}>
          <section className={styles.nextSteps}>
            <h2>What happens next?</h2>
            <ol>
              {nextSteps.map(step => (
                <li key={step.title}>
                  <strong>{step.title}</strong>
                  <span>{step.description}</span>
                </li>
              ))}
            </ol>
          </section>
          <aside className={styles.supportCard}>
            <h3>Need a hand?</h3>
            <p>
              Our travel concierge team is here to help with payment questions, itinerary tweaks, or anything else you
              need before you fly.
            </p>
            <div className={styles.supportList}>
              <span>
                <i className="fas fa-envelope" aria-hidden="true"></i>
                <a href="mailto:contact@tropicalbloom.lk">contact@tropicalbloom.lk</a>
              </span>
              <span>
                <i className="fas fa-phone" aria-hidden="true"></i>
                <a href="tel:+94115551234">+94 77 733 0012</a>
              </span>
              <span>
                <i className="fas fa-comment-dots" aria-hidden="true"></i>
                <Link href="/contact-us">Chat with us</Link>
              </span>
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
