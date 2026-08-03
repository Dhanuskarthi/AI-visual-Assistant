import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FixVision AI 3.0 — Appliance & Device Diagnostic Assistant",
  description: "Identify appliance, mobile, laptop, and vehicle faults safely with multimodal AI vision analysis, safety gating, and step-by-step repair guides.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen flex flex-col selection:bg-rose-500 selection:text-white antialiased`}>
        <LanguageProvider>
          <Header />
          <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 md:py-8">
            {children}
          </main>
          <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
            FixVision AI 3.0 &bull; Multimodal AI Visual Appliance & Vehicle Diagnostic Engine
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
