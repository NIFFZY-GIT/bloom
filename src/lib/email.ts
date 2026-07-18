import nodemailer from 'nodemailer';

// SMTP config. The .env for this project uses SMTP_* names, but earlier code read
// EMAIL_* names — that mismatch left host/user/pass undefined so no mail ever sent.
// Read SMTP_* first and fall back to EMAIL_* so both naming schemes work.
const smtpHost = process.env.SMTP_HOST || process.env.EMAIL_HOST;
const smtpPort = Number(process.env.SMTP_PORT || process.env.EMAIL_PORT || 587);
const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASSWORD;
// Port 465 is implicit TLS; otherwise honor an explicit *_SECURE flag.
const smtpSecure =
  (process.env.SMTP_SECURE || process.env.EMAIL_SECURE) === 'true' || smtpPort === 465;

// The address messages are sent "from" (and shown as the support/contact address).
const SUPPORT_EMAIL =
  process.env.SMTP_FROM || smtpUser || process.env.ADMIN_EMAIL || 'no-reply@zevarone.com';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure, // true for 465, false for other ports
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const fromName = process.env.EMAIL_FROM_NAME || process.env.SMTP_FROM_NAME || 'Tropical Bloom Tourism';
    const fromEmail = SUPPORT_EMAIL;

    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    console.log(`Email sent successfully to ${options.to}`);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

export async function sendPasswordResetCode(email: string, code: string): Promise<boolean> {
  const subject = 'Password Reset Verification Code';
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: linear-gradient(135deg, #fff9f6 0%, #ffffff 100%);
            border: 2px solid #ffe8de;
            border-radius: 20px;
            padding: 40px;
            text-align: center;
          }
          .logo {
            font-size: 2rem;
            font-weight: 800;
            color: #ff6b35;
            margin-bottom: 20px;
          }
          h1 {
            color: #1f2937;
            font-size: 24px;
            margin-bottom: 20px;
          }
          .code-box {
            background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%);
            color: white;
            font-size: 36px;
            font-weight: 800;
            letter-spacing: 8px;
            padding: 20px 40px;
            border-radius: 12px;
            margin: 30px 0;
            display: inline-block;
          }
          .info {
            color: #6b7280;
            font-size: 14px;
            margin-top: 20px;
          }
          .warning {
            background: #fef3c7;
            color: #92400e;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            font-size: 14px;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #ffe8de;
            color: #9ca3af;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">🌴 Tropical Bloom Tourism</div>
          <h1>Password Reset Request</h1>
          <p>You requested to reset your password. Use the verification code below:</p>
          
          <div class="code-box">${code}</div>
          
          <div class="info">
            <p>This code will expire in <strong>10 minutes</strong>.</p>
            <p>Enter this code on the password reset page to continue.</p>
          </div>
          
          <div class="warning">
            ⚠️ If you didn't request this password reset, please ignore this email and your password will remain unchanged.
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} Tropical Bloom Tourism. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Password Reset Verification Code

Your verification code is: ${code}

This code will expire in 10 minutes.

If you didn't request this password reset, please ignore this email.

© ${new Date().getFullYear()} Tropical Bloom Tourism
  `.trim();

  return await sendEmail({
    to: email,
    subject,
    text,
    html,
  });
}

export async function sendPasswordChangedConfirmation(email: string): Promise<boolean> {
  const subject = 'Password Successfully Changed';
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: linear-gradient(135deg, #d1fae5 0%, #ffffff 100%);
            border: 2px solid #a7f3d0;
            border-radius: 20px;
            padding: 40px;
            text-align: center;
          }
          .logo {
            font-size: 2rem;
            font-weight: 800;
            color: #ff6b35;
            margin-bottom: 20px;
          }
          .success-icon {
            font-size: 64px;
            margin-bottom: 20px;
          }
          h1 {
            color: #065f46;
            font-size: 24px;
            margin-bottom: 20px;
          }
          .info {
            color: #047857;
            font-size: 16px;
            margin: 20px 0;
          }
          .warning {
            background: #fef3c7;
            color: #92400e;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            font-size: 14px;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #a7f3d0;
            color: #9ca3af;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">🌴 Tropical Bloom Tourism</div>
          <div class="success-icon">✅</div>
          <h1>Password Successfully Changed</h1>
          
          <div class="info">
            <p>Your password has been successfully updated.</p>
            <p>You can now use your new password to log in to your account.</p>
          </div>
          
          <div class="warning">
            ⚠️ If you didn't make this change, please contact our support team immediately at <strong>${SUPPORT_EMAIL}</strong>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} Tropical Bloom Tourism. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Password Successfully Changed

Your password has been successfully updated.

You can now use your new password to log in to your account.

If you didn't make this change, please contact our support team immediately at ${SUPPORT_EMAIL}

© ${new Date().getFullYear()} Tropical Bloom Tourism
  `.trim();

  return await sendEmail({
    to: email,
    subject,
    text,
    html,
  });
}

// Notify admin about new package booking
export async function notifyAdminNewBooking(bookingDetails: {
  bookingId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  packageName: string;
  preferredDate: string;
  preferredEndDate?: string;
  numberOfGuests: number;
  totalAmount: number;
  pricePerPerson: number;
  specialRequests?: string | null;
  toEmail?: string; // Optional: specific admin email to send to
}): Promise<boolean> {
  const adminEmail = bookingDetails.toEmail || SUPPORT_EMAIL || 'admin@zevarone.com';
  const subject = `🎯 New Booking #${bookingDetails.bookingId} - ${bookingDetails.packageName}`;
  
  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9fafb;
          }
          .container {
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          .logo {
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 10px;
          }
          .header-subtitle {
            font-size: 1.1rem;
            opacity: 0.95;
          }
          .content {
            padding: 40px 30px;
          }
          .alert-badge {
            background: #ff6b35;
            color: white;
            padding: 8px 20px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            display: inline-block;
            margin-bottom: 20px;
          }
          h1 {
            color: #1f2937;
            font-size: 28px;
            margin-bottom: 10px;
          }
          .booking-ref {
            color: #6b7280;
            font-size: 16px;
            margin-bottom: 30px;
          }
          .invoice-box {
            background: #f9fafb;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
          }
          .invoice-title {
            color: #ff6b35;
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .invoice-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .invoice-row:last-child {
            border-bottom: none;
          }
          .invoice-label {
            color: #6b7280;
            font-weight: 500;
          }
          .invoice-value {
            color: #1f2937;
            font-weight: 600;
          }
          .total-row {
            background: linear-gradient(135deg, #fff9f6 0%, #ffe8de 100%);
            margin: 20px -25px -25px -25px;
            padding: 20px 25px;
            border-radius: 0 0 12px 12px;
          }
          .total-label {
            font-size: 18px;
            font-weight: 700;
            color: #1f2937;
          }
          .total-amount {
            font-size: 24px;
            font-weight: 800;
            color: #ff6b35;
          }
          .customer-section {
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            border-radius: 12px;
            padding: 20px;
            margin: 25px 0;
          }
          .section-title {
            color: #1e40af;
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
          }
          .detail-item {
            padding: 8px 0;
            display: flex;
            align-items: start;
          }
          .detail-icon {
            color: #3b82f6;
            margin-right: 10px;
            font-size: 18px;
          }
          .detail-content {
            flex: 1;
          }
          .detail-label {
            color: #1e3a8a;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
          }
          .detail-value {
            color: #1e40af;
            font-size: 16px;
            font-weight: 600;
          }
          .special-note {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .special-note-title {
            color: #92400e;
            font-weight: 700;
            margin-bottom: 5px;
          }
          .special-note-text {
            color: #78350f;
            font-size: 14px;
          }
          .action-btn {
            display: inline-block;
            background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%);
            color: white;
            padding: 14px 32px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 700;
            font-size: 16px;
            margin: 20px 0;
            text-align: center;
          }
          .footer {
            background: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
          }
          .footer-text {
            color: #6b7280;
            font-size: 14px;
            margin: 5px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🌴 Tropical Bloom Tourism</div>
            <div class="header-subtitle">Admin Notification</div>
          </div>
          
          <div class="content">
            <span class="alert-badge">🔔 New Booking Alert</span>
            <h1>Package Booking Received</h1>
            <p class="booking-ref">Booking Reference: <strong>#${bookingDetails.bookingId}</strong></p>
            
            <p style="color: #4b5563; font-size: 16px; margin-bottom: 25px;">
              A new booking has been placed for <strong>${bookingDetails.packageName}</strong>. 
              Review the details below and follow up with the customer.
            </p>

            <div class="invoice-box">
              <div class="invoice-title">📋 Booking Invoice</div>
              
              <div class="invoice-row">
                <span class="invoice-label">Package</span>
                <span class="invoice-value">${bookingDetails.packageName}</span>
              </div>
              
              <div class="invoice-row">
                <span class="invoice-label">Price per Person</span>
                <span class="invoice-value">${formatCurrency(bookingDetails.pricePerPerson)}</span>
              </div>
              
              <div class="invoice-row">
                <span class="invoice-label">Number of Guests</span>
                <span class="invoice-value">${bookingDetails.numberOfGuests} ${bookingDetails.numberOfGuests === 1 ? 'Guest' : 'Guests'}</span>
              </div>
              
              <div class="invoice-row">
                <span class="invoice-label">Travel Start Date</span>
                <span class="invoice-value">${new Date(bookingDetails.preferredDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              
              ${bookingDetails.preferredEndDate ? `
              <div class="invoice-row">
                <span class="invoice-label">Travel End Date</span>
                <span class="invoice-value">${new Date(bookingDetails.preferredEndDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              ` : ''}
              
              <div class="invoice-row">
                <span class="invoice-label">Booking Date</span>
                <span class="invoice-value">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              
              <div class="total-row">
                <div class="invoice-row" style="border: none;">
                  <span class="total-label">Total Amount</span>
                  <span class="total-amount">${formatCurrency(bookingDetails.totalAmount)}</span>
                </div>
              </div>
            </div>

            <div class="customer-section">
              <div class="section-title">👤 Customer Information</div>
              
              <div class="detail-item">
                <span class="detail-icon">👤</span>
                <div class="detail-content">
                  <div class="detail-label">Full Name</div>
                  <div class="detail-value">${bookingDetails.customerName}</div>
                </div>
              </div>
              
              <div class="detail-item">
                <span class="detail-icon">📧</span>
                <div class="detail-content">
                  <div class="detail-label">Email Address</div>
                  <div class="detail-value">${bookingDetails.customerEmail}</div>
                </div>
              </div>
              
              ${bookingDetails.customerPhone ? `
              <div class="detail-item">
                <span class="detail-icon">📱</span>
                <div class="detail-content">
                  <div class="detail-label">Phone Number</div>
                  <div class="detail-value">${bookingDetails.customerPhone}</div>
                </div>
              </div>
              ` : ''}
            </div>

            ${bookingDetails.specialRequests ? `
            <div class="special-note">
              <div class="special-note-title">📝 Special Requests from Customer</div>
              <div class="special-note-text">${bookingDetails.specialRequests}</div>
            </div>
            ` : ''}

            <center>
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/bookings" class="action-btn">
                Manage Booking →
              </a>
            </center>

            <p style="color: #6b7280; font-size: 14px; margin-top: 30px; padding: 20px; background: #f3f4f6; border-radius: 8px;">
              <strong>⚠️ Action Required:</strong><br>
              • Verify customer payment receipt when uploaded<br>
              • Confirm booking status within 24-48 hours<br>
              • Send final itinerary to customer<br>
              • Coordinate with service providers
            </p>
          </div>
          
          <div class="footer">
            <p class="footer-text">
              <strong>Tropical Bloom Tourism Admin Panel</strong>
            </p>
            <p class="footer-text">
              © ${new Date().getFullYear()} Tropical Bloom Tourism. All rights reserved.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
🎯 NEW BOOKING ALERT - BLOOM TRAVEL

Booking Reference: #${bookingDetails.bookingId}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BOOKING INVOICE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Package: ${bookingDetails.packageName}
Price per Person: ${formatCurrency(bookingDetails.pricePerPerson)}
Number of Guests: ${bookingDetails.numberOfGuests}
Travel Start: ${new Date(bookingDetails.preferredDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
${bookingDetails.preferredEndDate ? `Travel End: ${new Date(bookingDetails.preferredEndDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}` : ''}
Booking Time: ${new Date().toLocaleString('en-US')}

TOTAL AMOUNT: ${formatCurrency(bookingDetails.totalAmount)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CUSTOMER INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name: ${bookingDetails.customerName}
Email: ${bookingDetails.customerEmail}
${bookingDetails.customerPhone ? `Phone: ${bookingDetails.customerPhone}` : ''}

${bookingDetails.specialRequests ? `
SPECIAL REQUESTS:
${bookingDetails.specialRequests}
` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Manage this booking: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/bookings
  `.trim();

  return await sendEmail({
    to: adminEmail,
    subject,
    text,
    html,
  });
}

// Notify admin about new custom package request
export async function notifyAdminCustomPackage(customPackageDetails: {
  packageId: string;
  packageName: string;
  customerEmail: string;
  customerPhone: string | null;
  guests: number;
  duration: string;
  places: string[];
  dateRange: string;
  toEmail?: string; // Optional: specific admin email to send to
}): Promise<boolean> {
  const adminEmail = customPackageDetails.toEmail || SUPPORT_EMAIL || 'admin@zevarone.com';
  const subject = `✨ New Custom Package Request - ${customPackageDetails.packageName}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: linear-gradient(135deg, #fff9f6 0%, #ffffff 100%);
            border: 2px solid #ffe8de;
            border-radius: 20px;
            padding: 40px;
          }
          .logo {
            font-size: 2rem;
            font-weight: 800;
            color: #ff6b35;
            margin-bottom: 20px;
            text-align: center;
          }
          .badge {
            background: linear-gradient(135deg, #a855f7 0%, #c084fc 100%);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            display: inline-block;
            margin-bottom: 20px;
          }
          h1 {
            color: #1f2937;
            font-size: 24px;
            margin-bottom: 20px;
          }
          .info-box {
            background: white;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #f3f4f6;
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .info-label {
            color: #6b7280;
            font-weight: 600;
          }
          .info-value {
            color: #1f2937;
            font-weight: 500;
          }
          .places-list {
            background: #f9fafb;
            border-radius: 8px;
            padding: 15px;
            margin: 15px 0;
          }
          .place-item {
            padding: 5px 0;
            color: #374151;
          }
          .action-btn {
            display: inline-block;
            background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%);
            color: white;
            padding: 12px 30px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 600;
            margin-top: 20px;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #ffe8de;
            color: #9ca3af;
            font-size: 12px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">🌴 Tropical Bloom Tourism</div>
          <div class="badge">✨ CUSTOM PACKAGE REQUEST</div>
          <h1>${customPackageDetails.packageName}</h1>
          
          <div class="info-box">
            <div class="info-row">
              <span class="info-label">Package ID:</span>
              <span class="info-value">#${customPackageDetails.packageId}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Customer Email:</span>
              <span class="info-value">${customPackageDetails.customerEmail}</span>
            </div>
            ${customPackageDetails.customerPhone ? `
            <div class="info-row">
              <span class="info-label">Phone:</span>
              <span class="info-value">${customPackageDetails.customerPhone}</span>
            </div>
            ` : ''}
            <div class="info-row">
              <span class="info-label">Guests:</span>
              <span class="info-value">${customPackageDetails.guests}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Duration:</span>
              <span class="info-value">${customPackageDetails.duration}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Travel Dates:</span>
              <span class="info-value">${customPackageDetails.dateRange}</span>
            </div>
          </div>

          <h3 style="color: #1f2937;">Selected Places:</h3>
          <div class="places-list">
            ${customPackageDetails.places.map((place, idx) => `
              <div class="place-item">${idx + 1}. ${place}</div>
            `).join('')}
          </div>

          <p style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/custompackages" class="action-btn">
              View in Admin Panel
            </a>
          </p>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} Tropical Bloom Tourism. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
New Custom Package Request

Package: ${customPackageDetails.packageName}
Customer Email: ${customPackageDetails.customerEmail}
Phone: ${customPackageDetails.customerPhone || 'N/A'}
Guests: ${customPackageDetails.guests}
Duration: ${customPackageDetails.duration}
Travel Dates: ${customPackageDetails.dateRange}

Selected Places:
${customPackageDetails.places.map((place, idx) => `${idx + 1}. ${place}`).join('\n')}

View in admin panel: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/custompackages
  `.trim();

  return await sendEmail({
    to: adminEmail,
    subject,
    text,
    html,
  });
}

// Notify user about quotation upload
export async function notifyUserQuotationUploaded(userDetails: {
  email: string;
  packageName: string;
  quotationUrl: string;
}): Promise<boolean> {
  const subject = `📄 Your Quotation is Ready - ${userDetails.packageName}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: linear-gradient(135deg, #d1fae5 0%, #ffffff 100%);
            border: 2px solid #a7f3d0;
            border-radius: 20px;
            padding: 40px;
          }
          .logo {
            font-size: 2rem;
            font-weight: 800;
            color: #ff6b35;
            margin-bottom: 20px;
            text-align: center;
          }
          .badge {
            background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            display: inline-block;
            margin-bottom: 20px;
          }
          h1 {
            color: #065f46;
            font-size: 24px;
            margin-bottom: 20px;
          }
          .message {
            background: white;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
            color: #374151;
            line-height: 1.8;
          }
          .action-btn {
            display: inline-block;
            background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%);
            color: white;
            padding: 15px 35px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 700;
            margin: 20px 10px;
            font-size: 16px;
          }
          .secondary-btn {
            display: inline-block;
            background: white;
            color: #ff6b35;
            border: 2px solid #ff6b35;
            padding: 15px 35px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 700;
            margin: 20px 10px;
            font-size: 16px;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #a7f3d0;
            color: #9ca3af;
            font-size: 12px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">🌴 Tropical Bloom Tourism</div>
          <div class="badge">✅ QUOTATION READY</div>
          <h1>Your Custom Package Quotation is Ready!</h1>
          
          <div class="message">
            <p>Great news! We've prepared a personalized quotation for your custom travel package: <strong>${userDetails.packageName}</strong></p>
            
            <p>Our team has carefully crafted this quotation based on your preferences and selected destinations. You can now view and download your quotation to review all the details.</p>
            
            <p><strong>What's next?</strong></p>
            <ul>
              <li>Review your quotation details</li>
              <li>Check the itinerary and pricing</li>
              <li>Contact us if you have any questions</li>
              <li>Proceed with booking when ready</li>
            </ul>
          </div>

          <div style="text-align: center;">
            <a href="${userDetails.quotationUrl}" class="action-btn">
              📄 View Quotation
            </a>
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/user_dashboard" class="secondary-btn">
              Go to My Trips
            </a>
          </div>
          
          <div class="footer">
            <p>Questions? Contact us at ${SUPPORT_EMAIL}</p>
            <p>© ${new Date().getFullYear()} Tropical Bloom Tourism. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Your Custom Package Quotation is Ready!

Great news! We've prepared a personalized quotation for your custom travel package: ${userDetails.packageName}

View your quotation: ${userDetails.quotationUrl}
Visit your dashboard: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/user_dashboard

What's next?
- Review your quotation details
- Check the itinerary and pricing
- Contact us if you have any questions
- Proceed with booking when ready

Questions? Contact us at ${SUPPORT_EMAIL}

© ${new Date().getFullYear()} Tropical Bloom Tourism
  `.trim();

  return await sendEmail({
    to: userDetails.email,
    subject,
    text,
    html,
  });
}

// Notify user about booking status change
export async function notifyUserBookingStatusChange(userDetails: {
  email: string;
  bookingId: string;
  packageName: string;
  newStatus: string;
}): Promise<boolean> {
  const statusColors: Record<string, { bg: string; text: string; emoji: string }> = {
    CONFIRMED: { bg: '#d1fae5', text: '#065f46', emoji: '✅' },
    CANCELLED: { bg: '#fee2e2', text: '#991b1b', emoji: '❌' },
    PENDING: { bg: '#fef3c7', text: '#92400e', emoji: '⏳' },
  };

  const status = statusColors[userDetails.newStatus] || statusColors.PENDING;
  const subject = `${status.emoji} Booking Status Update - #${userDetails.bookingId}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: linear-gradient(135deg, #fff9f6 0%, #ffffff 100%);
            border: 2px solid #ffe8de;
            border-radius: 20px;
            padding: 40px;
          }
          .logo {
            font-size: 2rem;
            font-weight: 800;
            color: #ff6b35;
            margin-bottom: 20px;
            text-align: center;
          }
          .status-badge {
            background: ${status.bg};
            color: ${status.text};
            padding: 10px 20px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: 700;
            display: inline-block;
            margin: 20px 0;
          }
          h1 {
            color: #1f2937;
            font-size: 24px;
            margin-bottom: 20px;
          }
          .message {
            background: white;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
            color: #374151;
            line-height: 1.8;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #f3f4f6;
          }
          .info-label {
            color: #6b7280;
            font-weight: 600;
          }
          .info-value {
            color: #1f2937;
            font-weight: 500;
          }
          .action-btn {
            display: inline-block;
            background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%);
            color: white;
            padding: 12px 30px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 600;
            margin-top: 20px;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #ffe8de;
            color: #9ca3af;
            font-size: 12px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">🌴 Tropical Bloom Tourism</div>
          <h1>Booking Status Update</h1>
          <div style="text-align: center;">
            <div class="status-badge">${status.emoji} ${userDetails.newStatus}</div>
          </div>
          
          <div class="message">
            <p>Your booking status has been updated.</p>
            <div class="info-row">
              <span class="info-label">Booking ID:</span>
              <span class="info-value">#${userDetails.bookingId}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Package:</span>
              <span class="info-value">${userDetails.packageName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Status:</span>
              <span class="info-value">${userDetails.newStatus}</span>
            </div>
          </div>

          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/user_dashboard" class="action-btn">
              View My Bookings
            </a>
          </div>
          
          <div class="footer">
            <p>Questions? Contact us at ${SUPPORT_EMAIL}</p>
            <p>© ${new Date().getFullYear()} Tropical Bloom Tourism. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Booking Status Update

Booking ID: #${userDetails.bookingId}
Package: ${userDetails.packageName}
New Status: ${userDetails.newStatus}

View your bookings: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/user_dashboard

Questions? Contact us at ${SUPPORT_EMAIL}

© ${new Date().getFullYear()} Tropical Bloom Tourism
  `.trim();

  return await sendEmail({
    to: userDetails.email,
    subject,
    text,
    html,
  });
}

// Notify user about payment status change
export async function notifyUserPaymentStatusChange(userDetails: {
  email: string;
  bookingId: string;
  packageName: string;
  newPaymentStatus: string;
}): Promise<boolean> {
  const statusInfo: Record<string, { emoji: string; message: string }> = {
    UNDER_REVIEW: { 
      emoji: '🔍', 
      message: 'We have received your payment receipt and are currently reviewing it.' 
    },
    APPROVED: { 
      emoji: '✅', 
      message: 'Your payment has been verified and approved. Your booking is confirmed!' 
    },
    REJECTED: { 
      emoji: '❌', 
      message: 'Your payment receipt could not be verified. Please upload a valid receipt or contact us.' 
    },
  };

  const status = statusInfo[userDetails.newPaymentStatus] || statusInfo.UNDER_REVIEW;
  const subject = `${status.emoji} Payment Status Update - #${userDetails.bookingId}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: linear-gradient(135deg, #fff9f6 0%, #ffffff 100%);
            border: 2px solid #ffe8de;
            border-radius: 20px;
            padding: 40px;
          }
          .logo {
            font-size: 2rem;
            font-weight: 800;
            color: #ff6b35;
            margin-bottom: 20px;
            text-align: center;
          }
          h1 {
            color: #1f2937;
            font-size: 24px;
            margin-bottom: 20px;
          }
          .status-icon {
            font-size: 64px;
            text-align: center;
            margin: 20px 0;
          }
          .message {
            background: white;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
            color: #374151;
            line-height: 1.8;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #f3f4f6;
          }
          .info-label {
            color: #6b7280;
            font-weight: 600;
          }
          .info-value {
            color: #1f2937;
            font-weight: 500;
          }
          .action-btn {
            display: inline-block;
            background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%);
            color: white;
            padding: 12px 30px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 600;
            margin-top: 20px;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #ffe8de;
            color: #9ca3af;
            font-size: 12px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">🌴 Tropical Bloom Tourism</div>
          <div class="status-icon">${status.emoji}</div>
          <h1>Payment Status Update</h1>
          
          <div class="message">
            <p>${status.message}</p>
            <div class="info-row">
              <span class="info-label">Booking ID:</span>
              <span class="info-value">#${userDetails.bookingId}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Package:</span>
              <span class="info-value">${userDetails.packageName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Payment Status:</span>
              <span class="info-value">${userDetails.newPaymentStatus.replace('_', ' ')}</span>
            </div>
          </div>

          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/user_dashboard" class="action-btn">
              View My Bookings
            </a>
          </div>
          
          <div class="footer">
            <p>Questions? Contact us at ${SUPPORT_EMAIL}</p>
            <p>© ${new Date().getFullYear()} Tropical Bloom Tourism. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Payment Status Update

${status.message}

Booking ID: #${userDetails.bookingId}
Package: ${userDetails.packageName}
Payment Status: ${userDetails.newPaymentStatus.replace('_', ' ')}

View your bookings: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/user_dashboard

Questions? Contact us at ${SUPPORT_EMAIL}

© ${new Date().getFullYear()} Tropical Bloom Tourism
  `.trim();

  return await sendEmail({
    to: userDetails.email,
    subject,
    text,
    html,
  });
}

// Send booking confirmation invoice to user
export async function sendBookingConfirmationToUser(bookingDetails: {
  bookingId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  packageName: string;
  preferredStartDate: string;
  preferredEndDate: string;
  numberOfGuests: number;
  pricePerPerson: number;
  totalAmount: number;
  specialRequests?: string | null;
}): Promise<boolean> {
  const subject = `🎉 Booking Confirmation - ${bookingDetails.packageName}`;
  
  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9fafb;
          }
          .container {
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          .logo {
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 10px;
          }
          .header-subtitle {
            font-size: 1.1rem;
            opacity: 0.95;
          }
          .content {
            padding: 40px 30px;
          }
          .success-badge {
            background: #10b981;
            color: white;
            padding: 8px 20px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            display: inline-block;
            margin-bottom: 20px;
          }
          h1 {
            color: #1f2937;
            font-size: 28px;
            margin-bottom: 10px;
          }
          .booking-ref {
            color: #6b7280;
            font-size: 16px;
            margin-bottom: 30px;
          }
          .invoice-box {
            background: #f9fafb;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
          }
          .invoice-title {
            color: #ff6b35;
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .invoice-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .invoice-row:last-child {
            border-bottom: none;
          }
          .invoice-label {
            color: #6b7280;
            font-weight: 500;
          }
          .invoice-value {
            color: #1f2937;
            font-weight: 600;
          }
          .total-row {
            background: linear-gradient(135deg, #fff9f6 0%, #ffe8de 100%);
            margin: 20px -25px -25px -25px;
            padding: 20px 25px;
            border-radius: 0 0 12px 12px;
          }
          .total-label {
            font-size: 18px;
            font-weight: 700;
            color: #1f2937;
          }
          .total-amount {
            font-size: 24px;
            font-weight: 800;
            color: #ff6b35;
          }
          .details-section {
            margin: 30px 0;
          }
          .section-title {
            color: #1f2937;
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #ff6b35;
          }
          .detail-item {
            padding: 10px 0;
            display: flex;
            align-items: start;
          }
          .detail-icon {
            color: #ff6b35;
            margin-right: 10px;
            font-size: 18px;
          }
          .detail-content {
            flex: 1;
          }
          .detail-label {
            color: #6b7280;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
          }
          .detail-value {
            color: #1f2937;
            font-size: 16px;
            font-weight: 600;
          }
          .special-note {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .special-note-title {
            color: #92400e;
            font-weight: 700;
            margin-bottom: 5px;
          }
          .special-note-text {
            color: #78350f;
            font-size: 14px;
          }
          .next-steps {
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            border-radius: 12px;
            padding: 20px;
            margin: 30px 0;
          }
          .next-steps-title {
            color: #1e40af;
            font-weight: 700;
            margin-bottom: 15px;
            font-size: 16px;
          }
          .step-item {
            display: flex;
            align-items: start;
            margin: 10px 0;
          }
          .step-number {
            background: #3b82f6;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 12px;
            margin-right: 12px;
            flex-shrink: 0;
          }
          .step-text {
            color: #1e40af;
            font-size: 14px;
            line-height: 1.5;
          }
          .action-btn {
            display: inline-block;
            background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%);
            color: white;
            padding: 14px 32px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 700;
            font-size: 16px;
            margin: 20px 0;
            text-align: center;
          }
          .footer {
            background: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
          }
          .footer-text {
            color: #6b7280;
            font-size: 14px;
            margin: 5px 0;
          }
          .footer-link {
            color: #ff6b35;
            text-decoration: none;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🌴 Tropical Bloom Tourism</div>
            <div class="header-subtitle">Your Adventure Awaits</div>
          </div>
          
          <div class="content">
            <span class="success-badge">✓ Booking Confirmed</span>
            <h1>Thank you for your booking!</h1>
            <p class="booking-ref">Booking Reference: <strong>#${bookingDetails.bookingId}</strong></p>
            
            <p style="color: #4b5563; font-size: 16px; margin-bottom: 25px;">
              Dear ${bookingDetails.customerName}, we're thrilled to confirm your booking for <strong>${bookingDetails.packageName}</strong>. 
              Your journey begins soon, and we can't wait to make it unforgettable!
            </p>

            <div class="invoice-box">
              <div class="invoice-title">📋 Booking Invoice</div>
              
              <div class="invoice-row">
                <span class="invoice-label">Package</span>
                <span class="invoice-value">${bookingDetails.packageName}</span>
              </div>
              
              <div class="invoice-row">
                <span class="invoice-label">Price per Person</span>
                <span class="invoice-value">${formatCurrency(bookingDetails.pricePerPerson)}</span>
              </div>
              
              <div class="invoice-row">
                <span class="invoice-label">Number of Guests</span>
                <span class="invoice-value">${bookingDetails.numberOfGuests} ${bookingDetails.numberOfGuests === 1 ? 'Guest' : 'Guests'}</span>
              </div>
              
              <div class="invoice-row">
                <span class="invoice-label">Travel Start Date</span>
                <span class="invoice-value">${new Date(bookingDetails.preferredStartDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              
              <div class="invoice-row">
                <span class="invoice-label">Travel End Date</span>
                <span class="invoice-value">${new Date(bookingDetails.preferredEndDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              
              <div class="total-row">
                <div class="invoice-row" style="border: none;">
                  <span class="total-label">Total Amount</span>
                  <span class="total-amount">${formatCurrency(bookingDetails.totalAmount)}</span>
                </div>
              </div>
            </div>

            <div class="details-section">
              <div class="section-title">📞 Contact Information</div>
              
              <div class="detail-item">
                <span class="detail-icon">👤</span>
                <div class="detail-content">
                  <div class="detail-label">Full Name</div>
                  <div class="detail-value">${bookingDetails.customerName}</div>
                </div>
              </div>
              
              <div class="detail-item">
                <span class="detail-icon">📧</span>
                <div class="detail-content">
                  <div class="detail-label">Email Address</div>
                  <div class="detail-value">${bookingDetails.customerEmail}</div>
                </div>
              </div>
              
              ${bookingDetails.customerPhone ? `
              <div class="detail-item">
                <span class="detail-icon">📱</span>
                <div class="detail-content">
                  <div class="detail-label">Phone Number</div>
                  <div class="detail-value">${bookingDetails.customerPhone}</div>
                </div>
              </div>
              ` : ''}
            </div>

            ${bookingDetails.specialRequests ? `
            <div class="special-note">
              <div class="special-note-title">📝 Special Requests</div>
              <div class="special-note-text">${bookingDetails.specialRequests}</div>
            </div>
            ` : ''}

            <div class="next-steps">
              <div class="next-steps-title">🎯 What Happens Next?</div>
              
              <div class="step-item">
                <div class="step-number">1</div>
                <div class="step-text">
                  <strong>Upload Payment Receipt:</strong> Visit your dashboard to upload proof of payment for verification.
                </div>
              </div>
              
              <div class="step-item">
                <div class="step-number">2</div>
                <div class="step-text">
                  <strong>Wait for Confirmation:</strong> Our team will review your payment and confirm your booking within 24-48 hours.
                </div>
              </div>
              
              <div class="step-item">
                <div class="step-number">3</div>
                <div class="step-text">
                  <strong>Receive Final Details:</strong> You'll get a detailed itinerary and travel instructions via email.
                </div>
              </div>
              
              <div class="step-item">
                <div class="step-number">4</div>
                <div class="step-text">
                  <strong>Start Your Adventure:</strong> Pack your bags and get ready for an amazing journey!
                </div>
              </div>
            </div>

            <center>
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/user_dashboard" class="action-btn">
                View My Bookings →
              </a>
            </center>

            <p style="color: #6b7280; font-size: 14px; margin-top: 30px; text-align: center;">
              Need help? Contact us at <a href="mailto:${SUPPORT_EMAIL}" class="footer-link">${SUPPORT_EMAIL}</a>
            </p>
          </div>
          
          <div class="footer">
            <p class="footer-text">
              <strong>Tropical Bloom Tourism</strong> - Making Your Travel Dreams Come True
            </p>
            <p class="footer-text">
              © ${new Date().getFullYear()} Tropical Bloom Tourism. All rights reserved.
            </p>
            <p class="footer-text" style="margin-top: 15px;">
              This is an automated confirmation email. Please do not reply directly to this email.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
🎉 BOOKING CONFIRMATION - BLOOM TRAVEL

Thank you for your booking, ${bookingDetails.customerName}!

Booking Reference: #${bookingDetails.bookingId}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INVOICE DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Package: ${bookingDetails.packageName}
Price per Person: ${formatCurrency(bookingDetails.pricePerPerson)}
Number of Guests: ${bookingDetails.numberOfGuests}
Travel Start: ${new Date(bookingDetails.preferredStartDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
Travel End: ${new Date(bookingDetails.preferredEndDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

TOTAL AMOUNT: ${formatCurrency(bookingDetails.totalAmount)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTACT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name: ${bookingDetails.customerName}
Email: ${bookingDetails.customerEmail}
${bookingDetails.customerPhone ? `Phone: ${bookingDetails.customerPhone}` : ''}

${bookingDetails.specialRequests ? `
SPECIAL REQUESTS:
${bookingDetails.specialRequests}
` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Upload Payment Receipt - Visit your dashboard to submit proof of payment
2. Wait for Confirmation - Our team will verify payment within 24-48 hours
3. Receive Final Details - You'll get your complete itinerary via email
4. Start Your Adventure - Pack your bags and enjoy!

View your bookings: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/user_dashboard

Questions? Contact us at ${SUPPORT_EMAIL}

© ${new Date().getFullYear()} Tropical Bloom Tourism
  `.trim();

  return await sendEmail({
    to: bookingDetails.customerEmail,
    subject,
    text,
    html,
  });
}

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(userDetails: {
  email: string;
  username: string;
}): Promise<boolean> {
  const subject = '🎉 Welcome to Tropical Bloom Tourism - Your Adventure Begins!';

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Tropical Bloom Tourism</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f9fafb;
            color: #1f2937;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
          }
          .header {
            background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: 700;
          }
          .welcome-icon {
            font-size: 64px;
            margin-bottom: 15px;
          }
          .content {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 20px;
            color: #1f2937;
            margin-bottom: 20px;
          }
          .message {
            font-size: 16px;
            line-height: 1.6;
            color: #4b5563;
            margin-bottom: 25px;
          }
          .features {
            margin: 30px 0;
          }
          .feature-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 20px;
            padding: 15px;
            background: #fef3c7;
            border-radius: 8px;
            border-left: 4px solid #f59e0b;
          }
          .feature-icon {
            font-size: 28px;
            margin-right: 15px;
            flex-shrink: 0;
          }
          .feature-content h3 {
            margin: 0 0 5px 0;
            font-size: 16px;
            color: #92400e;
          }
          .feature-content p {
            margin: 0;
            font-size: 14px;
            color: #78350f;
          }
          .cta-section {
            text-align: center;
            margin: 40px 0;
            padding: 30px;
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border-radius: 12px;
          }
          .cta-title {
            font-size: 18px;
            font-weight: 600;
            color: #92400e;
            margin-bottom: 20px;
          }
          .action-btn {
            display: inline-block;
            background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
            color: white;
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 8px;
            box-shadow: 0 4px 6px rgba(245, 158, 11, 0.3);
          }
          .footer {
            background: #1f2937;
            color: #d1d5db;
            padding: 30px;
            text-align: center;
          }
          .footer-text {
            margin: 8px 0;
            font-size: 14px;
          }
          .footer-link {
            color: #fbbf24;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="welcome-icon">🌺</div>
            <h1>Welcome to Tropical Bloom Tourism!</h1>
          </div>

          <div class="content">
            <p class="greeting">
              Hello ${userDetails.username}! 👋
            </p>

            <p class="message">
              Thank you for joining <strong>Tropical Bloom Tourism</strong> - where every journey blooms into an unforgettable adventure!
            </p>

            <p class="message">
              We're thrilled to have you as part of our travel community. Your account has been successfully created, 
              and you're now ready to explore amazing destinations and book incredible tour packages.
            </p>

            <div class="features">
              <div class="feature-item">
                <div class="feature-icon">🗺️</div>
                <div class="feature-content">
                  <h3>Explore Tour Packages</h3>
                  <p>Browse our handpicked selection of incredible tour packages tailored to your travel style</p>
                </div>
              </div>

              <div class="feature-item">
                <div class="feature-icon">✨</div>
                <div class="feature-content">
                  <h3>Create Custom Tours</h3>
                  <p>Design your dream vacation by selecting your favorite destinations and activities</p>
                </div>
              </div>

              <div class="feature-item">
                <div class="feature-icon">📱</div>
                <div class="feature-content">
                  <h3>Manage Your Bookings</h3>
                  <p>Track all your bookings, upload payment receipts, and receive updates in your dashboard</p>
                </div>
              </div>

              <div class="feature-item">
                <div class="feature-icon">🎯</div>
                <div class="feature-content">
                  <h3>Personalized Service</h3>
                  <p>Our travel experts are here to help you plan the perfect trip</p>
                </div>
              </div>
            </div>

            <div class="cta-section">
              <p class="cta-title">Ready to start your adventure?</p>
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/packages" class="action-btn">
                🔍 Explore Packages
              </a>
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/create_pkg" class="action-btn">
                🎨 Create Custom Tour
              </a>
            </div>

            <p class="message" style="margin-top: 30px; text-align: center; color: #6b7280; font-size: 14px;">
              Need help getting started? Feel free to contact us at 
              <a href="mailto:${SUPPORT_EMAIL}" class="footer-link">${SUPPORT_EMAIL}</a>
            </p>
          </div>

          <div class="footer">
            <p class="footer-text">
              <strong>Tropical Bloom Tourism</strong> - Making Your Travel Dreams Come True
            </p>
            <p class="footer-text">
              © ${new Date().getFullYear()} Tropical Bloom Tourism. All rights reserved.
            </p>
            <p class="footer-text" style="margin-top: 15px;">
              You're receiving this email because you just created an account with us.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
🎉 WELCOME TO BLOOM TRAVEL!

Hello ${userDetails.username}!

Thank you for joining Tropical Bloom Tourism - where every journey blooms into an unforgettable adventure!

Your account has been successfully created, and you're now ready to explore amazing destinations 
and book incredible tour packages.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT YOU CAN DO NOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🗺️ Explore Tour Packages
   Browse our handpicked selection of incredible tour packages

✨ Create Custom Tours
   Design your dream vacation by selecting your favorite destinations

📱 Manage Your Bookings
   Track all your bookings and receive updates in your dashboard

🎯 Personalized Service
   Our travel experts are here to help you plan the perfect trip

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GET STARTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Explore Packages: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/packages
Create Custom Tour: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/create_pkg

Need help? Contact us at ${SUPPORT_EMAIL}

© ${new Date().getFullYear()} Tropical Bloom Tourism - Making Your Travel Dreams Come True
  `.trim();

  return await sendEmail({
    to: userDetails.email,
    subject,
    text,
    html,
  });
}

/**
 * Send simple booking acknowledgment to customer (not invoice - that comes when confirmed)
 */
export async function sendSimpleBookingAcknowledgment(details: {
  customerName: string;
  customerEmail: string;
  packageName: string;
  bookingId: string;
}): Promise<boolean> {
  const subject = '✅ Booking Request Received - Tropical Bloom Tourism';

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f9fafb;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
          }
          .header {
            background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          .content {
            padding: 40px 30px;
          }
          .status-badge {
            display: inline-block;
            background: #fef3c7;
            color: #92400e;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            margin: 20px 0;
          }
          .info-box {
            background: #f3f4f6;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .footer {
            background: #1f2937;
            color: #d1d5db;
            padding: 30px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Booking Request Received!</h1>
          </div>

          <div class="content">
            <p>Hello ${details.customerName},</p>

            <p>Thank you for your interest in <strong>${details.packageName}</strong>!</p>

            <div class="status-badge">⏳ Status: Pending Review</div>

            <div class="info-box">
              <strong>Booking Reference:</strong> #${details.bookingId}<br/>
              <strong>Package:</strong> ${details.packageName}
            </div>

            <p><strong>What happens next?</strong></p>
            <ol style="line-height: 1.8;">
              <li>Our team is reviewing your booking request</li>
              <li>We'll confirm availability and prepare your detailed invoice</li>
              <li>You'll receive a confirmation email with payment details within 24 hours</li>
              <li>Once confirmed, you can proceed with payment</li>
            </ol>

            <p style="color: #6b7280; margin-top: 30px;">
              You can track your booking status in your dashboard. We'll notify you as soon as it's confirmed!
            </p>
          </div>

          <div class="footer">
            <p><strong>Tropical Bloom Tourism</strong></p>
            <p>© ${new Date().getFullYear()} Tropical Bloom Tourism. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
✅ BOOKING REQUEST RECEIVED - BLOOM TRAVEL

Hello ${details.customerName},

Thank you for your interest in ${details.packageName}!

Status: ⏳ Pending Review
Booking Reference: #${details.bookingId}
Package: ${details.packageName}

WHAT HAPPENS NEXT?

1. Our team is reviewing your booking request
2. We'll confirm availability and prepare your detailed invoice
3. You'll receive a confirmation email with payment details within 24 hours
4. Once confirmed, you can proceed with payment

You can track your booking status in your dashboard. We'll notify you as soon as it's confirmed!

© ${new Date().getFullYear()} Tropical Bloom Tourism
  `.trim();

  return await sendEmail({
    to: details.customerEmail,
    subject,
    text,
    html,
  });
}

/**
 * Send custom package request acknowledgment to customer
 */
export async function sendCustomPackageAcknowledgment(details: {
  customerName: string;
  customerEmail: string;
  packageName: string;
  packageId: string;
  places: string[];
  guests: number;
  dateRange: string;
}): Promise<boolean> {
  const subject = '✅ Custom Package Request Received - Tropical Bloom Tourism';

  const placesList = details.places.map(place => `<li>${place}</li>`).join('');

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f9fafb;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
          }
          .header {
            background: linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          .content {
            padding: 40px 30px;
          }
          .status-badge {
            display: inline-block;
            background: #f3e8ff;
            color: #6b21a8;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            margin: 20px 0;
          }
          .info-box {
            background: #faf5ff;
            border: 2px solid #e9d5ff;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .places-list {
            background: #f9fafb;
            padding: 15px 20px;
            border-radius: 8px;
            margin: 15px 0;
          }
          .places-list ul {
            margin: 10px 0;
            padding-left: 20px;
          }
          .places-list li {
            margin: 5px 0;
            color: #374151;
          }
          .footer {
            background: #1f2937;
            color: #d1d5db;
            padding: 30px;
            text-align: center;
          }
          .highlight {
            color: #a855f7;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✨ Custom Package Request Received!</h1>
          </div>

          <div class="content">
            <p>Hello ${details.customerName || 'Valued Customer'},</p>

            <p>Thank you for creating a custom travel package with us! We're excited to help you plan your perfect Sri Lankan adventure.</p>

            <div class="status-badge">⏳ Creating Your Personalized Quotation</div>

            <div class="info-box">
              <strong>Package Name:</strong> ${details.packageName}<br/>
              <strong>Reference ID:</strong> #${details.packageId}<br/>
              <strong>Number of Guests:</strong> ${details.guests}<br/>
              <strong>Travel Dates:</strong> ${details.dateRange}
            </div>

            <div class="places-list">
              <strong>📍 Your Selected Destinations:</strong>
              <ul>
                ${placesList}
              </ul>
            </div>

            <p><strong>What happens next?</strong></p>
            <ol style="line-height: 1.8;">
              <li>Our expert travel planners are reviewing your custom itinerary</li>
              <li>We'll prepare a detailed quotation with pricing and recommendations</li>
              <li><span class="highlight">You'll receive your personalized quotation within 24-48 hours</span></li>
              <li>Once you approve, we'll finalize all bookings and arrangements</li>
            </ol>

            <p style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
              <strong>💡 Pro Tip:</strong> Check your email and "My Trips" dashboard for updates on your quotation!
            </p>

            <p style="color: #6b7280; margin-top: 30px;">
              Have questions? Feel free to reply to this email or contact our support team.
            </p>
          </div>

          <div class="footer">
            <p><strong>Tropical Bloom Tourism</strong></p>
            <p>Creating Unforgettable Sri Lankan Adventures</p>
            <p>© ${new Date().getFullYear()} Tropical Bloom Tourism. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
✨ CUSTOM PACKAGE REQUEST RECEIVED - BLOOM TRAVEL

Hello ${details.customerName || 'Valued Customer'},

Thank you for creating a custom travel package with us! We're excited to help you plan your perfect Sri Lankan adventure.

Status: ⏳ Creating Your Personalized Quotation

PACKAGE DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Package Name: ${details.packageName}
Reference ID: #${details.packageId}
Number of Guests: ${details.guests}
Travel Dates: ${details.dateRange}

YOUR SELECTED DESTINATIONS:
${details.places.map(place => `• ${place}`).join('\n')}

WHAT HAPPENS NEXT?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Our expert travel planners are reviewing your custom itinerary
2. We'll prepare a detailed quotation with pricing and recommendations
3. You'll receive your personalized quotation within 24-48 hours
4. Once you approve, we'll finalize all bookings and arrangements

💡 PRO TIP: Check your email and "My Trips" dashboard for updates on your quotation!

Have questions? Feel free to reply to this email or contact our support team.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tropical Bloom Tourism - Creating Unforgettable Sri Lankan Adventures
© ${new Date().getFullYear()} Tropical Bloom Tourism. All rights reserved.
  `.trim();

  return await sendEmail({
    to: details.customerEmail,
    subject,
    text,
    html,
  });
}

/**
 * Notify admin of new pending booking (simpler version without invoice)
 */
export async function notifyAdminNewPendingBooking(details: {
  bookingId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  packageName: string;
  preferredDate: string;
  preferredEndDate: string;
  numberOfGuests: number;
  specialRequests?: string | null;
}): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || SUPPORT_EMAIL;
  if (!adminEmail) {
    console.error('No admin email configured');
    return false;
  }

  const subject = `🔔 New Booking Request - ${details.packageName}`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f9fafb;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 700px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .content {
            padding: 30px;
          }
          .info-grid {
            display: grid;
            gap: 15px;
            margin: 20px 0;
          }
          .info-row {
            display: flex;
            padding: 12px;
            background: #f3f4f6;
            border-radius: 6px;
          }
          .info-label {
            font-weight: 600;
            color: #374151;
            min-width: 150px;
          }
          .info-value {
            color: #1f2937;
          }
          .action-btn {
            display: inline-block;
            background: #dc2626;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 New Booking Request</h1>
            <p>Pending Review & Confirmation</p>
          </div>

          <div class="content">
            <div class="info-grid">
              <div class="info-row">
                <span class="info-label">Booking ID:</span>
                <span class="info-value">#${details.bookingId}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Package:</span>
                <span class="info-value">${details.packageName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Customer:</span>
                <span class="info-value">${details.customerName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email:</span>
                <span class="info-value">${details.customerEmail}</span>
              </div>
              ${details.customerPhone ? `
              <div class="info-row">
                <span class="info-label">Phone:</span>
                <span class="info-value">${details.customerPhone}</span>
              </div>
              ` : ''}
              <div class="info-row">
                <span class="info-label">Travel Start:</span>
                <span class="info-value">${new Date(details.preferredDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Travel End:</span>
                <span class="info-value">${new Date(details.preferredEndDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Guests:</span>
                <span class="info-value">${details.numberOfGuests}</span>
              </div>
              ${details.specialRequests ? `
              <div class="info-row">
                <span class="info-label">Special Requests:</span>
                <span class="info-value">${details.specialRequests}</span>
              </div>
              ` : ''}
            </div>

            <p><strong>Next Steps:</strong></p>
            <ol>
              <li>Review the booking request in the admin panel</li>
              <li>Confirm availability for the requested dates</li>
              <li>Mark as CONFIRMED to send invoice to customer</li>
            </ol>

            <center>
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/bookings" class="action-btn">
                View in Admin Panel →
              </a>
            </center>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
🔔 NEW BOOKING REQUEST - PENDING REVIEW

Booking ID: #${details.bookingId}
Package: ${details.packageName}
Customer: ${details.customerName}
Email: ${details.customerEmail}
${details.customerPhone ? `Phone: ${details.customerPhone}` : ''}
Travel Start: ${new Date(details.preferredDate).toLocaleDateString()}
Travel End: ${new Date(details.preferredEndDate).toLocaleDateString()}
Guests: ${details.numberOfGuests}
${details.specialRequests ? `Special Requests: ${details.specialRequests}` : ''}

NEXT STEPS:
1. Review the booking request in the admin panel
2. Confirm availability for the requested dates
3. Mark as CONFIRMED to send invoice to customer

View in Admin Panel: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/bookings
  `.trim();

  return await sendEmail({
    to: adminEmail,
    subject,
    text,
    html,
  });
}

const emailService = {
  sendEmail,
  sendPasswordResetCode,
  sendPasswordChangedConfirmation,
  notifyAdminNewBooking,
  notifyAdminCustomPackage,
  notifyUserQuotationUploaded,
  notifyUserBookingStatusChange,
  notifyUserPaymentStatusChange,
  sendBookingConfirmationToUser,
  sendWelcomeEmail,
  sendSimpleBookingAcknowledgment,
  notifyAdminNewPendingBooking,
};

export default emailService;
