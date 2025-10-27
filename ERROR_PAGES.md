# Error Handling Pages - Bloom Travel

## Overview
Comprehensive error handling system with custom error pages for all common scenarios.

## Error Pages Implemented

### 1. **404 - Not Found** (`/not-found.tsx`)
**Triggers when**: User navigates to a non-existent page
**Features**:
- Large "404" error code with gradient animation
- Friendly message explaining the page doesn't exist
- Animated compass 🧭 and palm tree 🌴 illustration
- Two action buttons:
  - 🏠 Return Home (primary)
  - 🎒 Browse Packages (secondary)
- Link to contact support
- Orange Bloom Travel branding

**Design**:
- Orange gradient background (#fff9f6 → #ffe8de)
- Pulsing animation on error code
- Spinning compass, swaying palm tree
- Mobile responsive layout

---

### 2. **General Error** (`/error.tsx`)
**Triggers when**: Runtime error occurs in the application
**Features**:
- ⚠️ Warning icon with shake animation
- "Something Went Wrong" title
- User-friendly error description
- Expandable technical details section
  - Error message
  - Error digest/ID for support
- Animated toolbox 🧰 and wrench 🔧 illustration
- Two action buttons:
  - 🔄 Try Again (triggers reset)
  - 🏠 Return Home
- Link to contact support

**Design**:
- Yellow/red gradient background (#fef3c7 → #fee2e2)
- Collapsible error details with code block
- Bounce and rotate animations
- Client-side error boundary

---

### 3. **Global Error** (`/global-error.tsx`)
**Triggers when**: Critical system-wide error occurs
**Features**:
- 🚨 Critical error alert icon
- "Critical Error" title with severity indication
- Error reference ID display
- Alert ⛔ and signal 📡 illustration
- Action buttons:
  - 🔄 Reload Application
  - 🏠 Go to Homepage
- **Help section** with troubleshooting steps:
  - Refresh page
  - Clear browser cache
  - Try again later
  - Contact support
- Support email contact information

**Design**:
- Red gradient background (#fee2e2 → #fecaca)
- Pulsing and flashing animations
- Comprehensive help box
- Standalone HTML (doesn't rely on app shell)

---

### 4. **Admin 404** (`/admin/not-found.tsx`)
**Triggers when**: Admin page not found or no permission
**Features**:
- "404" error code
- Admin-specific messaging
- Lock 🔒 and gear ⚙️ icons
- Action buttons:
  - 📊 Admin Dashboard
  - 🏠 Return Home
- Link to sign in page

**Design**:
- Uses same styling as main 404
- Admin-focused messaging
- Permission-aware language

---

### 5. **403 - Unauthorized** (`/unauthorized/page.tsx`)
**Triggers when**: User tries to access protected content
**Features**:
- "403" error code with gradient
- "Access Denied" title
- Lock 🔒 and key 🔑 animation
- **Info box** explaining reasons:
  - Need to log in
  - Session expired
  - Insufficient permissions
  - Admin-only content
- Action buttons:
  - 🔐 Sign In (primary)
  - 🏠 Return Home
- Link to contact administrator

**Design**:
- Yellow gradient background (#fef3c7 → #fee2e2)
- Shake and swing animations
- Informative help section
- Clear call-to-action

---

### 6. **Loading State** (`/loading.tsx`)
**Triggers when**: Page or data is loading
**Features**:
- Animated spinner with palm tree icon 🌴
- "Loading..." text
- Three bouncing dots animation
- Bloom Travel branding

**Design**:
- Clean, minimal design
- Orange spinner (#ff6b35)
- Centered layout
- Sequential bounce animation

---

### 7. **Maintenance Mode** (`/maintenance/page.tsx`)
**Triggers when**: Site is under maintenance
**Features**:
- Wrench 🔧 icon
- "We'll Be Right Back!" friendly title
- Status box explaining maintenance
- **Timeline** showing what's happening:
  - System Updates
  - Performance Optimization
  - Security Enhancements
- Animated tools 🛠️, gear ⚙️, hammer 🔨
- Contact email for urgent inquiries
- 🔄 Check Again button

**Design**:
- Blue gradient background (#dbeafe → #e0e7ff)
- Animated timeline with pulsing dots
- Professional maintenance messaging
- Reassuring tone

---

### 8. **Error Boundary Component** (`/components/ErrorBoundary.tsx`)
**Usage**: Wrap around components to catch JavaScript errors
**Features**:
- React class component error boundary
- Catches rendering errors in child components
- Displays fallback UI
- Logs errors to console
- Action buttons:
  - 🔄 Refresh Page
  - 🏠 Go Home
- Can accept custom fallback component

**Usage Example**:
```tsx
import ErrorBoundary from '@/components/ErrorBoundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

---

## Design System

### Color Schemes

#### 404 - Not Found (Orange)
- Background: `#fff9f6 → #ffe8de`
- Primary: `#ff6b35 → #ff8c5a`
- Accent: `#ff6b35`

#### Error (Yellow/Red)
- Background: `#fef3c7 → #fee2e2`
- Primary: `#ff6b35 → #ff8c5a`
- Alert: `#ef4444`

#### Global Error (Red)
- Background: `#fee2e2 → #fecaca`
- Primary: `#dc2626 → #ef4444`
- Critical: `#dc2626`

#### Unauthorized (Yellow)
- Background: `#fef3c7 → #fee2e2`
- Primary: `#f59e0b → #fbbf24`
- Warning: `#f59e0b`

#### Maintenance (Blue)
- Background: `#dbeafe → #e0e7ff`
- Primary: `#3b82f6 → #60a5fa`
- Info: `#3b82f6`

### Animations

- **Pulse**: Error codes, badges
- **Spin**: Compass, gears, loading spinners
- **Shake**: Warning icons, locks
- **Bounce**: Tools, dots
- **Sway**: Palm trees
- **Swing**: Keys
- **Rotate**: Background gradients

### Typography

- **Error Codes**: 120px, 900 weight, gradient text
- **Titles**: 2.5rem, 800 weight
- **Descriptions**: 1.1rem, 1.8 line-height
- **Buttons**: 16px, 700 weight

### Components

#### Action Buttons
- **Primary**: Gradient background, shadow, hover lift
- **Secondary**: White background, colored border, hover fill

#### Info Boxes
- Blue gradient for information
- Yellow for warnings
- Red for critical errors

#### Illustrations
- Large emoji icons (60-100px)
- Animated with CSS keyframes
- Contextual to error type

---

## Mobile Responsiveness

All error pages are fully responsive:
- **Breakpoint**: 768px
- **Changes**:
  - Reduced font sizes
  - Smaller icon sizes
  - Stacked button layout
  - Adjusted padding
  - Full-width buttons

---

## SEO & Accessibility

### SEO
- Proper HTTP status codes sent
- Descriptive page titles
- Meta descriptions
- Clear error messages

### Accessibility
- High contrast text
- Keyboard navigation support
- Screen reader friendly
- ARIA labels where needed
- Focus states on interactive elements

---

## Integration

### Next.js App Router

These error pages follow Next.js 13+ conventions:

1. **`not-found.tsx`** - 404 errors (call `notFound()` function)
2. **`error.tsx`** - Client-side errors (must be "use client")
3. **`global-error.tsx`** - Root layout errors (includes `<html>`)
4. **`loading.tsx`** - Loading states (automatic)

### Usage Examples

#### Trigger 404:
```tsx
import { notFound } from 'next/navigation';

export default function Page({ params }) {
  const data = await getData(params.id);
  
  if (!data) {
    notFound(); // Triggers not-found.tsx
  }
  
  return <div>{data.content}</div>;
}
```

#### Redirect to Unauthorized:
```tsx
import { redirect } from 'next/navigation';

export default function ProtectedPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/unauthorized');
  }
  
  return <div>Protected Content</div>;
}
```

#### Use Error Boundary:
```tsx
import ErrorBoundary from '@/components/ErrorBoundary';

export default function Layout({ children }) {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
}
```

---

## Testing

### Manual Testing Checklist

- [ ] Navigate to `/invalid-page` → Should show 404
- [ ] Navigate to `/unauthorized` → Should show 403
- [ ] Navigate to `/maintenance` → Should show maintenance page
- [ ] Trigger runtime error → Should show error page
- [ ] Test mobile responsiveness on all pages
- [ ] Test all action buttons work correctly
- [ ] Verify animations play smoothly
- [ ] Test error boundary catches component errors

### Automated Testing

```bash
# Test 404 pages
curl -I http://localhost:3000/invalid-page

# Should return 404 status code
```

---

## Customization

### Change Colors

Edit the CSS modules to match your brand:

```css
/* NotFound.module.css */
.primaryBtn {
  background: linear-gradient(135deg, #YOUR_COLOR 0%, #YOUR_COLOR_LIGHT 100%);
}
```

### Change Messages

Edit the TSX files to customize messaging:

```tsx
// not-found.tsx
<p className={styles.description}>
  Your custom message here
</p>
```

### Add Custom Error Pages

Create new pages following the pattern:
1. Create `.tsx` file
2. Create matching `.module.css`
3. Use consistent design system
4. Add animations
5. Include action buttons

---

## Future Enhancements

- [ ] Add error logging service integration
- [ ] Track error analytics
- [ ] A/B test error page designs
- [ ] Add multi-language support
- [ ] Implement dark mode variants
- [ ] Add custom illustrations
- [ ] Create error page templates
- [ ] Add email notification on critical errors

---

## File Structure

```
src/
├── app/
│   ├── not-found.tsx              # 404 page
│   ├── NotFound.module.css        # 404 styles
│   ├── error.tsx                  # General error
│   ├── Error.module.css           # Error styles
│   ├── global-error.tsx           # Critical error
│   ├── GlobalError.module.css     # Critical styles
│   ├── loading.tsx                # Loading state
│   ├── admin/
│   │   └── not-found.tsx          # Admin 404
│   ├── unauthorized/
│   │   ├── page.tsx               # 403 page
│   │   └── Unauthorized.module.css
│   └── maintenance/
│       ├── page.tsx               # Maintenance
│       └── Maintenance.module.css
└── components/
    └── ErrorBoundary.tsx          # Error boundary
```

---

## Support

For issues or questions about error handling:
- Review this documentation
- Check Next.js error handling docs
- Contact development team
- Submit bug reports

© 2025 Bloom Travel - All error pages are production-ready ✅
