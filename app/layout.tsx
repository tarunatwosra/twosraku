import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SMA Negeri 1 Yogyakarta - Dashboard",
  description: "Sistem Manajemen Sekolah - SMA Negeri 1 Yogyakarta",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-full bg-gray-50">{children}</body>
    </html>
  );
}
