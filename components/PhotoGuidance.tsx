import { useState } from "react";
import { Camera, Check, X, Home as HomeIcon, Smartphone, Car, Zap, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function PhotoGuidance() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<"appliance" | "mobile" | "vehicle" | "circuit_breaker">("appliance");
  const { language, t } = useLanguage();

  const categories = [
    {
      id: "appliance",
      label: "Home Appliance",
      icon: HomeIcon,
      accentColor: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
      tips: [
        "Include digital screen showing error code (e.g. E4, LE, d80) if visible.",
        "Capture appliance brand logo or silver metal model plate.",
        "Ensure good lighting around drum seals, lint filters, or water inlet valves."
      ],
      doList: ["Error screen digits", "Model number plate", "Leaking connection point"],
      dontList: ["Faraway shot of whole room", "Reflective glare hiding text"]
    },
    {
      id: "mobile",
      label: "Mobiles & Laptops",
      icon: Smartphone,
      accentColor: "text-sky-400 border-sky-500/40 bg-sky-500/10",
      tips: [
        "Use macro focus for charging ports, SIM trays, or headphone jacks.",
        "Capture screen crack patterns or display pixel discoloration.",
        "Frame any physical battery bulge or connector pin damage clearly."
      ],
      doList: ["Charging port slot interior", "Device back panel model label", "Display fault line"],
      dontList: ["Fingerprints obscuring port", "Extreme dark shadows"]
    },
    {
      id: "vehicle",
      label: "Bikes & Cars",
      icon: Car,
      accentColor: "text-amber-400 border-amber-500/40 bg-amber-500/10",
      tips: [
        "Capture battery terminal posts showing white/blue corrosion buildup.",
        "Focus on dashboard warning lights (Check Engine, ABS, Battery).",
        "Point camera directly at fluid leaks or damaged belt/hose connections."
      ],
      doList: ["12V battery terminal clamps", "Engine bay dipstick/hose", "Tread wear indicator"],
      dontList: ["Entire car exterior from 10ft away", "Shaky out-of-focus video"]
    },
    {
      id: "circuit_breaker",
      label: "Circuit Breaker & Power",
      icon: Zap,
      accentColor: "text-rose-400 border-rose-500/40 bg-rose-500/10",
      tips: [
        "Frame breaker switches showing tripped middle/OFF position label.",
        "Capture breaker panel amp rating numbers (15A, 20A, 50A).",
        "Keep a safe distance (1-2 feet) — NEVER touch exposed live wires."
      ],
      doList: ["Panel door labels & switch positions", "Inverter display LCD"],
      dontList: ["Opening internal live high-voltage covers", "Flash reflection on glass"]
    }
  ];

  const currentCat = categories.find((c) => c.id === activeCategory)!;

  return (
    <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-4 transition-all">
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full flex items-center justify-between text-left group"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-105 transition-transform">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs md:text-sm text-slate-200 group-hover:text-amber-300 transition-colors flex items-center gap-2">
              <span>Photo Framing Guide for Best AI Accuracy</span>
              <span className="bg-amber-500/10 text-amber-300 text-[10px] px-2 py-0.5 rounded-full border border-amber-500/20 font-mono">
                Tips
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              {isExpanded ? "Select category to view framing guidelines" : "Click to view recommended photo framing tips per device"}
            </p>
          </div>
        </div>

        <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 group-hover:text-white">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-800 space-y-4 animate-fade-in">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => {
              const IconComp = cat.icon;
              const isSelected = cat.id === activeCategory;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-slate-800 text-white border border-slate-600 shadow-md"
                      : "bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200"
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${isSelected ? "text-amber-400" : ""}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Category Content */}
          <div className="space-y-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Framing Tips for {currentCat.label}:</span>
            </div>

            <ul className="space-y-1.5 text-xs text-slate-300 pl-1">
              {currentCat.tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 space-y-1">
                <span className="font-extrabold text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> DO INCLUDE:
                </span>
                <p className="text-emerald-200/90">{currentCat.doList.join(" • ")}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/50 space-y-1">
                <span className="font-extrabold text-rose-400 flex items-center gap-1">
                  <X className="w-3.5 h-3.5 stroke-[3]" /> AVOID:
                </span>
                <p className="text-rose-200/90">{currentCat.dontList.join(" • ")}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
