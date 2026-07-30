"use client";

import { useState } from "react";
import UploadSection from "@/components/UploadSection";
import DiagnosisResult from "@/components/DiagnosisResult";
import { ApplianceDiagnosis, DiagnosisCreateResponse } from "@/types/diagnosis";
import { ShieldCheck, AlertOctagon, Wrench, Smartphone, Car, Cpu, Home as HomeIcon } from "lucide-react";

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
    <div className="space-y-6">
      {/* Intro hero card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800/80 to-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Universal Safety & Diagnostic Filter Active
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Universal AI Device & Vehicle Troubleshooter
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl">
            Diagnose and repair <strong>Home Appliances</strong>, <strong>Mobiles & Laptops</strong>, <strong>Bikes & Cars</strong>, and <strong>Power Systems</strong>.
          </p>

          {/* Device Category Pills */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-1">
            <span className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 font-medium flex items-center gap-1">
              <HomeIcon className="w-3 h-3 text-emerald-400" /> Home Appliances
            </span>
            <span className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 font-medium flex items-center gap-1">
              <Smartphone className="w-3 h-3 text-sky-400" /> Mobiles & Laptops
            </span>
            <span className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 font-medium flex items-center gap-1">
              <Car className="w-3 h-3 text-amber-400" /> Bikes & Cars
            </span>
            <span className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 font-medium flex items-center gap-1">
              <Cpu className="w-3 h-3 text-purple-400" /> Power Systems
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
            <span className="block text-xs text-slate-400 font-medium">Universal Coverage</span>
            <span className="text-xs font-bold text-emerald-400">All Devices & Vehicles</span>
          </div>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-4 bg-red-950/80 border border-red-800 rounded-2xl text-red-200 text-xs md:text-sm flex items-start gap-3">
          <AlertOctagon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold text-red-300">Diagnosis Error: </strong>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Main flow: Upload or Results */}
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
