import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ToasterClient } from "@/components/toast-wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Curex - Your Health, Our Priority",
  description: "Curex is a platform for managing your health and wellness.",
  icons: "/favicon.ico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"  >
      <body className={`${geistSans.variable}  antialiased`}
      >
        {children}
        <ToasterClient />
      </body>
    </html>
  );
}
