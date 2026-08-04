"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Pause, Sparkles } from "lucide-react";

interface StoryFrame {
  id: number;
  title: string;
  subtitle: string;
  imageSrc: string;
}

const FRAMES: StoryFrame[] = [
  {
    id: 1,
    title: "Frame 1 – Welcome",
    subtitle: "Modern glassmorphism smartphone interface ready for AI visual diagnosis.",
    imageSrc: "/demo/frame_1.png"
  },
  {
    id: 2,
    title: "Frame 2 – Camera Open",
    subtitle: "Smartphone live camera pointing directly at a damaged electrical wall outlet.",
    imageSrc: "/demo/frame_2.png"
  },
  {
    id: 3,
    title: "Frame 3 – Capture Image",
    subtitle: "High-resolution photo capture with camera shutter flash and instant focus targeting.",
    imageSrc: "/demo/frame_3.png"
  },
  {
    id: 4,
    title: "Frame 4 – Upload",
    subtitle: "Captured image uploading securely to the AI cloud with real-time data streaming.",
    imageSrc: "/demo/frame_4.png"
  },
  {
    id: 5,
    title: "Frame 5 – AI Analysis",
    subtitle: "Multimodal vision AI scanning visual symptoms with laser precision and holographic bounding boxes.",
    imageSrc: "/demo/frame_5.png"
  },
  {
    id: 6,
    title: "Frame 6 – Problem Detected",
    subtitle: "Identified faults pinpointed and labeled: 'Loose Wire', 'Burn Mark', and 'Broken Switch'.",
    imageSrc: "/demo/frame_6.png"
  },
  {
    id: 7,
    title: "Frame 7 – Repair Steps",
    subtitle: "Glassmorphism UI displaying step-by-step DIY repair guides and required tools checklist.",
    imageSrc: "/demo/frame_7.png"
  },
  {
    id: 8,
    title: "Frame 8 – Repair Complete",
    subtitle: "Electrical outlet successfully repaired with verified green safety status checkmark.",
    imageSrc: "/demo/frame_8.png"
  },
  {
    id: 9,
    title: "Frame 9 – Call to Action",
    subtitle: "FixVision AI Visual Assistant ready for your next device, appliance, or vehicle scan.",
    imageSrc: "/demo/frame_9.png"
  },
  {
    id: 10,
    title: "Frame 10 – End / Loop",
    subtitle: "Seamless 24/7 AI visual troubleshooting companion active.",
    imageSrc: "/demo/frame_10.png"
  }
];

export default function VisualStoryCarousel() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAutoplay, setIsAutoplay] = useState<boolean>(true);

  useEffect(() => {
    if (!isAutoplay) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % FRAMES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoplay]);

  const nextFrame = () => {
    setCurrentIndex((prev) => (prev + 1) % FRAMES.length);
  };

  const prevFrame = () => {
    setCurrentIndex((prev) => (prev === 0 ? FRAMES.length - 1 : prev - 1));
  };

  const activeFrame = FRAMES[currentIndex];

  return (
    <div className="relative bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 overflow-hidden">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>10-Frame Visual Diagnosis Flow</span>
          </div>
          <h3 className="text-xl md:text-2xl font-extrabold text-white">
            {activeFrame.title}
          </h3>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsAutoplay(!isAutoplay)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {isAutoplay ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-400" /> Autoplay ON
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-400" /> Autoplay OFF
              </>
            )}
          </button>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={prevFrame}
              aria-label="Previous frame"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-indigo-300 px-2">
              {currentIndex + 1} / {FRAMES.length}
            </span>
            <button
              type="button"
              onClick={nextFrame}
              aria-label="Next frame"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Frame Image Display */}
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group">
        <img
          src={activeFrame.imageSrc}
          alt={activeFrame.title}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
        />

        {/* Caption Overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-4 md:p-6 space-y-1">
          <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
            FRAME {activeFrame.id} OF 10
          </span>
          <p className="text-xs md:text-sm font-medium text-slate-200 leading-relaxed">
            {activeFrame.subtitle}
          </p>
        </div>
      </div>

      {/* Frame Indicator Dots */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap pt-2">
        {FRAMES.map((frame, idx) => (
          <button
            key={frame.id}
            type="button"
            onClick={() => {
              setCurrentIndex(idx);
              setIsAutoplay(false);
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? "w-8 bg-indigo-500 shadow-md shadow-indigo-500/50"
                : "w-2 bg-slate-800 hover:bg-slate-700"
            }`}
            aria-label={`Go to frame ${frame.id}`}
          />
        ))}
      </div>
    </div>
  );
}
