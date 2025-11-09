# Google OAuth Setup Guide for Tropical Bloom

## ✅ What's Been Done

I've already set up the following files for you:
- ✅ `src/lib/auth.ts` - NextAuth configuration
- ✅ `src/app/api/auth/[...nextauth]/route.ts` - API route handlers
- ✅ `src/types/next-auth.d.ts` - TypeScript type definitions
- ✅ `src/components/AuthProvider.tsx` - Session provider wrapper
- ✅ `src/app/layout.tsx` - Updated with AuthProvider
- ✅ `src/app/login/page.tsx` - Google sign-in button configured
- ✅ `migrations/add-google-oauth.sql` - Database migration
- ✅ `.env.local` - Template with required variables

## 🚀 Quick Start (5 Steps)

### Step 1: Install Dependencies (Already Done)
```bash
npm install next-auth@beta
```

### Step 2: Update Database

Run this SQL in your PostgreSQL database:
```bash
psql -U postgres -d Bloom_db -f migrations/add-google-oauth.sql
```

Or manually in pgAdmin/psql:
```sql
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS avatar VARCHAR(500),
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
```

### Step 3: Generate AUTH_SECRET

Run this in your terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output and paste it into `.env.local` as `AUTH_SECRET`

### Step 4: Get Google OAuth Credentials

#### 4.1 Go to Google Cloud Console
https://console.cloud.google.com/

#### 4.2 Create a New Project
1. Click project dropdown → "NEW PROJECT"
2. Name: "Tropical Bloom Tourism"
3. Click "CREATE"

#### 4.3 Configure OAuth Consent Screen
1. Go to "APIs & Services" → "OAuth consent screen"
2. Select "External" → "CREATE"
3. Fill in:
   - App name: **Tropical Bloom Tourism**
   - User support email: **your email**
   - Developer contact: **your email**
4. Click "SAVE AND CONTINUE" through all steps

#### 4.4 Create OAuth Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "+ CREATE CREDENTIALS" → "OAuth client ID"
3. Application type: **Web application**
4. Name: **Tropical Bloom Web Client**
5. **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   https://tropicalbloom.lk
   ```
6. **Authorized redirect URIs**:
   ```
   http://localhost:3000/api/auth/callback/google
   https://tropicalbloom.lk/api/auth/callback/google
   ```
7. Click "CREATE"
8. **Copy the Client ID and Client Secret!**

### Step 5: Update Environment Variables

Edit `.env.local` and add your credentials:

```env
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
AUTH_SECRET=paste-your-generated-secret-here

# From Google Cloud Console
AUTH_GOOGLE_ID=paste-your-client-id-here
AUTH_GOOGLE_SECRET=paste-your-client-secret-here

# Development URL (change to https://tropicalbloom.lk in production)
AUTH_URL=http://localhost:3000
```

## 🧪 Test It Out!

1. **Restart your dev server**:
   ```bash
   npm run dev
   ```

2. **Go to login page**:
   ```
   http://localhost:3000/login
   ```

3. **Click "Continue with Google"**

4. **Sign in with Google**

5. **You should be redirected back and logged in!**

## 📝 How It Works

1. User clicks "Continue with Google"
2. Redirected to Google OAuth consent screen
3. User approves access
4. Google redirects back to `/api/auth/callback/google`
5. NextAuth processes the callback:
   - Checks if user exists by `google_id`
   - If not, checks if email exists
   - If email exists, links Google account
   - If new user, creates account
6. User is logged in with a JWT session
7. Session lasts 7 days

## 🔐 Security Features

- ✅ Sessions stored as encrypted JWTs
- ✅ 7-day session expiration
- ✅ Secure password hashing with bcrypt
- ✅ Google ID verification
- ✅ Email verification status tracking
- ✅ Role-based access control

## 🌐 Production Deployment

### Update `.env.production`:
```env
AUTH_SECRET=your-production-secret-different-from-dev
AUTH_GOOGLE_ID=same-client-id
AUTH_GOOGLE_SECRET=same-client-secret
AUTH_URL=https://tropicalbloom.lk
DATABASE_URL=your-production-database-url
```

### Update Google Console:
Make sure these URLs are added:
```
https://tropicalbloom.lk
https://tropicalbloom.lk/api/auth/callback/google
https://www.tropicalbloom.lk
https://www.tropicalbloom.lk/api/auth/callback/google
```

## 🐛 Troubleshooting

### Error: "redirect_uri_mismatch"
**Solution**: 
- Check redirect URI in Google Console exactly matches: `http://localhost:3000/api/auth/callback/google`
- No trailing slashes
- Save changes in Google Console

### Error: "invalid_client"
**Solution**:
- Verify `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` in `.env.local`
- No extra spaces or quotes
- Restart dev server after changes

### Error: "Database connection failed"
**Solution**:
- Run the SQL migration: `migrations/add-google-oauth.sql`
- Check `DATABASE_URL` is correct
- Verify PostgreSQL is running

### User created but can't log in
**Solution**:
- Check database for user: `SELECT * FROM users WHERE email = 'your@email.com';`
- Verify `google_id` column exists
- Check server logs for errors

### Session not persisting
**Solution**:
- Clear browser cookies
- Check `AUTH_SECRET` is set
- Verify `AUTH_URL` matches your current URL
- Restart dev server

## 📊 Database Schema Changes

New columns added to `users` table:
```sql
google_id       VARCHAR(255)  -- Unique Google account ID
avatar          VARCHAR(500)  -- Profile picture URL
email_verified  BOOLEAN       -- Email verification status
```

## 🎯 Next Steps

Once Google OAuth is working, you can:

1. **Add more providers**:
   - Facebook: `next-auth/providers/facebook`
   - GitHub: `next-auth/providers/github`
   - LinkedIn: `next-auth/providers/linkedin`

2. **Update existing login flow**:
   - Migrate existing users to NextAuth
   - Add profile pages
   - Show user avatar in navbar

3. **Enhanced features**:
   - Email verification for password signups
   - Password reset via NextAuth
   - Two-factor authentication

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review server logs: Look at terminal output
3. Check browser console for errors
4. Verify all environment variables are set

## ✨ Features Included

- ✅ Google OAuth sign-in
- ✅ Traditional email/password login
- ✅ Automatic account linking (same email)
- ✅ User avatar from Google
- ✅ Email verification tracking
- ✅ Role-based access (USER/ADMIN)
- ✅ 7-day session duration
- ✅ Secure JWT tokens
- ✅ Responsive login UI
- ✅ Redirect after login support

Enjoy your new Google OAuth login! 🎉

