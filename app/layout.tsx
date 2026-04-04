import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LabLog",
  description: "Structured experiment logging for chemistry research",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" className="bg-white">
      <body
        className={`${inter.variable} min-h-dvh bg-white font-sans text-foreground antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
