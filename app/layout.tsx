import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Deralis Ops · Tableau d'exploitation pour la sécurité privée",
  description:
    "Démonstration interactive : missions, agents et incidents d'une société de sécurité privée sur un seul écran. Entreprises et données fictives.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="h-full font-sans">{children}</body>
    </html>
  );
}
