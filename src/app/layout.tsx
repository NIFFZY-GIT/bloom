import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../components/ui/navbar';
import Footer from '../components/ui/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sri Lanka Tourism - Discover Paradise',
  description: 'Explore the beautiful island of Sri Lanka',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
<Navbar/>      
        {children}
        <Footer/>
      </body>
    </html>
  );
}