import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Si Gyi AI Studio",
  description: "AI Video Translation and Voice Studio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="my">
      <body>{children}</body>
    </html>
  );
}	

