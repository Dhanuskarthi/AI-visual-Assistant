import { Language } from "./translations";

// Helper to check if string contains Tamil Unicode script
export function isTamilText(text: string): boolean {
  return /[\u0B80-\u0BFF]/.test(text);
}

// Fluent Tamil translations for common repair sentences and instructions
const FULL_SENTENCE_MAP: Record<string, string> = {
  "unplug the appliance before inspecting.": "பரிசோதிப்பதற்கு முன் சாதனத்தின் மின் இணைப்பைத் துண்டிக்கவும்.",
  "turn off the main power supply or circuit breaker.": "முக்கிய மின்சார சுவிட்ச் அல்லது சர்க்யூட் பிரேக்கரை அணைக்கவும்.",
  "inspect for visible physical damage or loose wires.": "தெளிவான சேதம் அல்லது தளர்வான கம்பிகள் உள்ளதா என சரிபார்க்கவும்.",
  "clean the lint filter or air screen thoroughly.": "ஃபில்டர் அல்லது ஏர் ஸ்கிரீனை முழுமையாக சுத்தம் செய்யவும்.",
  "check battery terminals for corrosion or rust.": "பேட்டரி முனையங்களில் துரு உள்ளதா என பரிசோதிக்கவும்.",
  "tighten loose screws using a screwdriver.": "திருப்புளியைப் பயன்படுத்தி தளர்வான திருகுகளை இறுக்கவும்.",
  "replace worn out component with a new part.": "பழைய பாகத்தை மாற்றி புதிய பாகத்தைப் பொருத்தவும்.",
  "reconnect the power and test device operation.": "மின்சாரத்தை மீண்டும் இணைத்து சாதனத்தை பரிசோதிக்கவும்.",
  "consult a certified professional technician immediately.": "உடனடியாக சான்றளிக்கப்பட்ட பழுதுபார்க்கும் நிபுணரைத் தொடர்பு கொள்ளவும்.",
  "ensure appliance is completely cool before touching.": "தொடுவதற்கு முன் சாதனம் குளிர்ந்துள்ளதா என்பதை உறுதிப்படுத்தவும்.",
  "wear protective gloves and safety glasses.": "பாதுகாப்பு கையுறைகள் மற்றும் கண்ணாடிகளை அணியவும்.",
  "clean the charging port carefully using a soft dry brush.": "மென்மையான உலர் தூரிகையைப் பயன்படுத்தி சார்ஜிங் போர்ட்டை கவனமாக சுத்தம் செய்யவும்."
};

const WORD_MAP: Record<string, string> = {
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
  "brush": "தூரிகை",
  "cloth": "துணி",
  "flashlight": "விளக்கு",
  "wrench": "ரெஞ்ச்",
  "pliers": "பிளேயர்ஸ்"
};

export function translateStepToTamil(step: string): string {
  if (!step) return "";
  if (isTamilText(step)) return step;

  const normalized = step.trim().toLowerCase();

  // 1. Direct full sentence match
  if (FULL_SENTENCE_MAP[normalized]) {
    return FULL_SENTENCE_MAP[normalized];
  }

  // 2. High-precision pattern translations
  let translated = step;

  translated = translated
    .replace(/Turn off the main power supply|Turn off power supply|Turn off power/gi, "முக்கிய மின்சாரத்தை அணைக்கவும்")
    .replace(/Unplug the appliance|Unplug device|Unplug/gi, "சாதனத்தின் பிளக்கை அகற்றவும்")
    .replace(/Inspect for physical damage|Inspect for damage|Check for damage/gi, "சேதம் உள்ளதா என பரிசோதிக்கவும்")
    .replace(/Clean the lint filter|Clean air filter|Clean filter/gi, "ஃபில்டரை சுத்தம் செய்யவும்")
    .replace(/Replace with new component|Replace worn component|Replace component/gi, "புதிய பாகத்தைக் கொண்டு மாற்றவும்")
    .replace(/Check battery terminals|Check battery connection/gi, "பேட்டரி இணைப்புகளை சரிபார்க்கவும்")
    .replace(/Reset the circuit breaker|Reset breaker/gi, "சர்க்யூட் பிரேக்கரை ரீசெட் செய்யவும்")
    .replace(/Wear protective gloves|Use safety gloves/gi, "பாதுகாப்பு கையுறைகளைப் பயன்படுத்தவும்")
    .replace(/Step (\d+):/gi, "படி $1:");

  // 3. If exact substitutions matched, return translated
  if (translated !== step) {
    return translated;
  }

  // 4. Word-by-word fallback matching for technical terms
  for (const [en, ta] of Object.entries(WORD_MAP)) {
    if (normalized === en) return ta;
  }

  return step;
}

export function getLocalizedText(text: string, language: Language): string {
  if (!text) return "";
  if (language === "ta") {
    return translateStepToTamil(text);
  }
  return text;
}
