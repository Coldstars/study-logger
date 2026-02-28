import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "学习记录 | Study Logger",
  description: "记录你的学习足迹，AI 自动生成标签",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased min-h-screen bg-gray-50/50">
        <main className="max-w-2xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
