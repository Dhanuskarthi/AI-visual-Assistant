"use client";

import { useState, useEffect } from "react";
import { Camera, ShieldCheck, Wrench, X, Sparkles } from "lucide-react";

export default function OnboardingStrip() {
  const [isDismissed, setIsDismissed] = useState<boolean>(true);

  useEffect(() => {
    const dismissed = localStorage.getItem("fixvision_onboarding_dismissed");
    if (!dismissed) {
      setIsDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem("fixvision_onboarding_dismissed", "true");
  };

  if (isDismissed) return null;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-5 shadow-xl relative animate-fade-in space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Quick Guide — How FixVision Works</span>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:ring-2 focus:ring-rose-500 focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Dismiss quick guide"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
        {/* Step 1 */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-rose-500/30">
            1
          </div>
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-rose-400" /> Snap or Upload
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
              Take a clear picture or video of the issue, error code, or model tag.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-amber-500/30">
            2
          </div>
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> AI Scan & Safety Check
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
              Vision AI identifies the fault while safety rules screen for gas & electrical risks.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-500/30">
            3
          </div>
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-emerald-400" /> Get Repair Steps
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
              Follow step-by-step DIY instructions or connect directly with certified brand pros.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
