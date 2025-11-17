import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import { openSans, robotoSlab } from "@/lib/fonts";
import { ThemeProvider } from "@/components/theme-provider"; 
import ReduxProvider from "@/lib/redux/provider";
import Toast from "@/components/shared/Toast";
import PersistAuth from "@/utils/PersistAuth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Burj Khalifa",
  description: "Welcome to the tallest tower!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${openSans.variable} ${robotoSlab.variable} ${inter.className}`}>
        <Toast />
        <ReduxProvider>
          <PersistAuth />
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
