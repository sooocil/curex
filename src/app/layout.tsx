import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ToasterClient } from "@/components/toast-wrapper";
import { SocketInitializer } from "@/components/SocketInitializer";

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable}  antialiased`} suppressHydrationWarning>
        {children}
        <SocketInitializer />
        <ToasterClient />
      </body>
    </html>
  );
}
