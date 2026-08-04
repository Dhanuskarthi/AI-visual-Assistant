"use client";

import { useState, useEffect } from "react";
import { Volume2, VolumeX, Pause, Play, Gauge } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { playSpeech, stopAllSpeech } from "@/lib/speechHelper";

interface VoiceGuidePlayerProps {
  repairSteps: string[];
  applianceType: string;
}

export default function VoiceGuidePlayer({ repairSteps, applianceType }: VoiceGuidePlayerProps) {
  const { t } = useLanguage();
  const [voiceRate, setVoiceRate] = useState<number>(0.90);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true);
      window.speechSynthesis.getVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      }
    }
    return () => {
      stopAllSpeech();
    };
  }, []);

  const handleStop = () => {
    stopAllSpeech();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentStepIndex(0);
  };

  const speakStep = (index: number, activeRate: number) => {
    if (index >= repairSteps.length) {
      handleStop();
      return;
    }

    setCurrentStepIndex(index);
    const stepText = repairSteps[index];
    const textToSpeak = `Step ${index + 1}: ${stepText}`;

    playSpeech({
      text: textToSpeak,
      rate: activeRate,
      onEnd: () => {
        if (index + 1 < repairSteps.length) {
          speakStep(index + 1, activeRate);
        } else {
          handleStop();
        }
      },
      onError: () => {
        handleStop();
      }
    });
  };

  const handleTogglePlay = () => {
    if (!isSupported) return;

    if (isPlaying) {
      if (isPaused) {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          window.speechSynthesis.resume();
        }
        setIsPaused(false);
      } else {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          window.speechSynthesis.pause();
        }
        setIsPaused(true);
      }
    } else {
      setIsPlaying(true);
      setIsPaused(false);
      speakStep(0, voiceRate);
    }
  };

  const handleRateChange = (newRate: number) => {
    setVoiceRate(newRate);
    if (isPlaying && !isPaused) {
      speakStep(currentStepIndex, newRate);
    }
  };

  if (!isSupported || !repairSteps || repairSteps.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-950/70 border border-amber-500/40 rounded-2xl p-4 md:p-5 flex flex-col gap-4 shadow-xl animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Title & Info */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/40 shrink-0">
            <Volume2 className={`w-5 h-5 ${isPlaying && !isPaused ? "animate-pulse text-amber-300" : ""}`} />
          </div>
          <div>
            <h4 className="font-bold text-white text-xs md:text-sm flex items-center gap-2">
              <span>{t("voice_guide_title")}</span>
              <span className="text-[10px] bg-amber-500/30 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-semibold">
                Clear English Voice
              </span>
              {isPlaying && (
                <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-extrabold uppercase">
                  {isPaused ? "Paused" : `Step ${currentStepIndex + 1}/${repairSteps.length}`}
                </span>
              )}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Clear English audio instructions for repairing your {applianceType}.
            </p>
          </div>
        </div>

        {/* Play/Pause & Stop Buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={handleTogglePlay}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none ${
              isPlaying && !isPaused
                ? "bg-amber-500 text-slate-950 hover:bg-amber-400"
                : "bg-rose-600 hover:bg-rose-500 text-white"
            }`}
          >
            {isPlaying ? (
              isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5" /> Resume Voice
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5" /> Pause Voice
                </>
              )
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" /> Read Aloud (English)
              </>
            )}
          </button>

          {isPlaying && (
            <button
              type="button"
              onClick={handleStop}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium min-h-[44px] min-w-[44px] flex items-center justify-center focus:ring-2 focus:ring-rose-500 focus:outline-none"
              title="Stop Voice Guide"
            >
              <VolumeX className="w-4 h-4 text-rose-400" />
            </button>
          )}
        </div>
      </div>

      {/* Speed / Pacing Controls */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3 text-xs">
        <span className="text-slate-400 flex items-center gap-1 text-[11px] font-medium">
          <Gauge className="w-3.5 h-3.5 text-amber-400" /> {t("voice_speed")}:
        </span>
        <div className="flex items-center bg-slate-950/80 p-0.5 rounded-lg border border-slate-800">
          {[
            { label: "0.85x (Relaxed)", val: 0.85 },
            { label: "0.90x (Clear)", val: 0.90 },
            { label: "1.10x (Fast)", val: 1.10 }
          ].map((rateOption) => (
            <button
              key={rateOption.label}
              type="button"
              onClick={() => handleRateChange(rateOption.val)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                Math.abs(voiceRate - rateOption.val) < 0.03
                  ? "bg-slate-700 text-amber-300 border border-amber-500/30 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {rateOption.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
