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

interface FlowStep {
  id: number;
  stepNumber: string;
  title: string;
  headline: string;
  description: string;
  imageSrc: string;
  badgeColor: string;
  badgeText: string;
  icon: any;
}

const FLOW_STEPS: FlowStep[] = [
  {
    id: 1,
    stepNumber: "01",
    title: "Welcome Interface",
    headline: "Futuristic Visual AI Companion",
    description: "Launch FixVision AI from any smartphone or browser. Clean glassmorphic design built for instant visual troubleshooting.",
    imageSrc: "/demo/frame_1.png",
    badgeColor: "bg-indigo-500/15 border-indigo-500/30 text-indigo-300",
    badgeText: "01 • ENTRY POINT",
    icon: Sparkles
  },
  {
    id: 2,
    stepNumber: "02",
    title: "Camera Activation",
    headline: "Point Camera at Damaged Area",
    description: "Open the live camera stream and frame the broken appliance component, leaking hose, circuit breaker, or error code display.",
    imageSrc: "/demo/frame_2.png",
    badgeColor: "bg-sky-500/15 border-sky-500/30 text-sky-300",
    badgeText: "02 • LIVE VIEW",
    icon: Camera
  },
  {
    id: 3,
    stepNumber: "03",
    title: "Photo Capture",
    headline: "High-Resolution Focus & Flash",
    description: "Snap a photo or short video clip with instant auto-focus targeting. Camera shutter animation confirms clear specimen capture.",
    imageSrc: "/demo/frame_3.png",
    badgeColor: "bg-rose-500/15 border-rose-500/30 text-rose-300",
    badgeText: "03 • SNAP PHOTO",
    icon: Camera
  },
  {
    id: 4,
    stepNumber: "04",
    title: "Secure AI Upload",
    headline: "Streaming Data to Vision Cloud",
    description: "Your captured media streams securely to the cloud backend with real-time data particle transfer and zero latency.",
    imageSrc: "/demo/frame_4.png",
    badgeColor: "bg-purple-500/15 border-purple-500/30 text-purple-300",
    badgeText: "04 • AI UPLOAD",
    icon: Upload
  },
  {
    id: 5,
    stepNumber: "05",
    title: "Multimodal AI Scan",
    headline: "Scanning Visual Features",
    description: "State-of-the-art vision models (NVIDIA Llama 3.2 Vision, Gemini Flash, GPT-4o) scan visual symptoms with laser precision.",
    imageSrc: "/demo/frame_5.png",
    badgeColor: "bg-amber-500/15 border-amber-500/30 text-amber-300",
    badgeText: "05 • VISION SCAN",
    icon: Cpu
  },
  {
    id: 6,
    stepNumber: "06",
    title: "Fault Identification",
    headline: "Pinpoint & Bounding Box Labels",
    description: "Detected issues are visually highlighted and labeled (e.g. 'Loose Wire', 'Burn Mark', 'Broken Switch') with confidence scores.",
    imageSrc: "/demo/frame_6.png",
    badgeColor: "bg-red-500/15 border-red-500/30 text-red-300",
    badgeText: "06 • FAULT DETECTED",
    icon: AlertTriangle
  },
  {
    id: 7,
    stepNumber: "07",
    title: "Guided Repair Steps",
    headline: "Step-by-Step DIY & Tools List",
    description: "Interactive glassmorphic checklist displays required tools, estimated repair times, and clear English audio read-aloud.",
    imageSrc: "/demo/frame_7.png",
    badgeColor: "bg-indigo-500/15 border-indigo-500/30 text-indigo-300",
    badgeText: "07 • REPAIR STEPS",
    icon: CheckSquare
  },
  {
    id: 8,
    stepNumber: "08",
    title: "Repair Verification",
    headline: "Verified Safe Operation",
    description: "Follow safety precautions, complete repair steps, and verify full device functionality with green success checkmark status.",
    imageSrc: "/demo/frame_8.png",
    badgeColor: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
    badgeText: "08 • REPAIR COMPLETE",
    icon: CheckCircle2
  },
  {
    id: 9,
    stepNumber: "09",
    title: "Instant Action CTA",
    headline: "Ready for Your Next Scan",
    description: "Diagnose home appliances, mobile devices, laptops, vehicles, and circuit breaker systems anytime with one tap.",
    imageSrc: "/demo/frame_9.png",
    badgeColor: "bg-indigo-500/15 border-indigo-500/30 text-indigo-300",
    badgeText: "09 • TRY NOW",
    icon: Zap
  },
  {
    id: 10,
    stepNumber: "10",
    title: "Seamless AI Assistant",
    headline: "24/7 AI Troubleshooting Shield",
    description: "Always available visual diagnostic assistant with hardcoded safety screening and official certified brand service center contacts.",
    imageSrc: "/demo/frame_10.png",
    badgeColor: "bg-amber-500/15 border-amber-500/30 text-amber-300",
    badgeText: "10 • 24/7 ACTIVE",
    icon: Wrench
  }
];

export default function VisualFlowSequence() {
  const [visibleItems, setVisibleItems] = useState<Record<number, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);

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
          <span>Visual Product Flow Walkthrough</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Complete 10-Step Visual Diagnosis Journey
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          See how FixVision AI guides you from initial camera photo capture to AI fault detection, safety verification, and guided repair steps.
        </p>
      </div>

      {/* 10 Flow Cards in Alternating Timeline Layout */}
      <div className="relative space-y-12 md:space-y-16">
        {/* Connecting Vertical Laser Glow Line */}
        <div className="hidden md:block absolute top-8 bottom-8 left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-indigo-500 via-rose-500 to-emerald-400 opacity-30 pointer-events-none" />

        {FLOW_STEPS.map((step, idx) => {
          const isEven = idx % 2 === 0;
          const isVisible = visibleItems[step.id];
          const IconComp = step.icon;

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
                    FRAME {step.stepNumber} OF 10
                  </div>
                </div>
              </div>

              {/* Text Card Content */}
              <div className={`space-y-4 order-2 ${isEven ? "md:order-2" : "md:order-1"}`}>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full border text-xs font-bold ${step.badgeColor}`}>
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
                    <span>Try Diagnosis Flow</span>
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
