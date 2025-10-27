# Email Notification System

## Overview
Comprehensive email notification system integrated throughout the Bloom Travel booking platform using Zoho SMTP. The system sends detailed invoice-style confirmations to both customers and admins.

## SMTP Configuration
- **Service**: Zoho Mail
- **Host**: smtp.zoho.com
- **Port**: 465 (SSL)
- **From**: contactus@zevarone.com
- **Sender Name**: Bloom Travel

## Notification Types

### 1. Booking Confirmations (Admin + User)

#### Admin Booking Invoice (`notifyAdminNewBooking`)
**Triggered when**: A customer books a tour package
**Sent to**: Admin email (EMAIL_USER from .env)
**Location**: `src/app/api/bookings/route.ts` (POST handler)
**Contains**:
- **Detailed Invoice** with:
  - Booking Reference #
  - Package name
  - Price per person
  - Number of guests
  - Travel start & end dates
  - Booking timestamp
  - **Total Amount** (highlighted)
- **Customer Information**:
  - Full name
  - Email address
  - Phone number
  - Special requests (if any)
- **Action Items** checklist for admin
- **Direct link** to admin bookings panel
- Professional invoice-style layout with orange Bloom Travel branding

#### User Booking Confirmation (`sendBookingConfirmationToUser`)
**Triggered when**: A customer books a tour package
**Sent to**: Customer email from booking
**Location**: `src/app/api/bookings/route.ts` (POST handler)
**Contains**:
- **✓ Booking Confirmed** badge
- **Personalized greeting** with customer name
- **Detailed Invoice** with:
  - Booking Reference #
  - Package name
  - Price per person
  - Number of guests
  - Travel dates (formatted: "Monday, January 1, 2025")
  - **Total Amount** (prominently displayed in orange)
- **Contact Information** summary
- **Special Requests** highlighted in yellow box (if any)
- **What Happens Next?** section with 4 clear steps:
  1. Upload payment receipt
  2. Wait for admin confirmation (24-48 hours)
  3. Receive final itinerary
  4. Start adventure!
- **"View My Bookings"** button linking to user dashboard
- Professional, mobile-responsive design

### 2. Admin Notifications

#### Custom Package Request (`notifyAdminCustomPackage`)
**Triggered when**: A customer creates a custom package request
**Sent to**: Admin email (EMAIL_USER from .env)
**Location**: `src/app/api/custom-packages/route.ts` (POST handler)
**Contains**:
- Package ID
- Package name
- Customer contact details
- Travel dates
- Number of guests
- Duration
- List of selected places
- Link to admin custom packages panel

### 3. User Notifications

#### Quotation Ready (`notifyUserQuotationUploaded`)
**Triggered when**: Admin uploads a quotation PDF for a custom package
**Sent to**: Customer email from custom package request
**Location**: `src/app/api/custom-packages/upload-quotation/route.ts` (POST handler)
**Contains**:
- Package name
- Direct link to download quotation PDF
- Link to user dashboard
- Next steps information

#### Booking Status Change (`notifyUserBookingStatusChange`)
**Triggered when**: Admin updates booking status (pending/confirmed/cancelled)
**Sent to**: Customer email from booking
**Location**: `src/app/admin/bookings/page.tsx` (updateBookingStatus server action)
**Contains**:
- Booking ID
- Package name
- New status with color-coded badge:
  - ✅ **Confirmed** (green)
  - ❌ **Cancelled** (red)
  - ⏳ **Pending** (yellow)
- Booking details table
- Link to user dashboard

#### Payment Status Change (`notifyUserPaymentStatusChange`)
**Triggered when**: Admin updates payment status (pending/under_review/approved/rejected)
**Sent to**: Customer email from booking
**Location**: `src/app/admin/bookings/page.tsx` (updatePaymentStatus server action)
**Contains**:
- Booking ID
- Package name
- New payment status with emoji:
  - 🔍 **Under Review** (yellow)
  - ✅ **Approved** (green)
  - ❌ **Rejected** (red)
- Status-specific messages
- Link to user dashboard

## Email Design Features

### Invoice-Style Templates
- **Professional layout** mimicking formal invoices
- **Structured information** with clear labels and values
- **Total amount** prominently displayed with orange accent
- **Tabular data** for easy scanning
- **Color-coded sections** (blue for customer info, yellow for special notes)

### Visual Elements
- **Gradient header** with Bloom Travel logo (🌴)
- **Status badges** with rounded corners
- **Numbered steps** with circular badges
- **Icons** for visual navigation (📋, 👤, 📧, 📱, 🎯)
- **Action buttons** with gradient hover effects
- **Responsive design** adapting to mobile/desktop

### Branding Consistency
- **Primary Color**: #ff6b35 (Bloom orange)
- **Gradient**: #ff6b35 → #ff8c5a
- **Accents**: Blue (#3b82f6) for customer sections, Yellow (#f59e0b) for warnings
- **Typography**: System fonts with clear hierarchy
- **Spacing**: Generous padding for readability

## Email Templates
All emails feature:
- **Responsive HTML design** with mobile optimization
- **Bloom Travel branding** (#ff6b35 orange color scheme)
- **Plain text fallbacks** for accessibility
- **Professional formatting** with tables and badges
- **Action buttons** linking to relevant dashboard sections
- **Contact information** footer
- **Formatted dates** (e.g., "Monday, January 1, 2025")
- **Currency formatting** ($XXX.XX)

## Error Handling
- All email notifications wrapped in try-catch blocks
- Email failures logged but don't break core functionality
- Users/admins still see success messages even if email fails
- Errors logged to console for debugging
- Bookings complete successfully regardless of email status

## Testing
To test email notifications:
1. Ensure `.env` has valid Zoho SMTP credentials
2. **Book a package** → Admin receives invoice + User receives confirmation
3. Create custom package → Admin receives notification
4. Upload quotation → User receives notification
5. Change booking status → User receives notification
6. Change payment status → User receives notification

## Email Flow Example

### Package Booking Flow:
```
User books package
    ↓
Booking created in database
    ↓
Two emails sent simultaneously:
    ├─→ Admin: Invoice with customer details & action items
    └─→ User: Confirmation with next steps & payment instructions
    ↓
Both parties informed instantly
```

## Email Service Location
All email functions defined in: `src/lib/email.ts`

## New Features
✨ **Detailed Invoice Templates**: Both admin and user receive comprehensive invoice-style emails
✨ **Dual Notifications**: Single booking triggers emails to both parties
✨ **Next Steps Guidance**: Users receive clear instructions on what to do after booking
✨ **Professional Formatting**: Dates formatted as "Monday, January 1, 2025"
✨ **Mobile Responsive**: All emails adapt perfectly to phone screens
✨ **Action Checklist**: Admins get a clear list of required follow-up actions

## Future Enhancements
- Email templates customization from admin panel
- Email delivery tracking/logs
- Configurable notification preferences
- SMS notifications integration
- Email queue system for high volume
- Automated reminder emails before travel dates
- Review request emails after trip completion
