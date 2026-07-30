"use client";

import { AlertTriangle, ShieldCheck, Flame, Zap } from "lucide-react";

interface SafetyBannerProps {
  variant?: "persistent_disclaimer" | "high_risk_callout";
  reasoning?: string;
}

export default function SafetyBanner({ variant = "persistent_disclaimer", reasoning }: SafetyBannerProps) {
  if (variant === "high_risk_callout") {
    return (
      <div className="bg-red-950/90 border-2 border-red-600 rounded-2xl p-4 md:p-6 text-red-100 shadow-xl shadow-red-950/50 my-4 animate-fade-in">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-red-600/30 rounded-xl border border-red-500/40 text-red-400 shrink-0">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-bold text-lg text-red-200 tracking-tight flex items-center gap-2">
              <span>CALL A LICENSED PROFESSIONAL</span>
            </h3>
            <p className="text-sm leading-relaxed text-red-200/90 font-medium">
              {reasoning || "This issue involves severe risks (electrical, gas, or structural plumbing). Do NOT attempt DIY repairs."}
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold text-red-300">
              <span className="bg-red-900/60 border border-red-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> Gas Hazard
              </span>
              <span className="bg-red-900/60 border border-red-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-yellow-400" /> High Voltage
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-3.5 text-amber-200 text-xs md:text-sm shadow-md my-4 flex items-start gap-3">
      <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
      <div className="leading-snug">
        <strong className="font-semibold text-amber-300">Safety Notice: </strong>
        <span>
          This is AI-generated guidance, not a substitute for a licensed technician. Stop immediately if you smell gas or see sparking.
        </span>
      </div>
    </div>
  );
}
