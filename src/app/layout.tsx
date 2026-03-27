import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "南客松 S2 直通卡系统",
  description: "南客松 S2 正式活动用直通卡登记与核验系统。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="dark" lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
