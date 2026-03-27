import {
  JetBrains_Mono,
  Playfair_Display,
  Source_Serif_4,
} from "next/font/google";
import type { Metadata } from "next";

import "./globals.css";

const displayFont = Playfair_Display({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600", "700", "800"],
});

const bodyFont = Source_Serif_4({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const monoFont = JetBrains_Mono({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-mono-local",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "南客松 S2 直通卡系统",
  description: "南客松 S2 直通卡登记与现场核对页面。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}
      >
        <a className="skip-link" href="#main-content">
          跳转到主要内容
        </a>
        {children}
      </body>
    </html>
  );
}
