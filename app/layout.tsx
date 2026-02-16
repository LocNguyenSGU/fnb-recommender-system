import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Web Kbang - Khám phá địa phương',
  description: 'Tìm kiếm và khám phá các quán ăn ngon, cafe đẹp tại TP.HCM',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="antialiased">{children}</body>
    </html>
  );
}
