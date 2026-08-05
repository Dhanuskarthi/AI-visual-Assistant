"use client";

import { useState } from "react";
import { ShieldAlert, X, PhoneCall, Flame, Zap, AlertTriangle, BatteryCharging, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function EmergencySafetyModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
        aria-label="View Emergency Safety Guidelines"
      >
        <ShieldAlert className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>{language === "ta" ? "அவசர பாதுகாப்பு" : "Safety Rules"}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 text-slate-100">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white">
                    {language === "ta" ? "அவசர பாதுகாப்பு விதிமுறைகள்" : "Emergency Safety & Hazard Rules"}
                  </h2>
                  <p className="text-xs text-amber-300 font-medium">
                    {language === "ta" ? "உயிருக்கு ஆபத்தான சூழ்நிலைகளுக்கான விதிகள்" : "FixVision Hard-Coded Safety Gate Regulations"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Emergency Hotline Banner */}
            <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500/60 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
              <div className="flex items-center gap-3">
                <PhoneCall className="w-6 h-6 text-red-400 animate-bounce shrink-0" />
                <div>
                  <h3 className="font-bold text-white text-sm">
                    {language === "ta" ? "அவசர உதவி எண்கள்" : "Immediate Emergency Helplines"}
                  </h3>
                  <p className="text-xs text-red-200">
                    {language === "ta" ? "கேஸ் கசிவு அல்லது மின்சார ஆபத்து இருந்தால் உடனே அழைக்கவும்" : "Gas leak, electrical fire, or battery rupture in progress"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-mono font-bold shrink-0">
                <a
                  href="tel:1906"
                  className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white flex items-center gap-1.5 shadow-md"
                >
                  <Flame className="w-3.5 h-3.5" /> 1906 (Gas Emergency)
                </a>
                <a
                  href="tel:112"
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 flex items-center gap-1.5"
                >
                  112 (National Emergency)
                </a>
              </div>
            </div>

            {/* Critical Hazards List */}
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">
                {language === "ta" ? "கண்டிப்பாக தவிர்க்க வேண்டிய ஆபத்துகள்" : "High-Risk DIY Hazard Gates"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <Flame className="w-4 h-4" />
                    <span>1. Gas Leak / LPG Smell</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Never strike matches, flip light switches, or test electric components. Shut main cylinder valve and evacuate immediately.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm">
                    <Zap className="w-4 h-4" />
                    <span>2. Mains High Voltage / Arcing</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    If main breaker panels or 240V appliances show scorch marks or sparking, isolate main power before touching.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                    <BatteryCharging className="w-4 h-4" />
                    <span>3. Swollen Li-ion Batteries</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Swollen smartphone or laptop batteries can puncture and catch fire. Place in fire-safe area; do not puncture or charge.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>4. Vehicle Brake Line Failure</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Fluid leaks near brake calipers or spongy pedal response indicate brake system failure. Do not drive; call a tow truck.
                  </p>
                </div>
              </div>
            </div>

            {/* Standard Pre-Work Checklist */}
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
              <h4 className="font-extrabold text-sm text-indigo-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {language === "ta" ? "அடிப்படைக் கட்டுப்பாடுகள்" : "Golden Rules Before Any DIY Inspection"}
              </h4>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li>Always unplug the 230V/110V wall cord before opening appliance panels.</li>
                <li>Wear insulated rubber shoes and protective safety glasses.</li>
                <li>Keep water and wet rags away from exposed circuit boards or battery terminals.</li>
              </ul>
            </div>

            {/* Footer Close Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-white font-bold text-xs shadow-lg transition-transform hover:scale-105"
              >
                {language === "ta" ? "புரிந்தது" : "I Understand Safety Rules"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
