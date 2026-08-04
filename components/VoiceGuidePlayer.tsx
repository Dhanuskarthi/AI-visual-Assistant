"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Pause, Play, Globe, Gauge } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Language } from "@/lib/translations";

interface VoiceGuidePlayerProps {
  repairSteps: string[];
  applianceType: string;
}

export default function VoiceGuidePlayer({ repairSteps, applianceType }: VoiceGuidePlayerProps) {
  const { language: globalLang, t } = useLanguage();
  const [voiceLang, setVoiceLang] = useState<Language>(globalLang);
  const [voiceRate, setVoiceRate] = useState<number>(0.92);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSupported, setIsSupported] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Sync voiceLang with global language changes if user hasn't explicitly overridden it while playing
  useEffect(() => {
    if (!isPlaying) {
      setVoiceLang(globalLang);
    }
  }, [globalLang, isPlaying]);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true);

      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;

      return () => {
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      };
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

  const speakNextStep = (index: number, activeLang: Language, activeRate: number) => {
    if (index >= repairSteps.length) {
      stopSpeech();
      return;
    }

    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel(); // Cancel ongoing utterance before speaking next step
    setCurrentStepIndex(index);

    const prefix = activeLang === "ta" ? `படி ${index + 1}: ` : `Step ${index + 1}: `;
    const textToSpeak = `${prefix}${repairSteps[index]}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    utterance.rate = activeRate;
    utterance.pitch = 1.0;

    // Multilingual Read Aloud voice configuration
    if (activeLang === "ta") {
      utterance.lang = "ta-IN";
      const taVoice = availableVoices.find(
        (v) => v.lang.toLowerCase().startsWith("ta") || v.lang.toLowerCase().includes("ta")
      );
      if (taVoice) {
        utterance.voice = taVoice;
      }
    } else {
      utterance.lang = "en-US";
      const enVoice = availableVoices.find(
        (v) => v.lang.toLowerCase().startsWith("en-us") || v.lang.toLowerCase().startsWith("en")
      );
      if (enVoice) {
        utterance.voice = enVoice;
      }
    }

    utterance.onend = () => {
      if (index + 1 < repairSteps.length) {
        speakNextStep(index + 1, activeLang, activeRate);
      } else {
        stopSpeech();
      }
    };

    utterance.onerror = (e) => {
      // Ignore canceled errors triggered by manual stop/restart
      if (e.error !== "canceled") {
        stopSpeech();
      }
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
      setIsPlaying(true);
      setIsPaused(false);
      speakNextStep(0, voiceLang, voiceRate);
    }
  };

  const handleLanguageSwitch = (newLang: Language) => {
    setVoiceLang(newLang);
    if (isPlaying) {
      setIsPaused(false);
      speakNextStep(currentStepIndex, newLang, voiceRate);
    }
  };

  const handleRateChange = (newRate: number) => {
    setVoiceRate(newRate);
    if (isPlaying && !isPaused) {
      speakNextStep(currentStepIndex, voiceLang, newRate);
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
                {voiceLang === "ta" ? "தமிழ் (Tamil)" : "English (US)"}
              </span>
              {isPlaying && (
                <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-extrabold uppercase">
                  {isPaused ? "Paused" : `Step ${currentStepIndex + 1}/${repairSteps.length}`}
                </span>
              )}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              {voiceLang === "ta"
                ? `உங்கள் ${applianceType} பழுதுபார்ப்பதற்கான நேரலை குரல் வழிகாட்டி.`
                : `Hands-free audio instructions for repairing your ${applianceType}.`}
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
                <Volume2 className="w-3.5 h-3.5" /> {voiceLang === "ta" ? "வாசித்துக்காட்டு" : "Read Aloud"}
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

      {/* Voice Controls Bar: Language Selector & Speed Controls */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Voice Language Selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 flex items-center gap-1 text-[11px] font-medium">
            <Globe className="w-3.5 h-3.5 text-amber-400" /> {t("voice_lang_label")}:
          </span>
          <div className="flex items-center bg-slate-950/80 p-0.5 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => handleLanguageSwitch("en")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                voiceLang === "en"
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              🇬🇧 English
            </button>
            <button
              type="button"
              onClick={() => handleLanguageSwitch("ta")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                voiceLang === "ta"
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              🇮🇳 தமிழ்
            </button>
          </div>
        </div>

        {/* Speed / Pacing Controls */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 flex items-center gap-1 text-[11px] font-medium">
            <Gauge className="w-3.5 h-3.5 text-amber-400" /> {t("voice_speed")}:
          </span>
          <div className="flex items-center bg-slate-950/80 p-0.5 rounded-lg border border-slate-800">
            {[
              { label: "0.85x", val: 0.85 },
              { label: "1.0x", val: 0.92 },
              { label: "1.15x", val: 1.15 }
            ].map((rateOption) => (
              <button
                key={rateOption.label}
                type="button"
                onClick={() => handleRateChange(rateOption.val)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                  Math.abs(voiceRate - rateOption.val) < 0.05
                    ? "bg-slate-700 text-amber-300 border border-amber-500/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {rateOption.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
