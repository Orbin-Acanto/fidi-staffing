import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fidi Staffing",
  description: "Staff with the power of AI",
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
