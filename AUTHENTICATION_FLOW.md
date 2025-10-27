# Authentication Flow Documentation

## Overview
This document describes the authentication flow implemented for the Bloom tour booking system, specifically focusing on protecting the package booking flow.

## Authentication System

### Technology
- **JWT (JSON Web Tokens)**: Used for authentication
- **Cookie Storage**: Auth tokens stored in `auth_token` cookie
- **Middleware Protection**: Server-side route protection via Next.js middleware

### Protected Routes
The following routes require authentication:
- `/profile` - User profile management
- `/bookings` - User bookings dashboard
- `/admin/*` - All admin routes (requires ADMIN role)

### Browse-Only Routes (Authentication Required for Submission)
The following routes are publicly accessible but require authentication for actions:
- `/create_pkg` - Custom package creation (can browse, but must log in to submit)
- `/packages` - Package browsing (can view, but must log in to book)

## Booking Flow Authentication

### User Journey

#### 1. **Unauthenticated User Attempts to Book**
```
User clicks "Book Now" or "View Details" on any package
   ↓
Booking modal opens (no auth check needed to view)
   ↓
User fills out booking form
   ↓
User clicks "Confirm Booking" button
   ↓
System checks for auth_token cookie
   ↓
No token found
   ↓
Alert: "Please log in to complete your booking..."
   ↓
After 1.5 seconds, redirect to /login?redirect=/packages
```

#### 2. **User Logs In**
```
User enters credentials and submits login form
   ↓
POST /api/login
   ↓
Server validates credentials
   ↓
Server creates JWT with user info (id, email, role)
   ↓
Server sets auth_token cookie
   ↓
Server responds with success + user role
   ↓
Client checks for redirect parameter
   ↓
If redirect exists: Navigate to /packages
If no redirect: Navigate based on role (admin → /admin/dashboard, user → /)
```

#### 3. **User Returns to Packages**
```
User is now on /packages page
   ↓
User clicks "Book Now" on a package
   ↓
System checks for auth_token cookie
   ↓
Token found ✓
   ↓
Booking modal opens
   ↓
User completes booking form
   ↓
Form submits to POST /api/bookings
```

#### 4. **Alternative: User Signs Up**
```
User clicks "Sign Up" link from login page
   ↓
Redirect to /sign-up?redirect=/packages
   ↓
User creates account
   ↓
POST /api/signup
   ↓
Server creates user + JWT
   ↓
Server sets auth_token cookie
   ↓
Client checks for redirect parameter
   ↓
Navigate to /packages
```

## Custom Package Creation Flow

### User Journey

#### 1. **Unauthenticated User Visits Create Package Page**
```
User navigates to /create_pkg
   ↓
Page loads successfully (no middleware redirect)
   ↓
Yellow banner appears at top:
"Browsing Mode: You can explore places, but you'll need to 
log in or sign up to customize and submit your package."
   ↓
User can:
  - Browse available places (Step 1)
  - Add places to their selection
  - View place details
```

#### 2. **User Attempts to Continue Without Login**
```
User clicks "Continue to Customize" button
   ↓
System checks for auth_token cookie
   ↓
No token found
   ↓
Error message shown:
"Please log in to continue customizing your package. 
You will be redirected to the login page."
   ↓
After 2 seconds, redirect to /login?redirect=/create_pkg
```

#### 3. **User Logs In and Returns**
```
User logs in successfully
   ↓
Redirected back to /create_pkg
   ↓
Yellow banner no longer visible (user is authenticated)
   ↓
User adds places (Step 1)
   ↓
Clicks "Continue to Customize" → Proceeds to Step 2 ✓
   ↓
Customizes details (Step 2)
   ↓
Fills out contact form (Step 3)
   ↓
Submits package successfully
   ↓
Admin receives email notification
```

### Benefits of Browse-First Approach

1. **Better User Experience**: Users can explore available places without friction
2. **Increased Engagement**: No login wall for browsing destinations
3. **Higher Conversion**: Users see what's available before being asked to register
4. **Transparent**: Clear messaging about when login is required (before customization)
5. **Progressive Commitment**: Users browse → login → customize → submit
6. **Prevents Data Loss**: Users don't fill out forms before realizing they need to log in

## Implementation Details

### Client-Side Authentication Check

**File**: `src/lib/auth-client.ts`

```typescript
export function isAuthenticated(): boolean {
  const authToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('auth_token='))
    ?.split('=')[1];
  return !!authToken;
}
```

**Usage in PackagesClient**:
```typescript
const handleViewPackage = (pkg: TourPackage) => {
  // Allow viewing package details without authentication
  // Authentication check happens when submitting booking
  setSelectedPackage(pkg);
};

const handleBookNow = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Check if user is authenticated before submitting booking
  if (!isAuthenticated()) {
    alert('Please log in to complete your booking. You will be redirected to the login page.');
    setTimeout(() => {
      router.push(`/login?redirect=/packages`);
    }, 1500);
    return;
  }
  
  // Proceed with booking submission...
};
```

**Usage in Create Package Page**:
```typescript
const handleNextStep = () => {
  if (currentStep < 3) {
    setSubmitError(null);
    setSubmitSuccess(null);
    
    // Check authentication when trying to move from step 1 to step 2
    if (currentStep === 1 && !isAuthenticated()) {
      setSubmitError('Please log in to continue customizing your package. You will be redirected to the login page.');
      setTimeout(() => {
        router.push('/login?redirect=/create_pkg');
      }, 2000);
      return;
    }
    
    setCurrentStep(currentStep + 1);
  }
};

const handleSubmitPackage = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  
  // Check authentication before submission (backup check)
  if (!isAuthenticated()) {
    setSubmitError('Please log in to create a custom package. You will be redirected to the login page.');
    setTimeout(() => {
      router.push('/login?redirect=/create_pkg');
    }, 2000);
    return;
  }
  
  // Proceed with package submission...
};
```

**Banner Display**:
```tsx
{!isAuthenticated() && (
  <div className="auth-notice-banner">
    <div className="auth-notice-content">
      <i className="fas fa-info-circle"></i>
      <span>
        <strong>Browsing Mode:</strong> You can explore places, but you'll need to 
        <a href="/login?redirect=/create_pkg">log in</a> or 
        <a href="/sign-up?redirect=/create_pkg">sign up</a> to customize and submit your package.
      </span>
    </div>
  </div>
)}
```

### Server-Side Protection

**File**: `src/middleware.ts`

The middleware protects specific routes:
```typescript
// Protected routes that require authentication for page access
const protectedRoutes = ['/profile', '/bookings'];

// Admin routes that require ADMIN role
const adminRoutes = ['/admin'];
```

**Note**: `/create_pkg` and `/packages` are NOT in protectedRoutes because:
- Users should be able to browse packages and places freely
- Authentication is only required for actions (booking, submitting)
- This improves discoverability and user engagement

The middleware:
1. Checks for `auth_token` cookie on protected routes
2. Decodes JWT to verify validity
3. Checks user role for admin routes
4. Redirects to `/login?redirect={original_path}` if unauthorized
5. Passes through for public routes like `/create_pkg` and `/packages`

### Login/Signup Redirect Handling

Both login and signup pages check for the `redirect` query parameter:

```typescript
const searchParams = useSearchParams();
const redirectUrl = searchParams.get('redirect');

// After successful auth:
const destination = redirectUrl || (data.role === 'ADMIN' ? '/admin/dashboard' : '/');
router.push(destination);
```

### User Feedback

**Info Messages**: 

**When redirected from booking attempt:**
- Login page shows: "Please log in to continue booking your tour package."
- Sign-up page shows: "Please create an account or log in to continue booking."

**On create package page (unauthenticated):**
- Sticky banner at top: "Browsing Mode: You can explore and plan your custom tour, but you'll need to log in or sign up to submit your package."

**When attempting to submit without login:**
- Error message: "Please log in to create a custom package. You will be redirected to the login page."
- Auto-redirect after 2 seconds

**Visual Design**:
- Login/Signup info messages: Blue gradient background with info icon
- Create package banner: Yellow/amber gradient with sticky positioning
- Clear, friendly, non-intrusive messaging
- Clickable login/signup links within messages

## Security Features

### 1. **Client-Side Checks**
- Immediate feedback for better UX
- Prevents unnecessary API calls
- Cookie-based authentication status

### 2. **Server-Side Validation**
- All API routes verify JWT independently
- Middleware protects entire route trees
- Role-based access control (RBAC)

### 3. **Cookie Security**
- HTTP-only cookies (recommended for production)
- Secure flag in production (HTTPS only)
- SameSite policy to prevent CSRF

## Email Notifications

After successful booking, the system sends:

1. **Admin Notification**: Invoice-style email with booking details
2. **User Confirmation**: Detailed invoice email with:
   - Booking reference
   - Package details
   - Guest information
   - Pricing breakdown
   - Next steps

## Testing Checklist

### Package Booking Flow
- [ ] Unauthenticated user clicks "Book Now" → Modal opens (no redirect)
- [ ] User can view package details and fill out booking form
- [ ] User clicks "Confirm Booking" → Auth check happens
- [ ] If not authenticated → Alert + redirect to login after 1.5s
- [ ] User logs in from redirect → Returns to /packages
- [ ] Authenticated user clicks "Book Now" → Modal opens
- [ ] User completes booking form → Submits successfully
- [ ] User receives acknowledgment email (not invoice yet)
- [ ] Admin receives pending booking notification
- [ ] Admin confirms booking → Invoice emails sent to both
- [ ] User receives booking confirmation email with invoice
- [ ] User signs up from redirect → Returns to /packages after signup

### Custom Package Creation Flow
- [ ] Unauthenticated user visits /create_pkg → Page loads with banner
- [ ] Banner shows: "Browsing Mode" message with login/signup links
- [ ] User can browse places and add to selection (Step 1)
- [ ] User clicks "Continue to Customize" → Error message + redirect to login
- [ ] User logs in → Returns to /create_pkg without banner
- [ ] User adds places and clicks "Continue" → Proceeds to Step 2 (Customize)
- [ ] User fills out form and submits → Admin receives email
- [ ] Authenticated user visits /create_pkg → No banner shown
- [ ] Authenticated user can navigate all steps without interruption

### General Authentication
- [ ] Protected routes (/profile, /bookings) redirect to login with proper redirect param
- [ ] Admin routes redirect to login and check ADMIN role
- [ ] Login preserves redirect parameter in signup link
- [ ] Signup preserves redirect parameter and redirects after registration

## Files Modified

### Authentication Implementation
1. `src/lib/auth-client.ts` - NEW: Client-side auth utilities
2. `src/app/packages/PackagesClient.tsx` - Added auth check to handleViewPackage
3. `src/app/create_pkg/page.tsx` - Added auth check to handleSubmitPackage + banner
4. `src/app/login/page.tsx` - Added redirect parameter handling + info message
5. `src/app/sign-up/page.tsx` - Added redirect parameter handling + info message
6. `src/middleware.ts` - Removed /create_pkg from protectedRoutes

### Styling
- `src/app/login/page.tsx`: Added `.info-message` styles (blue gradient)
- `src/app/sign-up/page.tsx`: Added `.info-message` styles (blue gradient)
- `src/app/create_pkg/CreatePackagePage.css`: Added `.auth-notice-banner` styles (yellow gradient)

## Future Enhancements

1. **Token Refresh**: Implement token refresh logic for long sessions
2. **Remember Me**: Enhanced cookie expiration for "Remember Me" checkbox
3. **Social Auth**: Complete Google OAuth integration
4. **Session Management**: Add logout from all devices functionality
5. **Two-Factor Auth**: Optional 2FA for enhanced security
