"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrench, History, Sparkles, ShieldCheck } from "lucide-react";
import LanguageToggle from "./LanguageToggle";
import EmergencySafetyModal from "./EmergencySafetyModal";
import { useLanguage } from "@/context/LanguageContext";

export default function Header() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-slate-950/85 border-b border-slate-800/80 transition-all shadow-xl">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        {/* Brand Logo & Title */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative p-2 rounded-2xl bg-gradient-to-br from-indigo-500 via-rose-500 to-amber-500 text-white shadow-lg shadow-indigo-950/50 group-hover:scale-105 transition-all duration-300">
            <Wrench className="w-4.5 h-4.5 md:w-5 md:h-5 group-hover:rotate-12 transition-transform duration-300" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950 animate-ping" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-white text-base md:text-lg tracking-tight group-hover:text-indigo-400 transition-colors">
                FixVision <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-rose-400 to-emerald-400">AI</span>
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide bg-indigo-500/10 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> AI Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden lg:block">
              {t("tagline")}
            </p>
          </div>
        </Link>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-1.5 md:gap-3">
          <EmergencySafetyModal />
          <LanguageToggle />

          <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-2xl border border-slate-800">
            <Link
              href="/diagnose"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                pathname === "/diagnose"
                  ? "bg-gradient-to-r from-indigo-600 via-rose-600 to-indigo-700 text-white shadow-md shadow-indigo-950/60"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{t("diagnose")}</span>
            </Link>

            <Link
              href="/history"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                pathname === "/history"
                  ? "bg-gradient-to-r from-indigo-600 via-rose-600 to-indigo-700 text-white shadow-md shadow-indigo-950/60"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{t("history")}</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
