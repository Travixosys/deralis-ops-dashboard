import type { Metadata } from "next";
import "./globals.css";
import { DesktopSidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { PageTransition } from "@/components/page-transition";
import { DemoProvider } from "@/lib/demo-context";

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
      <body className="h-full font-sans">
        <DemoProvider>
          <div className="flex h-full">
            <DesktopSidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
              <Header />
              <main className="flex-1 overflow-auto p-4 md:p-6">
                <PageTransition>{children}</PageTransition>
              </main>
            </div>
          </div>
        </DemoProvider>
      </body>
    </html>
  );
}
