import { Language } from "./translations";

export interface SpeakOptions {
  text: string;
  lang?: Language;
  rate?: number;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

let keepAliveInterval: ReturnType<typeof setInterval> | null = null;

// Clean markdown, symbols, and formatting for clear TTS speech output
export function cleanTextForSpeech(rawText: string): string {
  if (!rawText) return "";
  return rawText
    .replace(/\*\*(.*?)\*\*/g, "$1") // bold markdown
    .replace(/\*(.*?)\*/g, "$1")     // italic markdown
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // links
    .replace(/`([^`]+)`/g, "$1")     // code snippets
    .replace(/^[#\-*•]\s+/gm, "")     // bullet points / headers
    .replace(/[\n\r]+/g, ". ")        // line breaks to natural sentence pauses
    .replace(/\s+/g, " ")             // collapse extra spaces
    .trim();
}

// Select highest quality natural English voice available in browser
export function findBestEnglishVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  const preferredVoiceNames = [
    "Google US English",
    "Google UK English Female",
    "Google UK English Male",
    "Microsoft Jenny Online (Natural)",
    "Microsoft Guy Online (Natural)",
    "Microsoft Aria Online (Natural)",
    "Microsoft Zira",
    "Microsoft David",
    "Samantha",
    "Alex",
    "Karen",
    "Daniel",
    "Victoria"
  ];

  for (const preferred of preferredVoiceNames) {
    const matched = voices.find((v) => v.name.toLowerCase().includes(preferred.toLowerCase()));
    if (matched) return matched;
  }

  // Fallback to any en-US, en-GB or en voice
  return (
    voices.find((v) => v.lang.toLowerCase() === "en-us" || v.lang.toLowerCase() === "en_us") ||
    voices.find((v) => v.lang.toLowerCase() === "en-gb" || v.lang.toLowerCase() === "en_gb") ||
    voices.find((v) => v.lang.toLowerCase().startsWith("en")) ||
    null
  );
}

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

export function playSpeech({ text, lang = "en", rate = 0.90, onEnd, onError }: SpeakOptions): SpeechSynthesisUtterance | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    if (onError) onError("Speech synthesis is not supported on this browser.");
    return null;
  }

  // Stop previous speech state & timer
  stopAllSpeech();

  const cleanedText = cleanTextForSpeech(text);
  const utterance = new SpeechSynthesisUtterance(cleanedText);
  const voices = window.speechSynthesis.getVoices();

  if (lang === "ta") {
    utterance.lang = "ta-IN";
    utterance.rate = 0.88; // Clear Tamil pacing
    utterance.pitch = 1.0;

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
    utterance.rate = rate; // Clear English pacing (0.90)
    utterance.pitch = 1.0;

    const bestEnglishVoice = findBestEnglishVoice(voices);
    if (bestEnglishVoice) {
      utterance.voice = bestEnglishVoice;
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

  try {
    window.speechSynthesis.resume();
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error("Failed to execute speechSynthesis.speak:", err);
    if (onError) onError(err);
  }

  return utterance;
}
