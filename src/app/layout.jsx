// ============================================================================
// Root Layout (src/app/layout.jsx)
// Architecture: Next.js App Router - Global HTML Shell & Metadata Provider
// ============================================================================

import React from 'react';
import './globals.css'; // Global Tailwind CSS imports

// Metadata configuration for SEO, enterprise performance, and Favicon
export const metadata = {
  title: 'IronCore Gym | Forge Your Strength',
  description: 'Elite gym management system, secure member portal, dynamic role controls, and advanced workout schedules.',
  icons: {
    icon: '/gemini-svg (1).svg', // تأكد من وضع ملف الأيقونة بهذا الاسم في مجلد app أو public
  },
};

// Root layout wrapping all route segments under the app directory
export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen flex flex-col selection:bg-red-600 selection:text-white">
        {/* Global application wrapper */}
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}