"use client";

import { useState } from "react";
import UploadSection from "@/components/UploadSection";
import DiagnosisResult from "@/components/DiagnosisResult";
import { ApplianceDiagnosis, DiagnosisCreateResponse } from "@/types/diagnosis";
import { ShieldCheck, AlertOctagon, Wrench, Smartphone, Car, Cpu, Home as HomeIcon, Zap, CheckCircle2, Eye, ShieldAlert } from "lucide-react";

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DiagnosisCreateResponse | null>(null);

  const handleAnalyze = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || "Failed to analyze device image");
      }

      const data: DiagnosisCreateResponse = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during diagnosis.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-bold tracking-wide">
              <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Universal AI Diagnostic & Safety Engine Active</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Instant AI Vision Diagnostic <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-400">
                For All Devices & Vehicles
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Snap a picture or record a video. Our multimodal vision AI (NVIDIA Llama 3.2 Vision • Gemini Flash • GPT-4o) identifies faults, verifies safety rules, and generates instant step-by-step repair guides.
            </p>

            {/* Device Category Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-2">
              <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-slate-200 flex items-center gap-1.5 hover:border-emerald-500/50 transition-colors">
                <HomeIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>Home Appliances</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-slate-200 flex items-center gap-1.5 hover:border-sky-500/50 transition-colors">
                <Smartphone className="w-3.5 h-3.5 text-sky-400" />
                <span>Mobiles & Laptops</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-slate-200 flex items-center gap-1.5 hover:border-amber-500/50 transition-colors">
                <Car className="w-3.5 h-3.5 text-amber-400" />
                <span>Bikes & Cars</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-slate-200 flex items-center gap-1.5 hover:border-purple-500/50 transition-colors">
                <Zap className="w-3.5 h-3.5 text-purple-400" />
                <span>Power Systems</span>
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
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Safety Gate</span>
                <span className="text-xs font-extrabold text-emerald-300">Hard-coded Filter</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
              <div className="p-2 bg-sky-500/10 text-sky-400 rounded-xl border border-sky-500/20">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Vision Engine</span>
                <span className="text-xs font-extrabold text-sky-300">Multimodal 3.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-950/90 border border-red-800 rounded-2xl text-red-200 text-xs md:text-sm flex items-start gap-3 shadow-xl animate-fade-in">
          <AlertOctagon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold text-red-300">Diagnosis Error: </strong>
            <span>{error}</span>
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
