import './globals.css';
import AppProviders from '@/components/providers/AppProviders';

export const metadata = {
  title: 'Real Estate Platform',
  description: 'Connects buyers, agents, and developers to simplify every step of the real estate journey.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans text-slate-900 bg-white">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
