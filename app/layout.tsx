import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Trakie.ai - Cannabis Retail Intelligence',
  authors: [{ name: 'Trakie Inc.' }],
  robots: 'noindex, nofollow',
  other: {
    'format-detection': 'telephone=no',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta name="referrer" content="no-referrer" />
        <meta httpEquiv="Permissions-Policy" content="geolocation=(), microphone=(), camera=()" />
        <meta name="copyright" content="© 2025 Trakie Inc. All Rights Reserved." />
      </head>
      <body>{children}</body>
    </html>
  );
}
