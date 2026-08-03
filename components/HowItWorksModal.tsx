"use client";

import { useState } from "react";
import { X, Upload, Cpu, ShieldCheck, Wrench, HelpCircle, CheckCircle2 } from "lucide-react";

interface HowItWorksModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  triggerAsButton?: boolean;
}

export default function HowItWorksModal({ isOpen = false, onClose, triggerAsButton = true }: HowItWorksModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const openState = onClose ? isOpen : internalOpen;
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setInternalOpen(false);
    }
  };

  const steps = [
    {
      number: "01",
      title: "Snap or Upload Media",
      icon: Upload,
      textColor: "text-rose-400",
      bgColor: "bg-rose-500/10 border-rose-500/30",
      description: "Capture a clear photo or short video of the error code, leaking hose, battery terminal, or damaged component."
    },
    {
      number: "02",
      title: "Multimodal AI Vision Scan",
      icon: Cpu,
      textColor: "text-amber-400",
      bgColor: "bg-amber-500/10 border-amber-500/30",
      description: "NVIDIA Llama 3.2 Vision, Gemini 2.5 Flash, or GPT-4o identify the exact appliance, brand model, and specific fault."
    },
    {
      number: "03",
      title: "Hard-coded Safety Gate",
      icon: ShieldCheck,
      textColor: "text-emerald-400",
      bgColor: "bg-emerald-500/10 border-emerald-500/30",
      description: "Automated safety algorithms flag high-voltage, gas leak, fuel line, or structural plumbing risks before suggesting fixes."
    },
    {
      number: "04",
      title: "Interactive Guide or Pro Connect",
      icon: Wrench,
      textColor: "text-sky-400",
      bgColor: "bg-sky-500/10 border-sky-500/30",
      description: "Get step-by-step DIY instructions with tool lists and voice audio guidance, or instant official brand hotline support."
    }
  ];

  return (
    <>
      {triggerAsButton && !onClose && (
        <button
          type="button"
          onClick={() => setInternalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-xs font-semibold text-slate-200 shadow-md transition-all hover:scale-105"
          aria-label="Learn how FixVision AI works"
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>How It Works</span>
        </button>
      )}

      {openState && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="how-it-works-title"
        >
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl relative">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-gradient-to-br from-rose-500 to-amber-500 rounded-xl text-white shadow-lg">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 id="how-it-works-title" className="text-xl md:text-2xl font-extrabold text-white">
                    How FixVision AI Works
                  </h2>
                  <p className="text-xs text-slate-400">
                    4-step AI diagnostic & safety verification pipeline
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {steps.map((step) => {
                const IconComponent = step.icon;
                return (
                  <div
                    key={step.number}
                    className={`p-4 rounded-2xl border ${step.bgColor} space-y-2.5 transition-all hover:scale-[1.01]`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-xl bg-slate-950/80 border border-slate-800 ${step.textColor}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-extrabold text-slate-500">STEP {step.number}</span>
                    </div>

                    <h3 className="font-bold text-white text-base leading-snug">{step.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{step.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Safety Commitment Banner */}
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 flex items-start gap-3 text-xs text-emerald-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-emerald-300">Built-in Safety Guarantee: </strong>
                <span>
                  FixVision AI never provides DIY repair steps for gas leaks, live mains electrical panels, or dangerous vehicle systems. If high risk is detected, you receive instant professional support contacts.
                </span>
              </div>
            </div>

            {/* Action */}
            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-extrabold text-xs md:text-sm shadow-xl shadow-rose-950/80 transition-all"
              >
                Got It! Start Diagnostic Scan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
