import type { Metadata } from 'next';
import './globals.css';
import { AuthProgressProvider } from '@/context/AuthProgressContext';
import SpaceBackground from '@/components/SpaceBackground';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'CodeVerse Academy | Launch Your Coding Journey',
  description:
    'The ultimate gamified coding academy for kids, teens, and advanced engineers. Master logic, algorithms, Python, AI, Computer Vision, and Robotics.',
  icons: {
    icon: '/assets/mascot.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-[#070a13] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        <AuthProgressProvider>
          <SpaceBackground />
          <Navbar />
          <main>{children}</main>
        </AuthProgressProvider>
      </body>
    </html>
  );
}
