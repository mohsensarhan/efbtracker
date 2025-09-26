import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Egyptian Food Bank - Donor Tracking Platform",
  description: "Ultra-precise donation tracking system for the Egyptian Food Bank. Track your contribution from collection to family delivery with military-grade precision.",
  keywords: ["Egyptian Food Bank", "Donation Tracking", "Food Security", "Egypt", "Charity", "Transparency"],
  authors: [{ name: "Egyptian Food Bank" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  openGraph: {
    title: "Egyptian Food Bank - Donor Tracking Platform",
    description: "Track your donation with precision from collection to delivery",
    url: "https://efbtracker.com",
    siteName: "Egyptian Food Bank",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Egyptian Food Bank - Donor Tracking Platform",
    description: "Track your donation with precision from collection to delivery",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
