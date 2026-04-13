import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Menu Vision",
  description:
    "Scan an English menu, translate it to Chinese, explain dishes, and preserve the original layout with image overlays."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
