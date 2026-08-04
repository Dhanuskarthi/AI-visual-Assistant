import { Language } from "./translations";

export interface SpeakOptions {
  text: string;
  lang: Language;
  rate?: number;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

let keepAliveInterval: ReturnType<typeof setInterval> | null = null;

export function stopAllSpeech() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    if (keepAliveInterval) {
      clearInterval(keepAliveInterval);
      keepAliveInterval = null;
    }
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}

export function playSpeech({ text, lang, rate = 0.95, onEnd, onError }: SpeakOptions): SpeechSynthesisUtterance | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    if (onError) onError("Speech synthesis is not supported on this browser.");
    return null;
  }

  // Clear previous speech state & keep-alive timer
  stopAllSpeech();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = 1.0;

  // Retrieve browser voices directly
  const voices = window.speechSynthesis.getVoices();

  if (lang === "ta") {
    utterance.lang = "ta-IN";
    const taVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().startsWith("ta") ||
        v.lang.toLowerCase().includes("ta") ||
        v.name.toLowerCase().includes("tamil")
    );
    if (taVoice) {
      utterance.voice = taVoice;
    }
  } else {
    utterance.lang = "en-US";
    const enVoice = voices.find(
      (v) => v.lang.toLowerCase().startsWith("en-us") || v.lang.toLowerCase().startsWith("en")
    );
    if (enVoice) {
      utterance.voice = enVoice;
    }
  }

  utterance.onend = () => {
    if (keepAliveInterval) {
      clearInterval(keepAliveInterval);
      keepAliveInterval = null;
    }
    if (onEnd) onEnd();
  };

  utterance.onerror = (e: any) => {
    if (keepAliveInterval) {
      clearInterval(keepAliveInterval);
      keepAliveInterval = null;
    }
    // Ignore canceled/interrupted events triggered when user stops or switches step
    const errType = String(e?.error || "").toLowerCase();
    if (errType.includes("cancel") || errType.includes("interrupt")) {
      return;
    }
    console.warn("SpeechSynthesis error:", e);
    if (onError) onError(e);
  };

  // Chrome 15s keep-alive fix
  keepAliveInterval = setInterval(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }
  }, 10000);

  // Resume synthesis queue and trigger speech
  try {
    window.speechSynthesis.resume();
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error("Failed to execute speechSynthesis.speak:", err);
    if (onError) onError(err);
  }

  return utterance;
}
