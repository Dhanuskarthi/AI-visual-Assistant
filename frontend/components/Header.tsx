"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrench, ShieldAlert, History, Sparkles } from "lucide-react";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base md:text-lg leading-tight bg-gradient-to-r from-amber-200 via-rose-200 to-white bg-clip-text text-transparent">
              FixIt AI Vision
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Home Appliance Troubleshooter</p>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium flex items-center gap-1.5 transition-colors ${
              pathname === "/"
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Diagnose</span>
          </Link>

          <Link
            href="/history"
            className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium flex items-center gap-1.5 transition-colors ${
              pathname === "/history"
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <History className="w-4 h-4 text-slate-400" />
            <span>History</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
