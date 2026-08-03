"use client";

import { useState } from "react";
import UploadSection from "@/components/UploadSection";
import DiagnosisResult from "@/components/DiagnosisResult";
import HowItWorksModal from "@/components/HowItWorksModal";
import { DiagnosisCreateResponse } from "@/types/diagnosis";
import { useLanguage } from "@/context/LanguageContext";
import {
  ShieldCheck,
  AlertOctagon,
  Smartphone,
  Car,
  Home as HomeIcon,
  Zap,
  Eye,
  ShieldAlert,
  RefreshCw
} from "lucide-react";

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFile, setLastFile] = useState<File | null>(null);
  const [result, setResult] = useState<DiagnosisCreateResponse | null>(null);

  const { language, t } = useLanguage();

  const handleAnalyze = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setLastFile(file);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("language", language);

    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || "Failed to analyze device image. Please check backend connection.");
      }

      const data: DiagnosisCreateResponse = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during diagnosis.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastFile) {
      handleAnalyze(lastFile);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setLastFile(null);
  };

  return (
    <div className="relative space-y-8 pb-12">
      {/* Background Glow Effects */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute top-40 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      {/* Intro hero card */}
      <div className="relative bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-slate-950/90 border border-slate-800/90 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-2xl overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-rose-500/10 to-amber-500/0 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-bold tracking-wide">
                <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>{t("hero_badge")}</span>
              </div>
              <HowItWorksModal />
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {t("hero_title_1")} <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-400">
                {t("hero_title_2")}
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {t("hero_desc")}
            </p>

            {/* Device Category Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-2">
              <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-slate-200 flex items-center gap-1.5 hover:border-emerald-500/50 transition-colors">
                <HomeIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t("cat_home")}</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-slate-200 flex items-center gap-1.5 hover:border-sky-500/50 transition-colors">
                <Smartphone className="w-3.5 h-3.5 text-sky-400" />
                <span>{t("cat_mobile")}</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-slate-200 flex items-center gap-1.5 hover:border-amber-500/50 transition-colors">
                <Car className="w-3.5 h-3.5 text-amber-400" />
                <span>{t("cat_vehicle")}</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-slate-200 flex items-center gap-1.5 hover:border-purple-500/50 transition-colors">
                <Zap className="w-3.5 h-3.5 text-purple-400" />
                <span>{t("cat_power")}</span>
              </div>
            </div>
          </div>

          {/* High-Tech HUD Metrics Card */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5 shrink-0 w-full lg:w-64">
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t("hud_safety_gate")}</span>
                <span className="text-xs font-extrabold text-emerald-300">{t("hud_hardcoded_filter")}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
              <div className="p-2 bg-sky-500/10 text-sky-400 rounded-xl border border-sky-500/20">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t("hud_vision_engine")}</span>
                <span className="text-xs font-extrabold text-sky-300">{t("hud_multimodal")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* API Error Alert with User-Friendly Retry */}
      {error && (
        <div className="p-5 bg-red-950/95 border-2 border-red-800 rounded-3xl text-red-200 text-xs md:text-sm flex items-start justify-between gap-4 shadow-2xl animate-fade-in" role="alert">
          <div className="flex items-start gap-3">
            <AlertOctagon className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="font-bold text-red-200 text-sm md:text-base block">Diagnosis Request Failed</strong>
              <p className="text-slate-300 leading-relaxed">{error}</p>
              <div className="pt-2 flex items-center gap-3">
                {lastFile && (
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retry Diagnostic Scan</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Flow: Upload or Results */}
      {!result ? (
        <UploadSection onAnalyze={handleAnalyze} isLoading={isLoading} />
      ) : (
        <DiagnosisResult
          diagnosis={result.diagnosis}
          diagnosisId={result.id}
          mediaUrl={result.media_url}
          mediaType={result.media_type}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
