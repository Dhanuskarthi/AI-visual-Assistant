"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import VisualFlowSequence from "@/components/VisualFlowSequence";
import {
  Camera,
  Cpu,
  ShieldCheck,
  CheckSquare,
  ArrowRight,
  Sparkles,
  Zap,
  ShieldAlert,
  Smartphone,
  Car,
  Home as HomeIcon,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Wrench
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function IntroLandingPage() {
  const { language, t } = useLanguage();

  // Scroll Intersection Observer States for calm, once-only scroll animations
  const [stepsVisible, setStepsVisible] = useState(false);
  const [sec1Visible, setSec1Visible] = useState(false);
  const [sec2Visible, setSec2Visible] = useState(false);
  const [sec3Visible, setSec3Visible] = useState(false);
  const [sec4Visible, setSec4Visible] = useState(false);

  const stepsRef = useRef<HTMLDivElement>(null);
  const sec1Ref = useRef<HTMLDivElement>(null);
  const sec2Ref = useRef<HTMLDivElement>(null);
  const sec3Ref = useRef<HTMLDivElement>(null);
  const sec4Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const createObserver = (setter: (v: boolean) => void) => {
      return new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setter(true);
            }
          });
        },
        { threshold: 0.2 }
      );
    };

    const obsSteps = createObserver(setStepsVisible);
    const obsSec1 = createObserver(setSec1Visible);
    const obsSec2 = createObserver(setSec2Visible);
    const obsSec3 = createObserver(setSec3Visible);
    const obsSec4 = createObserver(setSec4Visible);

    if (stepsRef.current) obsSteps.observe(stepsRef.current);
    if (sec1Ref.current) obsSec1.observe(sec1Ref.current);
    if (sec2Ref.current) obsSec2.observe(sec2Ref.current);
    if (sec3Ref.current) obsSec3.observe(sec3Ref.current);
    if (sec4Ref.current) obsSec4.observe(sec4Ref.current);

    return () => {
      obsSteps.disconnect();
      obsSec1.disconnect();
      obsSec2.disconnect();
      obsSec3.disconnect();
      obsSec4.disconnect();
    };
  }, []);

  return (
    <div className="relative space-y-16 sm:space-y-24 pb-16 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-12 left-1/4 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute top-96 right-1/4 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      {/* ================= STEP 2: HERO SECTION ================= */}
      <section className="relative pt-4 md:pt-8 text-center space-y-8 max-w-4xl mx-auto px-4">
        {/* Active Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold tracking-wide shadow-lg">
          <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span>{t("hero_badge")}</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
          {t("hero_title_1")} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-rose-400 to-amber-300">
            {t("hero_title_2")}
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {t("hero_desc")}
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/diagnose"
            aria-label="Start diagnosing device or vehicle issue"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-rose-600 to-amber-500 hover:from-indigo-500 hover:to-amber-400 text-white font-extrabold text-sm md:text-base flex items-center gap-2 shadow-2xl shadow-indigo-950/80 transition-all hover:scale-105 active:scale-95 group focus:ring-2 focus:ring-indigo-500"
          >
            <span>{language === "ta" ? "இப்போதே ஆய்வைத் தொடங்கு" : "Start Diagnosing Now"}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <a
            href="#how-it-works"
            aria-label="Scroll to how it works section"
            className="px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold text-sm transition-all hover:scale-105 focus:ring-2 focus:ring-indigo-500"
          >
            {t("how_it_works_btn")}
          </a>
        </div>

        {/* ================= CSS/SVG ANIMATED HERO ILLUSTRATION ================= */}
        <div className="pt-6">
          <div className="relative max-w-2xl mx-auto aspect-video rounded-3xl bg-slate-950/90 border-2 border-slate-800/90 shadow-2xl overflow-hidden p-6 flex items-center justify-center group">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-30" />

            {/* Glowing Laser Scan Sweep Line */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent animate-scan z-20 shadow-[0_0_20px_#f43f5e]" />

            {/* SVG Scanner HUD Overlay */}
            <svg
              className="w-full h-full max-w-md relative z-10"
              viewBox="0 0 400 240"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Device Silhouette (Washing Machine / Appliance) */}
              <rect x="130" y="40" width="140" height="160" rx="16" fill="#0f172a" stroke="#334155" strokeWidth="3" />
              <rect x="145" y="55" width="110" height="24" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
              <circle cx="160" cy="67" r="4" fill="#38bdf8" />
              <circle cx="175" cy="67" r="4" fill="#34d399" />
              <circle cx="190" cy="67" r="4" fill="#f43f5e" />
              
              {/* Circular Drum Door */}
              <circle cx="200" cy="135" r="42" fill="#020617" stroke="#6366f1" strokeWidth="3" />
              <circle cx="200" cy="135" r="30" fill="#1e1b4b" stroke="#818cf8" strokeDasharray="4 4" strokeWidth="2" />

              {/* Glowing Corner Target Reticles */}
              <path d="M 110 30 L 110 50 M 110 30 L 130 30" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
              <path d="M 290 30 L 290 50 M 290 30 L 270 30" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
              <path d="M 110 210 L 110 190 M 110 210 L 130 210" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
              <path d="M 290 210 L 290 190 M 290 210 L 270 210" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />

              {/* Animated Target Scanning Box */}
              <rect x="165" y="100" width="70" height="70" rx="8" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 4">
                <animate attributeName="stroke-dashoffset" from="0" to="20" dur="2s" repeatCount="indefinite" />
              </rect>

              {/* AI Detection Label Pill */}
              <rect x="210" y="85" width="110" height="28" rx="8" fill="#1e293b" stroke="#34d399" strokeWidth="1.5" />
              <text x="220" y="103" fill="#34d399" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                {language === "ta" ? "✓ பழுது கண்டறியப்பட்டது" : "✓ Issue Detected"}
              </text>
            </svg>

            {/* Bottom HUD Bar */}
            <div className="absolute bottom-3 left-4 right-4 bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2 flex items-center justify-between text-[11px] text-slate-300 font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                {language === "ta" ? "AI நேரலை ஆய்வு" : "AI SCANNING LIVE"}
              </span>
              <span className="hidden sm:inline text-slate-400">FPS: 60 • LATENCY: 240ms</span>
              <span className="text-indigo-300 font-bold">MULTIMODAL 3.0</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 10-FRAME VISUAL FLOW SEQUENCE ================= */}
      <section id="how-it-works" className="scroll-mt-24">
        <VisualFlowSequence />
      </section>

      {/* ================= STEP 4: SCROLL-TRIGGERED DETAIL SECTIONS ================= */}
      <section className="max-w-5xl mx-auto px-4 space-y-16 md:space-y-24">

        {/* Detail 1: Capture */}
        <div
          ref={sec1Ref}
          className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center transition-all duration-700 ${
            sec1Visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/40 border border-slate-800 shadow-2xl flex items-center justify-center relative overflow-hidden group">
            <div className="absolute top-4 left-4 text-[10px] font-mono text-indigo-400 uppercase font-bold">01 / CAPTURE</div>
            <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 group-hover:scale-110 transition-transform duration-500">
              <Camera className="w-16 h-16 animate-shutter" />
            </div>
          </div>

          <div className="space-y-4">
            <span className="px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
              {language === "ta" ? "01 • படம் அல்லது வீடியோ எடுக்கவும்" : "01 • Snap or Upload Any Issue"}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {language === "ta"
                ? "பிழை குறியீடு, கசியும் குழாய் அல்லது உடைந்த பாகங்களை படம் எடுக்கவும்"
                : "Capture Error Codes, Leaking Hoses or Broken Switches"}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {language === "ta"
                ? "சலவை இயந்திர பிழை குறியீடு, தளர்வான பைக் பேட்டரி அல்லது சர்க்யூட் பிரேக்கர் எதுவாக இருந்தாலும், படம் அல்லது குறுகிய வீடியோ எடுக்கவும்."
                : "Whether it’s a blinking washer error code, a loose bike battery terminal, or a tripped circuit breaker, simply take a photo or record a short video clip."}
            </p>
            <ul className="space-y-2 text-xs text-slate-300 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{language === "ta" ? "உயர் தெளிவுத்திறன் படங்கள் & 25MB வரையிலான வீடியோ ஆதரவு" : "Supports high-resolution photos & video clips up to 25 MB"}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{language === "ta" ? "உலாவியிலேயே அமைக்கப்பட்ட நேரலை கேமரா" : "Live camera capture built directly into your browser"}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Detail 2: Analyze */}
        <div
          ref={sec2Ref}
          className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center transition-all duration-700 ${
            sec2Visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="space-y-4 order-2 md:order-1">
            <span className="px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold">
              {language === "ta" ? "02 • AI விஷன் பகுப்பாய்வு" : "02 • Multimodal AI Analysis"}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {language === "ta"
                ? "பல்வேறு பிரிவுகளில் AI காட்சி துல்லியம்"
                : "Cross-Verified Vision Intelligence across Categories"}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {language === "ta"
                ? "NVIDIA Llama 3.2 Vision, Gemini 2.0 Flash மற்றும் GPT-4o ஆகிய முன்னணி AI மாதிரிகள் உங்கள் படத்தின் பழுதுகளை உடனடியாக பரிசோதிக்கின்றன."
                : "FixVision combines state-of-the-art vision models (NVIDIA Llama 3.2 Vision, Gemini 2.0 Flash, and GPT-4o) to visually inspect component damage."}
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1 text-xs font-semibold text-slate-200">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                <HomeIcon className="w-4 h-4 text-emerald-400" />
                <span>{t("cat_home")}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-sky-400" />
                <span>{t("cat_mobile")}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                <Car className="w-4 h-4 text-amber-400" />
                <span>{t("cat_vehicle")}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span>{t("cat_power")}</span>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-rose-950/40 border border-slate-800 shadow-2xl flex items-center justify-center relative overflow-hidden group order-1 md:order-2">
            <div className="absolute top-4 left-4 text-[10px] font-mono text-rose-400 uppercase font-bold">02 / ANALYZE</div>
            <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 group-hover:scale-110 transition-transform duration-500 relative">
              <Cpu className="w-16 h-16" />
              <div className="absolute inset-x-0 top-0 h-1 bg-rose-400 animate-grid-sweep shadow-[0_0_12px_#f43f5e]" />
            </div>
          </div>
        </div>

        {/* Detail 3: Safety Check */}
        <div
          ref={sec3Ref}
          className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center transition-all duration-700 ${
            sec3Visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/40 border border-slate-800 shadow-2xl flex items-center justify-center relative overflow-hidden group">
            <div className="absolute top-4 left-4 text-[10px] font-mono text-emerald-400 uppercase font-bold">03 / SAFETY SHIELD</div>
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 group-hover:scale-110 transition-transform duration-500">
              <ShieldCheck className="w-16 h-16 animate-checkmark" />
            </div>
          </div>

          <div className="space-y-4">
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              {language === "ta" ? "03 • தானியங்கி பாதுகாப்பு பரிசோதனை" : "03 • Automated Safety Screening"}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {language === "ta"
                ? "நீங்கள் தொடுவதற்கு முன் மின்சார & எரிவாயு அபாய ஆய்வு"
                : "Hardcoded Risk Screening Before You Touch Anything"}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {language === "ta"
                ? "உங்கள் பாதுகாப்பே எங்களின் முதல் முன்னுரிமை. உயர் மின்அழுத்தம், எரிவாயு கசிவு மற்றும் தீ அபாயங்கள் தானியங்கி முறைகளால் உடனுக்குடன் கண்டறியப்படுகின்றன."
                : "Your safety is our top priority. FixVision runs hard-coded screening rules for high-voltage risks, gas leaks, and fire hazards."}
            </p>
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-200">
              <ShieldAlert className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{language === "ta" ? "பாதுகாப்பு விதிகள் பரிசோதிக்கப்பட்டு உறுதிசெய்யப்படுகின்றன." : "Safety Rule Screening verified before output generation."}</span>
            </div>
          </div>
        </div>

        {/* Detail 4: Get Fix */}
        <div
          ref={sec4Ref}
          className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center transition-all duration-700 ${
            sec4Visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="space-y-4 order-2 md:order-1">
            <span className="px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
              {language === "ta" ? "04 • எளிய பழுதுபார்க்கும் வழிகாட்டி" : "04 • Guided DIY & Voice Assistance"}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {language === "ta"
                ? "குரல் வழிகாட்டலுடன் படி-படியாக பழுதுபார்க்கும் முறை"
                : "Clear Step-by-Step Fixes with Voice Read-Aloud"}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {language === "ta"
                ? "தேவையான கருவிகள், பழுதுபார்க்கும் நேரம் மற்றும் குரல் வழிகாட்டலுடன் எளிய பழுதுபார்க்கும் முறைகளைப் பின்பற்றுங்கள்."
                : "Follow clean, interactive DIY step checklists complete with estimated fix times, required tools lists, and clear English audio read-aloud."}
            </p>
            <ul className="space-y-2 text-xs text-slate-300 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{language === "ta" ? "தெளிவான குரல் வழிகாட்டி இயக்கி" : "Dedicated Clear English Read-Aloud Voice Player"}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{language === "ta" ? "சந்தேகங்களைக் கேட்க AI பழுதுபார்க்கும் உதவியாளர்" : "Interactive AI Repair Assistant Chatbot for follow-up questions"}</span>
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/40 border border-slate-800 shadow-2xl flex items-center justify-center relative overflow-hidden group order-1 md:order-2">
            <div className="absolute top-4 left-4 text-[10px] font-mono text-amber-400 uppercase font-bold">04 / EASY FIX</div>
            <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 group-hover:scale-110 transition-transform duration-500">
              <CheckSquare className="w-16 h-16" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= STEP 5: TRUST FOOTER & FINAL CTA STRIP ================= */}
      <section className="max-w-4xl mx-auto px-4 space-y-8 pt-8">
        {/* Safety Disclaimer & Multi-Model Trust Bar */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl text-center">
          <div className="flex items-center justify-center gap-2 text-amber-400 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{language === "ta" ? "AI பாதுகாப்பு எச்சரிக்கை" : "AI-Assisted Guidance Safety Disclaimer"}</span>
          </div>

          <p className="text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {language === "ta"
              ? "FixVision AI பழுதுபார்க்கும் உதவிகளை வழங்குகிறது. இது எரிவாயு மற்றும் உயர் மின்னழுத்த பழுதுகளுக்கான தொழில்முறை நிபுணருக்கு மாற்றாகாது."
              : "FixVision AI provides diagnostic assistance and educational troubleshooting guidance. It is not a substitute for a licensed professional technician for gas lines, high-voltage electrical panels, or hazardous repairs."}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-[11px] font-mono text-slate-400 border-t border-slate-800/80">
            <span className="flex items-center gap-1.5 text-indigo-300 font-bold">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" /> NVIDIA Llama 3.2 Vision
            </span>
            <span>•</span>
            <span className="text-emerald-300 font-bold">Gemini 2.0 Flash</span>
            <span>•</span>
            <span className="text-rose-300 font-bold">GPT-4o Vision</span>
          </div>
        </div>

        {/* Final CTA Banner */}
        <div className="relative p-8 md:p-10 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-rose-950 border border-indigo-500/40 shadow-2xl text-center space-y-5 overflow-hidden">
          <div className="relative z-10 space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {language === "ta" ? "உங்கள் சாதனத்தை ஆய்வு செய்யத் தயாரா?" : "Ready to Diagnose Your Device or Vehicle?"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
              {language === "ta"
                ? "புகைப்படம் அல்லது வீடியோ பதிவேற்றி நொடிகளில் AI ஆய்வு முடிவுகளைப் பெறுங்கள்."
                : "Snap a picture or upload media to get instant AI diagnostic results in seconds."}
            </p>
          </div>

          <div className="relative z-10 pt-2">
            <Link
              href="/diagnose"
              aria-label="Start free diagnostic scan now"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-rose-600 to-amber-500 hover:from-indigo-500 hover:to-amber-400 text-white font-extrabold text-sm md:text-base shadow-2xl transition-all hover:scale-105 active:scale-95 focus:ring-2 focus:ring-indigo-500"
            >
              <Wrench className="w-5 h-5" />
              <span>{language === "ta" ? "இலவச ஆய்வைத் தொடங்குங்கள்" : "Start Free Diagnosis Now"}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
