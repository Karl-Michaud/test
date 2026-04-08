import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/shared/components/Navbar";
import { EngineerProvider } from "@/shared/context/EngineerContext";
import { ToastProvider } from "@/shared/context/ToastContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bug Tracker",
  description: "Internal engineer bug triage dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
        <ToastProvider>
          <EngineerProvider>
            <Navbar />
            <main className="flex-1 px-6 py-6">{children}</main>
          </EngineerProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
