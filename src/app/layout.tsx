import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import './globals.css';
import Navbar from '../components/ui/navbar';
import Footer from '../components/ui/footer';
import { AuthProvider } from '../components/AuthProvider';
import { auth } from '@/lib/auth';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['500', '600', '700', '800'],
  display: 'swap',
});

type AuthState = {
  isAuthenticated: boolean;
  role: string | null;
};

async function resolveAuthState(): Promise<AuthState> {
  // First check NextAuth session
  const session = await auth();
  
  if (session?.user) {
    return {
      isAuthenticated: true,
      role: session.user.role || 'USER',
    };
  }

  // Fallback to legacy JWT token
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return { isAuthenticated: false, role: null };
  }

  try {
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const payload = jwt.verify(token, secret) as { role?: string };
    return {
      isAuthenticated: true,
      role: payload.role ?? null,
    };
  } catch (error) {
    console.error('Failed to verify auth token in layout:', error);
    return { isAuthenticated: false, role: null };
  }
}

export const metadata: Metadata = {
  title: 'Tropical Bloom Tourism — Discover Paradise in Sri Lanka',
  description:
    'Curated Sri Lanka travel experiences by Tropical Bloom Tourism — from pristine beaches and ancient heritage to wildlife safaris and hill-country escapes.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, role } = await resolveAuthState();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable}`}>
        <AuthProvider>
          <Navbar isAuthenticated={isAuthenticated} userRole={role} />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}