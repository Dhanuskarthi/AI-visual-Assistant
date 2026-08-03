"use client";

import { CheckCircle2, AlertTriangle, Cpu, Activity, ThumbsUp, ThumbsDown, Building2, HelpCircle } from "lucide-react";

interface StatusPillProps {
  variant: "diy_safe" | "pro_required" | "engine" | "confidence" | "outcome_fixed" | "outcome_broken" | "outcome_called_pro";
  label?: string;
  score?: number;
  engineName?: string;
  className?: string;
}

export default function StatusPill({ variant, label, score, engineName, className = "" }: StatusPillProps) {
  if (variant === "diy_safe") {
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm ${className}`}>
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>{label || "DIY Safe Repair"}</span>
      </span>
    );
  }

  if (variant === "pro_required") {
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm ${className}`}>
        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 animate-pulse" />
        <span>{label || "Professional Required"}</span>
      </span>
    );
  }

  if (variant === "engine") {
    const isUnavailable = !engineName || engineName === "unavailable" || engineName.includes("Unavailable");
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border ${isUnavailable ? "bg-slate-800 text-slate-400 border-slate-700" : "bg-sky-950/80 text-sky-300 border-sky-800"} ${className}`}>
        <Cpu className="w-3.5 h-3.5 text-sky-400 shrink-0" />
        <span>{isUnavailable ? "Analysis unavailable — we did not guess" : `Analyzed by ${engineName}`}</span>
      </span>
    );
  }

  if (variant === "confidence") {
    const s = score !== undefined ? Math.round(score * 100) : 0;
    const colorClass = s >= 80 ? "bg-emerald-950/80 text-emerald-300 border-emerald-800" : s >= 60 ? "bg-amber-950/80 text-amber-300 border-amber-800" : "bg-rose-950/80 text-rose-300 border-rose-800";
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold border ${colorClass} ${className}`}>
        <Activity className="w-3 h-3 shrink-0" />
        <span>{s}% Certainty</span>
      </span>
    );
  }

  if (variant === "outcome_fixed") {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 ${className}`}>
        <ThumbsUp className="w-3 h-3 text-emerald-400" />
        <span>Fixed</span>
      </span>
    );
  }

  if (variant === "outcome_broken") {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-rose-950 text-rose-300 border border-rose-800 ${className}`}>
        <ThumbsDown className="w-3 h-3 text-rose-400" />
        <span>Still Broken</span>
      </span>
    );
  }

  if (variant === "outcome_called_pro") {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-950 text-amber-300 border border-amber-800 ${className}`}>
        <Building2 className="w-3 h-3 text-amber-400" />
        <span>Called Pro</span>
      </span>
    );
  }

  return null;
}
