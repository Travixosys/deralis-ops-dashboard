import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

// One family, two widths: Archivo at normal width for the interface, its condensed cut for stamped codes.
const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Deralis Ops · Tableau d'exploitation pour la sécurité privée",
  description:
    "Démonstration interactive : missions, agents et incidents d'une société de sécurité privée sur un seul écran. Entreprises et données fictives.",
};

export const viewport: Viewport = {
  themeColor: "#e9ede8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${archivo.variable} h-full antialiased`}>
      <body className="h-full">{children}</body>
    </html>
  );
}
