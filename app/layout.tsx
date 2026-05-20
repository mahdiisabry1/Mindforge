import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const font = Nunito({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MindForge",
  description: "Empower Your Learning Journey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={font.className} suppressHydrationWarning>{children}</body>
      </html>
    </ClerkProvider>
  );
}
