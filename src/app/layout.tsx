import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nankesong S2 Direct Pass",
  description: "Direct pass registration and QR generation for Nankesong S2.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
