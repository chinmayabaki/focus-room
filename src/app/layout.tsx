import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Import Google Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata for SEO and title
export const metadata: Metadata = {
  title: "Focus Room - Stay Productive",
  description: "A modern, sleek productivity app to help you stay focused",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-600`}>
        {/* Outer container with gradient background */}
        <div className="min-h-screen bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-600">
          {/* Content wrapper with centered elements */}
          <div className="container mx-auto py-12 px-8">
            {/* Animated content section */}
            <div className="animate__animated animate__fadeInUp">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
