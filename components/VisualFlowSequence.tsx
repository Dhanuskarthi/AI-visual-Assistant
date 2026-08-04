"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Camera,
  Upload,
  Cpu,
  AlertTriangle,
  CheckSquare,
  CheckCircle2,
  Zap,
  Wrench
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Language } from "@/lib/translations";

interface StepIconMap {
  [key: number]: any;
}

const STEP_ICONS: StepIconMap = {
  1: Sparkles,
  2: Camera,
  3: Camera,
  4: Upload,
  5: Cpu,
  6: AlertTriangle,
  7: CheckSquare,
  8: CheckCircle2,
  9: Zap,
  10: Wrench
};

const STEP_BADGE_COLORS: Record<number, string> = {
  1: "bg-indigo-500/15 border-indigo-500/30 text-indigo-300",
  2: "bg-sky-500/15 border-sky-500/30 text-sky-300",
  3: "bg-rose-500/15 border-rose-500/30 text-rose-300",
  4: "bg-purple-500/15 border-purple-500/30 text-purple-300",
  5: "bg-amber-500/15 border-amber-500/30 text-amber-300",
  6: "bg-red-500/15 border-red-500/30 text-red-300",
  7: "bg-indigo-500/15 border-indigo-500/30 text-indigo-300",
  8: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
  9: "bg-indigo-500/15 border-indigo-500/30 text-indigo-300",
  10: "bg-amber-500/15 border-amber-500/30 text-amber-300"
};

interface FlowStepContent {
  id: number;
  stepNumber: string;
  title: string;
  headline: string;
  description: string;
  badgeText: string;
  imageSrc: string;
}

const FLOW_STEPS_DATA: Record<Language, FlowStepContent[]> = {
  en: [
    {
      id: 1,
      stepNumber: "01",
      title: "Welcome Interface",
      headline: "Futuristic Visual AI Companion",
      description: "Launch FixVision AI from any smartphone or browser. Clean glassmorphic design built for instant visual troubleshooting.",
      badgeText: "01 • ENTRY POINT",
      imageSrc: "/demo/frame_1.png"
    },
    {
      id: 2,
      stepNumber: "02",
      title: "Camera Activation",
      headline: "Point Camera at Damaged Area",
      description: "Open the live camera stream and frame the broken appliance component, leaking hose, circuit breaker, or error code display.",
      badgeText: "02 • LIVE VIEW",
      imageSrc: "/demo/frame_2.png"
    },
    {
      id: 3,
      stepNumber: "03",
      title: "Photo Capture",
      headline: "High-Resolution Focus & Flash",
      description: "Snap a photo or short video clip with instant auto-focus targeting. Camera shutter animation confirms clear specimen capture.",
      badgeText: "03 • SNAP PHOTO",
      imageSrc: "/demo/frame_3.png"
    },
    {
      id: 4,
      stepNumber: "04",
      title: "Secure AI Upload",
      headline: "Streaming Data to Vision Cloud",
      description: "Your captured media streams securely to the cloud backend with real-time data particle transfer and zero latency.",
      badgeText: "04 • AI UPLOAD",
      imageSrc: "/demo/frame_4.png"
    },
    {
      id: 5,
      stepNumber: "05",
      title: "Multimodal AI Scan",
      headline: "Scanning Visual Features",
      description: "State-of-the-art vision models (NVIDIA Llama 3.2 Vision, Gemini Flash, GPT-4o) scan visual symptoms with laser precision.",
      badgeText: "05 • VISION SCAN",
      imageSrc: "/demo/frame_5.png"
    },
    {
      id: 6,
      stepNumber: "06",
      title: "Fault Identification",
      headline: "Pinpoint & Bounding Box Labels",
      description: "Detected issues are visually highlighted and labeled (e.g. 'Loose Wire', 'Burn Mark', 'Broken Switch') with confidence scores.",
      badgeText: "06 • FAULT DETECTED",
      imageSrc: "/demo/frame_6.png"
    },
    {
      id: 7,
      stepNumber: "07",
      title: "Guided Repair Steps",
      headline: "Step-by-Step DIY & Tools List",
      description: "Interactive glassmorphic checklist displays required tools, estimated repair times, and clear English audio read-aloud.",
      badgeText: "07 • REPAIR STEPS",
      imageSrc: "/demo/frame_7.png"
    },
    {
      id: 8,
      stepNumber: "08",
      title: "Repair Verification",
      headline: "Verified Safe Operation",
      description: "Follow safety precautions, complete repair steps, and verify full device functionality with green success checkmark status.",
      badgeText: "08 • REPAIR COMPLETE",
      imageSrc: "/demo/frame_8.png"
    },
    {
      id: 9,
      stepNumber: "09",
      title: "Instant Action CTA",
      headline: "Ready for Your Next Scan",
      description: "Diagnose home appliances, mobile devices, laptops, vehicles, and circuit breaker systems anytime with one tap.",
      badgeText: "09 • TRY NOW",
      imageSrc: "/demo/frame_9.png"
    },
    {
      id: 10,
      stepNumber: "10",
      title: "Seamless AI Assistant",
      headline: "24/7 AI Troubleshooting Shield",
      description: "Always available visual diagnostic assistant with hardcoded safety screening and official certified brand service center contacts.",
      badgeText: "10 • 24/7 ACTIVE",
      imageSrc: "/demo/frame_10.png"
    }
  ],
  ta: [
    {
      id: 1,
      stepNumber: "01",
      title: "வரவேற்பு பக்கம்",
      headline: "ஸ்மார்ட் AI காட்சி உதவியாளர்",
      description: "எந்த மொபைல் அல்லது உலாவியிலிருந்தும் FixVision AI-ஐ இயக்கலாம். எளிய, நவீன வடிவமைப்புடன் கூடிய பழுது கண்டறியும் கருவி.",
      badgeText: "01 • தொடக்கம்",
      imageSrc: "/demo/frame_1.png"
    },
    {
      id: 2,
      stepNumber: "02",
      title: "கேமரா இயக்கம்",
      headline: "பழுதடைந்த பகுதியை கேமராவில் காட்டுங்கள்",
      description: "நேரலை கேமராவைத் திறந்து பழுதடைந்த பாகம், கசியும் குழாய், பிரேக்கர் அல்லது பிழை குறியீட்டை தெளிவாகக் காட்டுங்கள்.",
      badgeText: "02 • நேரலை கேமரா",
      imageSrc: "/demo/frame_2.png"
    },
    {
      id: 3,
      stepNumber: "03",
      title: "புகைப்படம் எடுத்தல்",
      headline: "தெளிவான புகைப்படம் & ஃபிளாஷ்",
      description: "துல்லியமான தானியங்கி ஃபோகஸுடன் புகைப்படம் அல்லது குறுகிய வீடியோ கிளிப் எடுக்கவும்.",
      badgeText: "03 • படம் எடு",
      imageSrc: "/demo/frame_3.png"
    },
    {
      id: 4,
      stepNumber: "04",
      title: "பாதுகாப்பான AI பதிவேற்றம்",
      headline: "கிளவுட் அமைப்பிற்கு பதிவேற்றப்படுகிறது",
      description: "நீங்கள் எடுத்த படம் பாதுகாப்பாக AI கிளவுட் சேவையகத்திற்கு உடனடியாக பதிவேற்றப்படுகிறது.",
      badgeText: "04 • AI பதிவேற்றம்",
      imageSrc: "/demo/frame_4.png"
    },
    {
      id: 5,
      stepNumber: "05",
      title: "AI விஷன் ஆய்வு",
      headline: "காட்சி அம்சங்களை ஆய்வு செய்தல்",
      description: "NVIDIA Llama 3.2 Vision, Gemini Flash, GPT-4o AI மாதிரிகள் உங்கள் படத்தின் பழுதுகளை துல்லியமாக பரிசோதிக்கின்றன.",
      badgeText: "05 • விஷன் ஆய்வு",
      imageSrc: "/demo/frame_5.png"
    },
    {
      id: 6,
      stepNumber: "06",
      title: "பழுது கண்டறிதல்",
      headline: "பழுதடைந்த பாகங்களை சுட்டிக்காட்டுதல்",
      description: "கண்டறியப்பட்ட பிரச்சனைகள் ('தளர்வான கம்பி', 'எரிந்த அடையாளம்', 'உடைந்த சுவிட்ச்') தெளிவாக லேபிள் செய்யப்பட்டு காட்டப்படுகின்றன.",
      badgeText: "06 • பழுது கண்டறியப்பட்டது",
      imageSrc: "/demo/frame_6.png"
    },
    {
      id: 7,
      stepNumber: "07",
      title: "பழுதுபார்க்கும் படிகள்",
      headline: "படி-படியாக நீங்களே செய்யும் வழிகாட்டி",
      description: "தேவையான கருவிகள், மதிப்பிடப்பட்ட நேரம் மற்றும் குரல் வழிகாட்டலுடன் எளிய பழுதுபார்க்கும் படிகள் உருவாக்கப்படுகின்றன.",
      badgeText: "07 • பழுதுபார்க்கும் படிகள்",
      imageSrc: "/demo/frame_7.png"
    },
    {
      id: 8,
      stepNumber: "08",
      title: "பழுதுபார்க்கும் உறுதிப்படுத்தல்",
      headline: "பாதுகாப்பான இயக்கம் உறுதிசெய்யப்பட்டது",
      description: "பாதுகாப்பு முறைகளைப் பின்பற்றி பழுதுபார்த்து, சாதனத்தின் செயல்பாட்டை பச்சை நிற வெற்றி குறியீட்டுடன் உறுதிப்படுத்துங்கள்.",
      badgeText: "08 • பழுது பூர்த்தியடைந்தது",
      imageSrc: "/demo/frame_8.png"
    },
    {
      id: 9,
      stepNumber: "09",
      title: "உடனடி நடவடிக்கை",
      headline: "அடுத்த ஆய்வுக்கு தயார்",
      description: "வீட்டு உபகரணங்கள், மொபைல், வாகனங்கள் மற்றும் மின்சார அமைப்புகளை எப்போதும் ஒரே தட்டலில் ஆய்வு செய்யுங்கள்.",
      badgeText: "09 • ஆய்வைத் தொடங்கு",
      imageSrc: "/demo/frame_9.png"
    },
    {
      id: 10,
      stepNumber: "10",
      title: "தொடர் AI உதவியாளர்",
      headline: "24/7 AI பாதுகாப்பு கவசம்",
      description: "எப்போதும் கிடைக்கும் AI பழுதுபார்க்கும் உதவியாளர் மற்றும் அதிகாரப்பூர்வ பிராண்ட் சேவை மையங்களின் தொடர்பு விபரம்.",
      badgeText: "10 • 24/7 செயலில்",
      imageSrc: "/demo/frame_10.png"
    }
  ]
};

export default function VisualFlowSequence() {
  const { language } = useLanguage();
  const [visibleItems, setVisibleItems] = useState<Record<number, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const stepsList = FLOW_STEPS_DATA[language] || FLOW_STEPS_DATA.en;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepId = Number(entry.target.getAttribute("data-step-id"));
            if (stepId) {
              setVisibleItems((prev) => ({ ...prev, [stepId]: true }));
            }
          }
        });
      },
      { threshold: 0.15 }
    );

    const stepElements = containerRef.current?.querySelectorAll("[data-step-id]");
    stepElements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="space-y-16 md:space-y-24 max-w-5xl mx-auto px-4">
      {/* Header Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold shadow-lg">
          <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span>
            {language === "ta" ? "காட்சி பழுது கண்டறிதல் பயணம்" : "Visual Product Flow Walkthrough"}
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          {language === "ta" ? "முழுமையான 10-படி AI பழுது கண்டறிதல் பயணம்" : "Complete 10-Step Visual Diagnosis Journey"}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          {language === "ta"
            ? "கேமரா படம் எடுப்பது முதல் AI பழுது கண்டறிதல், பாதுகாப்பு பரிசோதனை மற்றும் பழுதுபார்க்கும் படிகள் வரையிலான முழு வழிகாட்டி."
            : "See how FixVision AI guides you from initial camera photo capture to AI fault detection, safety verification, and guided repair steps."}
        </p>
      </div>

      {/* 10 Flow Cards in Alternating Timeline Layout */}
      <div className="relative space-y-12 md:space-y-16">
        {/* Connecting Vertical Laser Glow Line */}
        <div className="hidden md:block absolute top-8 bottom-8 left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-indigo-500 via-rose-500 to-emerald-400 opacity-30 pointer-events-none" />

        {stepsList.map((step, idx) => {
          const isEven = idx % 2 === 0;
          const isVisible = visibleItems[step.id];
          const IconComp = STEP_ICONS[step.id] || Sparkles;
          const badgeColor = STEP_BADGE_COLORS[step.id] || "bg-indigo-500/15 border-indigo-500/30 text-indigo-300";

          return (
            <div
              key={step.id}
              data-step-id={step.id}
              className={`relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
            >
              {/* Image Frame */}
              <div className={`order-1 ${isEven ? "md:order-1" : "md:order-2"}`}>
                <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-950 border-2 border-slate-800 shadow-2xl group">
                  <img
                    src={step.imageSrc}
                    alt={step.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-3 left-3 bg-slate-950/90 border border-slate-800 text-[10px] font-mono font-bold text-indigo-300 px-3 py-1 rounded-full">
                    {language === "ta" ? `படி ${step.stepNumber} / 10` : `FRAME ${step.stepNumber} OF 10`}
                  </div>
                </div>
              </div>

              {/* Text Card Content */}
              <div className={`space-y-4 order-2 ${isEven ? "md:order-2" : "md:order-1"}`}>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full border text-xs font-bold ${badgeColor}`}>
                    {step.badgeText}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <IconComp className="w-5 h-5 text-indigo-400 shrink-0" />
                  <span>{step.headline}</span>
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {step.description}
                </p>

                <div className="pt-2">
                  <Link
                    href="/diagnose"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors group"
                  >
                    <span>{language === "ta" ? "ஆய்வை தொடங்கவும்" : "Try Diagnosis Flow"}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
