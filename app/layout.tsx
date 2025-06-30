import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '飞书认证模块',
  description: '基于飞书多维表格的用户认证系统',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
} 