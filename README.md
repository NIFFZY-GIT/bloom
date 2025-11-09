# 🌸 Bloom Travel - Travel Agency Management SystemThis is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).



A modern, full-stack travel agency management system built with Next.js 15, React 19, TypeScript, and PostgreSQL.## Getting Started



## ✨ FeaturesFirst, run the development server:



- 🔐 **Authentication**: Secure user authentication with NextAuth.js, JWT, and Google OAuth```bash

- 👥 **User Management**: Admin dashboard for managing users and permissionsnpm run dev

- 📦 **Package Management**: Create, edit, and manage travel packages# or

- 🗺️ **Places & Categories**: Organize destinations by categoriesyarn dev

- 🎫 **Booking System**: Complete booking workflow with email notifications# or

- 🖼️ **Gallery Management**: Upload and manage travel photospnpm dev

- 📧 **Email Notifications**: Automated emails for bookings, password resets, and confirmations# or

- 📱 **Responsive Design**: Mobile-friendly UI with Tailwind CSSbun dev

- 🎨 **Modern Animations**: Smooth animations with Framer Motion and GSAP```



## 🚀 Quick StartOpen [http://localhost:3000](http://localhost:3000) with your browser to see the result.



### PrerequisitesYou can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.



- Node.js 18.x or higherThis project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

- PostgreSQL 12 or higher

- npm or yarn## Learn More



### 1. Clone the RepositoryTo learn more about Next.js, take a look at the following resources:



```bash- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

git clone https://github.com/yourusername/bloom.git- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

cd bloom

```You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!



### 2. Install Dependencies## Deploy on Vercel



```bashThe easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

npm install

```Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and configure:

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/Bloom_db

# Authentication (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
AUTH_SECRET=your-generated-secret-here
JWT_SECRET=your-generated-secret-here

# Email Configuration
EMAIL_HOST=smtp.zoho.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=your-email@domain.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM_NAME=Bloom Travel

# Application URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Setup Database

Create the database and run migrations:

```bash
# Create database
createdb Bloom_db

# Run migrations
psql -d Bloom_db -f dbs/final.sql
psql -d Bloom_db -f migrations/20240209_add_user_id_to_custom_packages.sql
psql -d Bloom_db -f migrations/20251109_add_password_reset_tokens.sql
psql -d Bloom_db -f migrations/add-google-oauth.sql
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete deployment guide for production
- **[QUICK_START.md](QUICK_START.md)** - Forgot password quick reference
- **[EMAIL_SETUP.md](EMAIL_SETUP.md)** - Email configuration guide
- **[GOOGLE_AUTH_SETUP.md](GOOGLE_AUTH_SETUP.md)** - Google OAuth setup
- **[WORKING_STATUS.md](WORKING_STATUS.md)** - Feature status and testing

## 🏗️ Project Structure

```
bloom/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/            # API routes
│   │   ├── admin/          # Admin dashboard
│   │   ├── auth/           # Authentication pages
│   │   └── ...             # Other pages
│   ├── components/         # React components
│   ├── lib/                # Utility libraries
│   │   ├── auth.ts         # Authentication logic
│   │   ├── db.ts           # Database connection
│   │   └── email.ts        # Email utilities
│   └── Types/              # TypeScript type definitions
├── public/                 # Static assets
│   ├── images/            # Image assets
│   └── uploads/           # User uploads
├── migrations/            # Database migrations
├── dbs/                   # Database schemas
└── ...
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first CSS
- **Framer Motion** - Animations
- **GSAP** - Advanced animations

### Backend
- **Next.js API Routes** - Serverless API
- **PostgreSQL** - Database
- **NextAuth.js** - Authentication
- **JWT** - Token-based auth
- **Nodemailer** - Email sending
- **bcryptjs** - Password hashing

### Development
- **ESLint** - Code linting
- **TypeScript** - Type checking

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start dev server with Turbopack

# Production
npm run build        # Build for production
npm run build:prod   # Build for production (explicit)
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## 🔐 Authentication

The app supports multiple authentication methods:

1. **Email/Password**: Traditional authentication with secure password hashing
2. **Google OAuth**: Sign in with Google account (optional)
3. **Password Reset**: Forgot password flow with email verification codes

See [GOOGLE_AUTH_SETUP.md](GOOGLE_AUTH_SETUP.md) for OAuth setup.

## 📧 Email Configuration

The system sends emails for:
- Password reset codes
- Booking confirmations
- Admin notifications
- Status updates

Supported email providers:
- Zoho Mail (recommended)
- Gmail (requires app password)
- SendGrid
- Custom SMTP

See [EMAIL_SETUP.md](EMAIL_SETUP.md) for detailed configuration.

## 🚢 Deployment

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/bloom)

### Manual Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive deployment instructions including:
- Environment setup
- Database configuration
- Platform-specific guides (Vercel, Railway, VPS, Docker)
- Post-deployment checklist
- Troubleshooting

### Environment Variables for Production

Required environment variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | NextAuth secret (min 32 chars) |
| `JWT_SECRET` | JWT signing secret (min 32 chars) |
| `EMAIL_HOST` | SMTP server hostname |
| `EMAIL_USER` | Email account |
| `EMAIL_PASSWORD` | Email password |
| `NEXT_PUBLIC_BASE_URL` | Production URL |

See `.env.example` for complete list.

## 🧪 Testing

### Health Check

Test your deployment:

```bash
curl https://yourdomain.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-09T...",
  "environment": "production",
  "checks": {
    "api": true,
    "database": true,
    "email": true
  },
  "version": "1.0.0"
}
```

### Password Reset Testing

See [QUICK_START.md](QUICK_START.md) for testing the forgot password feature.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 👥 Team

Developed by ZEVARONE

## 📞 Support

For issues or questions:
- Email: contactus@zevarone.com
- Documentation: See docs in repository

## 🔄 Version History

- **v1.0.0** (Nov 2025) - Initial production release
  - Core booking system
  - User authentication
  - Admin dashboard
  - Email notifications
  - Password reset functionality
  - Google OAuth support

---

**Built with ❤️ by ZEVARONE**
