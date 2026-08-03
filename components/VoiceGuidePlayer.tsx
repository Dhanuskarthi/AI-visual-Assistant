"use client";

import { useState, useEffect } from "react";
import { Volume2, VolumeX, Pause, Play } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface VoiceGuidePlayerProps {
  repairSteps: string[];
  applianceType: string;
}

export default function VoiceGuidePlayer({ repairSteps, applianceType }: VoiceGuidePlayerProps) {
  const { language, t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true);
    }
  }, []);

  const stopSpeech = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentStepIndex(0);
  };

  const speakNextStep = (index: number) => {
    if (index >= repairSteps.length) {
      stopSpeech();
      return;
    }

    setCurrentStepIndex(index);
    const prefix = language === "ta" ? `படி ${index + 1}: ` : `Step ${index + 1}: `;
    const textToSpeak = `${prefix}${repairSteps[index]}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    utterance.rate = 0.92; // Clear pacing for speech synthesis
    utterance.pitch = 1.0;

    // Multilingual Read Aloud voice configuration
    if (language === "ta") {
      utterance.lang = "ta-IN";
      const voices = window.speechSynthesis.getVoices();
      const taVoice = voices.find((v) => v.lang.startsWith("ta") || v.lang.includes("ta"));
      if (taVoice) {
        utterance.voice = taVoice;
      }
    } else {
      utterance.lang = "en-US";
    }

    utterance.onend = () => {
      if (index + 1 < repairSteps.length) {
        speakNextStep(index + 1);
      } else {
        stopSpeech();
      }
    };

    utterance.onerror = () => {
      stopSpeech();
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleTogglePlay = () => {
    if (!isSupported) return;

    if (isPlaying) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    } else {
      window.speechSynthesis.cancel();
      setIsPlaying(true);
      setIsPaused(false);
      speakNextStep(0);
    }
  };

  if (!isSupported || !repairSteps || repairSteps.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/60 border border-amber-500/40 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/40 shrink-0">
          <Volume2 className={`w-5 h-5 ${isPlaying && !isPaused ? "animate-pulse" : ""}`} />
        </div>
        <div>
          <h4 className="font-bold text-white text-xs md:text-sm flex items-center gap-2">
            <span>{t("voice_guide_title")} ({language === "ta" ? "தமிழ்" : "English"})</span>
            {isPlaying && (
              <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-extrabold uppercase">
                {isPaused ? "Paused" : `Step ${currentStepIndex + 1}/${repairSteps.length}`}
              </span>
            )}
          </h4>
          <p className="text-xs text-slate-300">
            {language === "ta"
              ? `உங்கள் ${applianceType} பழுதுபார்ப்பதற்கான நேரலை குரல் வழிகாட்டி.`
              : `Hands-free audio instructions for repairing your ${applianceType}.`}
          </p>
        </div>
      </div>

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
              <Volume2 className="w-3.5 h-3.5" /> {language === "ta" ? "வாசித்துக்காட்டு" : "Read Aloud"}
            </>
          )}
        </button>

        {isPlaying && (
          <button
            type="button"
            onClick={stopSpeech}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium min-h-[44px] min-w-[44px] flex items-center justify-center focus:ring-2 focus:ring-rose-500 focus:outline-none"
            title="Stop Voice Guide"
          >
            <VolumeX className="w-4 h-4 text-rose-400" />
          </button>
        )}
      </div>
    </div>
  );
}
