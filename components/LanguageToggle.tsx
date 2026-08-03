"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center gap-1 bg-slate-950/90 border border-slate-800 p-1 rounded-2xl shadow-lg">
      <div className="pl-2 pr-1 text-slate-400 flex items-center gap-1 text-xs">
        <Globe className="w-3.5 h-3.5 text-amber-400" />
      </div>

      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all min-h-[36px] focus:ring-2 focus:ring-rose-500 focus:outline-none ${
          language === "en"
            ? "bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md"
            : "text-slate-400 hover:text-slate-200"
        }`}
        aria-label="Switch language to English"
      >
        English
      </button>

      <button
        type="button"
        onClick={() => setLanguage("ta")}
        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all min-h-[36px] focus:ring-2 focus:ring-rose-500 focus:outline-none ${
          language === "ta"
            ? "bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-md font-sans"
            : "text-slate-400 hover:text-slate-200"
        }`}
        aria-label="Switch language to Tamil"
      >
        தமிழ்
      </button>
    </div>
  );
}
