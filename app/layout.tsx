import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ops Dashboard — Deralis Digital",
  description: "Operations dashboard demo by Deralis Digital",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
