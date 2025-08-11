import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/primitives/theme-provider"

import { baseUrl } from '@/lib/utils';
import { Lang } from "@/actions/dictionaries";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: process.env.APP_NAME || "eBeast",
  robots: {
    follow: true,
    index: true
  }
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: Lang }>
}>) {
  const { lang } = await params;
  return (
    <html lang={lang} >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full h-[100dvh]`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="eBeast-theme"
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
