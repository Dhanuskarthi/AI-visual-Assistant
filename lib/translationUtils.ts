import { Language } from "./translations";

// Helper to check if string contains Tamil script
export function isTamilText(text: string): boolean {
  return /[\u0B80-\u0BFF]/.test(text);
}

// Common repair phrase dictionary for instant dynamic translation
const EN_TO_TA_MAP: Record<string, string> = {
  "turn off": "அணைக்கவும்",
  "power off": "மின்சாரத்தை அணைக்கவும்",
  "unplug": "பிளக்கை அகற்றவும்",
  "disconnect": "இணைப்பைத் துண்டிக்கவும்",
  "clean": "சுத்தம் செய்யவும்",
  "inspect": "பரிசோதிக்கவும்",
  "check": "சரிபார்க்கவும்",
  "replace": "மாற்றவும்",
  "remove": "அகற்றவும்",
  "tighten": "இறுக்கவும்",
  "reconnect": "மீண்டும் இணைக்கவும்",
  "wait": "காத்திருக்கவும்",
  "reset": "ரீசெட் செய்யவும்",
  "screwdriver": "திருப்புளி (Screwdriver)",
  "multimeter": "மல்டிமீட்டர் (Multimeter)",
  "gloves": "பாதுகாப்பு கையுறைகள்",
  "safety goggles": "பாதுகாப்பு கண்ணாடிகள்",
  "brush": "தூரிகை (Brush)",
  "cloth": "துணி (Cloth)",
  "flashlight": "விளக்கு (Flashlight)",
  "wrench": "ரெஞ்ச் (Wrench)",
  "pliers": "பிளேயர்ஸ் (Pliers)"
};

export function translateStepToTamil(step: string): string {
  if (!step) return "";
  if (isTamilText(step)) return step;

  let translated = step;

  // Exact match lookups
  const lower = step.trim().toLowerCase();
  for (const [en, ta] of Object.entries(EN_TO_TA_MAP)) {
    if (lower === en) return ta;
  }

  // Common sentence substitutions
  translated = translated
    .replace(/Turn off the main power supply|Turn off power/gi, "முக்கிய மின்சாரத்தை அணைக்கவும்")
    .replace(/Unplug the appliance|Unplug device/gi, "சாதனத்தின் பிளக்கை அகற்றவும்")
    .replace(/Inspect for damage|Check for damage/gi, "சேதம் உள்ளதா என பரிசோதிக்கவும்")
    .replace(/Clean the lint filter|Clean filter/gi, "ஃபில்டரை சுத்தம் செய்யவும்")
    .replace(/Replace with new component|Replace component/gi, "புதிய பாகத்தை கொண்டு மாற்றவும்")
    .replace(/Check battery connection|Check terminals/gi, "பேட்டரி இணைப்புகளை சரிபார்க்கவும்")
    .replace(/Reset the circuit breaker|Reset breaker/gi, "சர்க்யூட் பிரேக்கரை ரீசெட் செய்யவும்")
    .replace(/Use safety gloves/gi, "பாதுகாப்பு கையுறைகளைப் பயன்படுத்தவும்")
    .replace(/Step (\d+):/gi, "படி $1:");

  // Fallback phrase replacements
  if (translated === step) {
    translated = step
      .replace(/\bTurn off\b/gi, "அணைக்கவும்")
      .replace(/\bUnplug\b/gi, "பிளக்கை அகற்றவும்")
      .replace(/\bDisconnect\b/gi, "துண்டிக்கவும்")
      .replace(/\bInspect\b/gi, "பரிசோதிக்கவும்")
      .replace(/\bCheck\b/gi, "சரிபார்க்கவும்")
      .replace(/\bClean\b/gi, "சுத்தம் செய்யவும்")
      .replace(/\bReplace\b/gi, "மாற்றவும்")
      .replace(/\bRemove\b/gi, "அகற்றவும்")
      .replace(/\bTighten\b/gi, "இறுக்கவும்")
      .replace(/\bReconnect\b/gi, "மீண்டும் இணைக்கவும்")
      .replace(/\bWait for\b/gi, "காத்திருக்கவும்:");
  }

  return translated;
}

export function getLocalizedText(text: string, language: Language): string {
  if (!text) return "";
  if (language === "ta") {
    return translateStepToTamil(text);
  }
  return text;
}
