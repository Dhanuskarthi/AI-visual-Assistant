"use client";

import { useState } from "react";
import { Sparkles, X, Play, ShieldAlert, CheckCircle2, Wrench, ArrowRight, Home as HomeIcon, Zap, Smartphone, Car } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import DiagnosisResult from "./DiagnosisResult";
import { ApplianceDiagnosis } from "@/types/diagnosis";

const SAMPLE_DEMOS: Record<string, { title: string; category: string; icon: any; diagnosis: ApplianceDiagnosis }> = {
  washer_e4: {
    title: "Washing Machine - E4 Drain Error",
    category: "home_appliance",
    icon: HomeIcon,
    diagnosis: {
      appliance_type: "home_appliance",
      brand_model_guess: "Samsung / LG Front Load Washer V9",
      identified_issue: "Drain Pump Obstruction / E4 Water Drainage Failure",
      error_code: "E4",
      confidence_score: 0.95,
      safety_risk_level: "low",
      safety_reasoning: "Low voltage pump clearout. Safe to clean filter once power plug is disconnected.",
      is_diy_safe: true,
      required_tools: ["Shallow Drain Tray", "Old Towel", "Flashlight / Phone Light", "Small Pliers"],
      repair_steps: [
        "Unplug the washer cord from wall socket. Open bottom right access flap and place shallow tray under drain tube hose.",
        "Unclip small emergency drain hose plug and let trapped water empty completely into shallow tray.",
        "Turn main pump filter counter-clockwise to unscrew. Clear coin, lint, or hairpin buildup from filter mesh.",
        "Screw pump filter tightly back in place, re-plug power cord, and run a 5-minute quick rinse cycle to verify code E4 is cleared."
      ],
      estimated_time_minutes: 15,
      requires_professional_reason: null,
      ai_model_used: "Gemini 2.5 Flash + FixVision Vision Engine"
    }
  },
  breaker_tripped: {
    title: "Electrical Panel - Tripped Circuit Breaker",
    category: "electrical_panel",
    icon: Zap,
    diagnosis: {
      appliance_type: "electrical_panel",
      brand_model_guess: "Schneider / Havells 63A Distribution Board",
      identified_issue: "Overload Circuit Trip (Breaker Lever in Center Off Position)",
      error_code: "MCB-TRIP-32A",
      confidence_score: 0.92,
      safety_risk_level: "medium",
      safety_reasoning: "Resetting tripped lever is safe if panel cover is closed and dry. Do NOT touch open busbars.",
      is_diy_safe: true,
      required_tools: ["Insulated Rubber Shoes", "Flashlight"],
      repair_steps: [
        "Unplug heavy loads (Air Conditioner, Water Heater/Geyser, Microwave) on the affected room circuit.",
        "Breaker levers catch in mid-position when tripped. Push lever firmly DOWN to the full OFF position to reset spring latch.",
        "Push lever smoothly UP into ON position until audible CLICK is heard."
      ],
      estimated_time_minutes: 5,
      requires_professional_reason: null,
      ai_model_used: "NVIDIA Llama 3.2 11B Vision"
    }
  },
  phone_battery: {
    title: "Mobile Phone - Swollen Battery Hazard",
    category: "mobile_laptop",
    icon: Smartphone,
    diagnosis: {
      appliance_type: "mobile_laptop",
      brand_model_guess: "Generic Smartphone / Laptop Li-ion Assembly",
      identified_issue: "Severe Li-Po Battery Gas Swelling & Screen Separation",
      error_code: "BATT-SWELL-HAZARD",
      confidence_score: 0.98,
      safety_risk_level: "call_a_professional",
      safety_reasoning: "Puncturing swollen lithium battery can cause violent chemical thermal runaway, toxic gas emission, or fire.",
      is_diy_safe: false,
      required_tools: ["Fire-safe Metal Container", "Safety Glasses"],
      repair_steps: [
        "Power down phone completely. Move phone onto a tile floor or metal container away from paper or curtains.",
        "Bring device directly to certified technician equipped with Li-ion hazard disposal kit."
      ],
      estimated_time_minutes: 0,
      requires_professional_reason: "Li-Po battery envelope expansion presents severe risk of fire or thermal runaway upon puncture.",
      ai_model_used: "OpenAI GPT-4o-mini Vision"
    }
  }
};

export default function QuickDemoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDemoKey, setActiveDemoKey] = useState<string | null>(null);
  const { language } = useLanguage();

  const selectedDemo = activeDemoKey ? SAMPLE_DEMOS[activeDemoKey] : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 rounded-2xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold transition-all flex items-center gap-2 shadow-md hover:scale-105"
      >
        <Play className="w-3.5 h-3.5 fill-indigo-400 text-indigo-400" />
        <span>{language === "ta" ? "நேரலை டெமோவை முயற்சிக்கவும்" : "Try Interactive Demo"}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-2 border-indigo-500/50 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 text-slate-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white">
                    {language === "ta" ? "நேரலை AI மாதிரி சோதனை" : "Interactive Diagnostic Demo Simulator"}
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">
                    Select a sample scenario to instantly test AI vision identification, safety checks & step guides.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setActiveDemoKey(null);
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scenario Picker Cards */}
            {!selectedDemo ? (
              <div className="space-y-4">
                <p className="text-xs text-indigo-300 font-bold uppercase tracking-wider">
                  Choose a Preset Diagnostic Scenario:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(SAMPLE_DEMOS).map(([key, item]) => {
                    const IconComp = item.icon;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setActiveDemoKey(key)}
                        className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/60 hover:bg-indigo-950/30 text-left transition-all group shadow-lg flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <IconComp className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-extrabold text-white text-sm group-hover:text-indigo-300 transition-colors">
                              {item.title}
                            </h3>
                            <span className="text-[11px] text-slate-400 font-mono block mt-1">
                              Code: {item.diagnosis.error_code}
                            </span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-indigo-400 font-bold">
                          <span>Simulate Diagnosis</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Simulated Result View */
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-slate-950/80 px-4 py-2.5 rounded-2xl border border-slate-800">
                  <span className="text-xs text-indigo-300 font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Simulated Result: {selectedDemo.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveDemoKey(null)}
                    className="text-xs text-slate-400 hover:text-white underline font-semibold"
                  >
                    ← Choose Different Scenario
                  </button>
                </div>

                <DiagnosisResult
                  diagnosis={selectedDemo.diagnosis}
                  diagnosisId={9999}
                  mediaUrl=""
                  mediaType="image"
                  onReset={() => setActiveDemoKey(null)}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
