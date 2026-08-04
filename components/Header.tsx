"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrench, History, Sparkles, ShieldCheck } from "lucide-react";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "@/context/LanguageContext";

export default function Header() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-slate-950/85 border-b border-slate-800/80 transition-all shadow-xl">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative p-2.5 rounded-2xl bg-gradient-to-br from-indigo-500 via-rose-500 to-amber-500 text-white shadow-lg shadow-indigo-950/50 group-hover:scale-105 transition-all duration-300">
            <Wrench className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950 animate-ping" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-white text-base md:text-lg tracking-tight group-hover:text-indigo-400 transition-colors">
                FixVision <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-rose-400 to-emerald-400">AI</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide bg-indigo-500/10 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> AI Assistant Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {t("tagline")}
            </p>
          </div>
        </Link>

        {/* Navigation & Language Toggle */}
        <div className="flex items-center gap-2 md:gap-3">
          <LanguageToggle />

          <nav className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-2xl border border-slate-800">
            <Link
              href="/"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                pathname === "/"
                  ? "bg-gradient-to-r from-indigo-600 via-rose-600 to-indigo-700 text-white shadow-md shadow-indigo-950/60"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t("diagnose")}</span>
            </Link>

            <Link
              href="/history"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                pathname === "/history"
                  ? "bg-gradient-to-r from-indigo-600 via-rose-600 to-indigo-700 text-white shadow-md shadow-indigo-950/60"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>{t("history")}</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
