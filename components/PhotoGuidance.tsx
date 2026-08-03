"use client";

import { useState } from "react";
import { Camera, Check, X, Home as HomeIcon, Smartphone, Car, Zap, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function PhotoGuidance() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<"appliance" | "mobile" | "vehicle" | "circuit_breaker">("appliance");
  const { language, t } = useLanguage();

  const isTa = language === "ta";

  const categories = [
    {
      id: "appliance",
      label: isTa ? "வீட்டு உபகரணங்கள்" : "Home Appliance",
      icon: HomeIcon,
      tips: isTa ? [
        "பிழை குறியீடு (எ.கா. E4, LE, d80) திரை இருந்தால் அதைத் தெளிவாகப் படம் எடுக்கவும்.",
        "சாதனத்தின் பிராண்ட் லோகோ அல்லது வெள்ளி மாடல் லேபிளை படம் எடுக்கவும்.",
        "டிரம் சீல்கள், லின்ட் பில்டர்கள் அல்லது நீர் உட்செலுத்தும் வால்வுகள் சுற்றிலும் நல்ல வெளிச்சம் இருப்பதை உறுதி செய்யவும்."
      ] : [
        "Include digital screen showing error code (e.g. E4, LE, d80) if visible.",
        "Capture appliance brand logo or silver metal model plate.",
        "Ensure good lighting around drum seals, lint filters, or water inlet valves."
      ],
      doList: isTa ? ["பிழைத் திரை எண்கள்", "மாடல் எண் லேபிள்", "கசியும் இணைப்புப் பகுதி"] : ["Error screen digits", "Model number plate", "Leaking connection point"],
      dontList: isTa ? ["அறை முழுவதையும் தூரத்தில் இருந்து படம் எடுத்தல்", "எழுத்துக்களை மறைக்கும் பிரதிபலிப்பு வெளிச்சம்"] : ["Faraway shot of whole room", "Reflective glare hiding text"]
    },
    {
      id: "mobile",
      label: isTa ? "மொபைல்கள் & லேப்டாப்கள்" : "Mobiles & Laptops",
      icon: Smartphone,
      tips: isTa ? [
        "சார்ஜிங் போர்ட்கள், சிம் ட்ரே அல்லது ஹெட்போன் ஜாக்குகளுக்கு மேக்ரோ ஃபோகஸைப் பயன்படுத்தவும்.",
        "திரை விரிசல் அல்லது டிஸ்ப்ளே பிக்சல் குறைபாட்டை படம் எடுக்கவும்.",
        "பேட்டரி வீக்கம் அல்லது கனெக்டர் பின் சேதத்தை தெளிவாகக் காட்டவும்."
      ] : [
        "Use macro focus for charging ports, SIM trays, or headphone jacks.",
        "Capture screen crack patterns or display pixel discoloration.",
        "Frame any physical battery bulge or connector pin damage clearly."
      ],
      doList: isTa ? ["சார்ஜிங் போர்ட் உள்பகுதி", "சாதனத்தின் பின் மாடல் லேபிள்", "திரை பழுதுக் கோடு"] : ["Charging port slot interior", "Device back panel model label", "Display fault line"],
      dontList: isTa ? ["போர்ட்டை மறைக்கும் கைரேகைகள்", "அதிக இருட்டான நிழல்கள்"] : ["Fingerprints obscuring port", "Extreme dark shadows"]
    },
    {
      id: "vehicle",
      label: isTa ? "பைக்குகள் & கார்கள்" : "Bikes & Cars",
      icon: Car,
      tips: isTa ? [
        "வெள்ளை/நீல துருப்பிடித்த பேட்டரி முனைகளைப் படம் எடுக்கவும்.",
        "டாஷ்போர்டு எச்சரிக்கை விளக்குகளில் (Check Engine, ABS, Battery) கவனம் செலுத்தவும்.",
        "திரவக் கசிவு அல்லது சேதமடைந்த பெல்ட்/குழாய் இணைப்புகளை நேரடியாக படம் எடுக்கவும்."
      ] : [
        "Capture battery terminal posts showing white/blue corrosion buildup.",
        "Focus on dashboard warning lights (Check Engine, ABS, Battery).",
        "Point camera directly at fluid leaks or damaged belt/hose connections."
      ],
      doList: isTa ? ["12V பேட்டரி முனைகள்", "எஞ்சின் ஆயில் டிப்பேக்/குழாய்", "டயர் தேய்மான காட்டி"] : ["12V battery terminal clamps", "Engine bay dipstick/hose", "Tread wear indicator"],
      dontList: isTa ? ["காரை 10 அடி தூரத்தில் இருந்து படம் எடுத்தல்", "மங்கலான அசைவு வீடியோ"] : ["Entire car exterior from 10ft away", "Shaky out-of-focus video"]
    },
    {
      id: "circuit_breaker",
      label: isTa ? "மின்சார அமைப்புகள்" : "Circuit Breaker & Power",
      icon: Zap,
      tips: isTa ? [
        "ட்ரிப் ஆன நடுப்பகுதி/OFF சுவிட்ச் லேபிளை தெளிவாக படம் எடுக்கவும்.",
        "பிரேக்கர் பேனல் ஆம்பியர் எண்களை (15A, 20A, 50A) படம் எடுக்கவும்.",
        "பாதுகாப்பான தூரத்தில் இருங்கள் — மின்சார ஒயிர்களைத் தொடாதீர்கள்."
      ] : [
        "Frame breaker switches showing tripped middle/OFF position label.",
        "Capture breaker panel amp rating numbers (15A, 20A, 50A).",
        "Keep a safe distance (1-2 feet) — NEVER touch exposed live wires."
      ],
      doList: isTa ? ["பேனல் கதவு லேபிள்கள் & சுவிட்ச் நிலைகள்", "இன்வெர்ட்டர் எல்சிடி திரை"] : ["Panel door labels & switch positions", "Inverter display LCD"],
      dontList: isTa ? ["உள் உயர் மின்னழுத்த அட்டைகளைத் திறப்பது", "கண்ணாடிகளில் பிளாஷ் பிரதிபலிப்பு"] : ["Opening internal live high-voltage covers", "Flash reflection on glass"]
    }
  ];

  const currentCat = categories.find((c) => c.id === activeCategory)!;

  return (
    <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-4 transition-all">
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full flex items-center justify-between text-left group min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-105 transition-transform">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs md:text-sm text-slate-200 group-hover:text-amber-300 transition-colors flex items-center gap-2">
              <span>{t("photo_guide_title")}</span>
              <span className="bg-amber-500/10 text-amber-300 text-[10px] px-2 py-0.5 rounded-full border border-amber-500/20 font-mono">
                {isTa ? "குறிப்பு" : "Tips"}
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              {isExpanded ? t("photo_guide_sub_expanded") : t("photo_guide_sub_collapsed")}
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none ${
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
              <span>{t("framing_tips_for")} {currentCat.label}:</span>
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
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> {t("do_include")}
                </span>
                <p className="text-emerald-200/90">{currentCat.doList.join(" • ")}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/50 space-y-1">
                <span className="font-extrabold text-rose-400 flex items-center gap-1">
                  <X className="w-3.5 h-3.5 stroke-[3]" /> {t("avoid")}
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
