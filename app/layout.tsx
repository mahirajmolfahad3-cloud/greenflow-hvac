import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GreenFlow HVAC",
  description: "Field service management for HVAC companies",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
