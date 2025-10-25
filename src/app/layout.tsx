import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import './globals.css';
import Navbar from '../components/ui/navbar';
import Footer from '../components/ui/footer';

const inter = Inter({ subsets: ['latin'] });

type AuthState = {
  isAuthenticated: boolean;
  role: string | null;
};

async function resolveAuthState(): Promise<AuthState> {
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
  title: 'Sri Lanka Tourism - Discover Paradise',
  description: 'Explore the beautiful island of Sri Lanka',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, role } = await resolveAuthState();

  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar isAuthenticated={isAuthenticated} userRole={role} />
        {children}
        <Footer />
      </body>
    </html>
  );
}