"use client";

import { useState, useEffect } from "react";
import { ExternalLink, Phone, MapPin, Globe, Shield, Wrench, Navigation, CheckCircle2, Building, Car, Smartphone, Laptop } from "lucide-react";

interface BrandServiceDirectoryProps {
  brandName: string;
  modelNumber: string;
  applianceType: string;
  ticketId?: string;
}

interface BrandInfo {
  name: string;
  officialServiceUrl: string;
  supportPhone: string;
  category?: "home" | "mobile" | "auto" | "electronics";
}

// Comprehensive All-Device Indian Market Brand Directory
const INDIAN_BRAND_DIRECTORY: Record<string, BrandInfo> = {
  // Mobile & Laptops & Computing
  apple: {
    name: "Apple India (iPhone/Mac/iPad)",
    officialServiceUrl: "https://support.apple.com/en-in",
    supportPhone: "000800 100 9009 (Toll-Free)",
    category: "mobile"
  },
  xiaomi: {
    name: "Xiaomi / Redmi India",
    officialServiceUrl: "https://www.mi.com/in/service/repair/",
    supportPhone: "1800 103 6286",
    category: "mobile"
  },
  redmi: {
    name: "Redmi / Mi India",
    officialServiceUrl: "https://www.mi.com/in/service/repair/",
    supportPhone: "1800 103 6286",
    category: "mobile"
  },
  oneplus: {
    name: "OnePlus India",
    officialServiceUrl: "https://www.oneplus.in/support",
    supportPhone: "1800 102 8411",
    category: "mobile"
  },
  realme: {
    name: "Realme India",
    officialServiceUrl: "https://www.realme.com/in/support",
    supportPhone: "1800 102 2777",
    category: "mobile"
  },
  vivo: {
    name: "Vivo India",
    officialServiceUrl: "https://www.vivo.com/in/support/service-center",
    supportPhone: "1800 208 3388 / 1800 102 3388",
    category: "mobile"
  },
  oppo: {
    name: "Oppo India",
    officialServiceUrl: "https://support.oppo.com/in/",
    supportPhone: "1800 103 2777",
    category: "mobile"
  },
  lenovo: {
    name: "Lenovo India (Laptops/Tabs)",
    officialServiceUrl: "https://support.lenovo.com/in/en/",
    supportPhone: "1800 419 7555",
    category: "mobile"
  },
  hp: {
    name: "HP India (Laptops/Desktops)",
    officialServiceUrl: "https://support.hp.com/in-en",
    supportPhone: "1800 258 7170",
    category: "mobile"
  },
  dell: {
    name: "Dell India (Laptops/Alienware)",
    officialServiceUrl: "https://www.dell.com/support/home/en-in",
    supportPhone: "1800 425 4026 / 1800 425 8045",
    category: "mobile"
  },
  asus: {
    name: "Asus India (ROG/Laptops)",
    officialServiceUrl: "https://www.asus.com/in/support/",
    supportPhone: "1800 209 0365",
    category: "mobile"
  },
  acer: {
    name: "Acer India",
    officialServiceUrl: "https://www.acer.com/in-en/support",
    supportPhone: "1800 11 6677",
    category: "mobile"
  },

  // Automotive: Bikes, Cars & EVs
  "maruti suzuki": {
    name: "Maruti Suzuki Arena / NEXA",
    officialServiceUrl: "https://www.marutisuzuki.com/service",
    supportPhone: "1800 102 1800 (Maruti Care)",
    category: "auto"
  },
  maruti: {
    name: "Maruti Suzuki Service",
    officialServiceUrl: "https://www.marutisuzuki.com/service",
    supportPhone: "1800 102 1800",
    category: "auto"
  },
  hyundai: {
    name: "Hyundai Motor India",
    officialServiceUrl: "https://www.hyundai.com/in/en/connect-to-service",
    supportPhone: "1800 11 4645 (Roadside Assistance)",
    category: "auto"
  },
  tata: {
    name: "Tata Motors (Cars & EVs)",
    officialServiceUrl: "https://cars.tatamotors.com/service.html",
    supportPhone: "1800 209 8282 (Tata Motors Care)",
    category: "auto"
  },
  mahindra: {
    name: "Mahindra & Mahindra Auto",
    officialServiceUrl: "https://www.mahindrasyouv.com/service",
    supportPhone: "1800 209 6006 (WithYouHamesha)",
    category: "auto"
  },
  hero: {
    name: "Hero MotoCorp (Bikes)",
    officialServiceUrl: "https://www.heromotocorp.com/en-in/reach-us/service-booking.html",
    supportPhone: "1800 266 0018",
    category: "auto"
  },
  tvs: {
    name: "TVS Motor Company",
    officialServiceUrl: "https://www.tvsmotor.com/service-and-maintenance",
    supportPhone: "1800 258 7111",
    category: "auto"
  },
  bajaj: {
    name: "Bajaj Auto / Electricals",
    officialServiceUrl: "https://www.bajajauto.com/service/service-center",
    supportPhone: "1800 233 2453 / 1800 102 5963",
    category: "auto"
  },
  honda: {
    name: "Honda 2-Wheelers & Cars",
    officialServiceUrl: "https://www.honda2wheelersindia.com/customer-service",
    supportPhone: "1800 103 3434 / 1800 113 121",
    category: "auto"
  },
  "royal enfield": {
    name: "Royal Enfield Motorcycles",
    officialServiceUrl: "https://www.royalenfield.com/in/en/support/",
    supportPhone: "1800 210 0007 (RE Care)",
    category: "auto"
  },
  yamaha: {
    name: "Yamaha Motor India",
    officialServiceUrl: "https://www.yamaha-motor-india.com/yamaha-service.html",
    supportPhone: "1800 420 1600",
    category: "auto"
  },

  // Home & Kitchen Appliances
  samsung: {
    name: "Samsung India (Home & Mobile)",
    officialServiceUrl: "https://www.samsung.com/in/support/service-center/",
    supportPhone: "1800 40 7267864 (1800 40 SAMSUNG)",
    category: "home"
  },
  lg: {
    name: "LG Electronics India",
    officialServiceUrl: "https://www.lg.com/in/support/locate-service-center",
    supportPhone: "1800 315 9999 / 1800 180 9999",
    category: "home"
  },
  whirlpool: {
    name: "Whirlpool India",
    officialServiceUrl: "https://www.whirlpoolindia.com/service-support",
    supportPhone: "1800 208 1800",
    category: "home"
  },
  ifb: {
    name: "IFB Home Appliances India",
    officialServiceUrl: "https://www.ifbappliances.com/service",
    supportPhone: "1800 3000 5678 / 09223010101",
    category: "home"
  },
  godrej: {
    name: "Godrej Appliances India",
    officialServiceUrl: "https://www.godrej.com/godrej-appliances/service",
    supportPhone: "1800 209 5511",
    category: "home"
  },
  haier: {
    name: "Haier India",
    officialServiceUrl: "https://www.haier.com/in/service-support/",
    supportPhone: "1800 102 9999 / 1800 419 9999",
    category: "home"
  },
  voltas: {
    name: "Voltas TATA India",
    officialServiceUrl: "https://www.voltas.com/pages/service",
    supportPhone: "1860 233 4555 / 9650694555",
    category: "home"
  },
  "blue star": {
    name: "Blue Star India",
    officialServiceUrl: "https://www.bluestarindia.com/customer-service",
    supportPhone: "1800 209 1177",
    category: "home"
  },
  bosch: {
    name: "Bosch India (Home & Auto)",
    officialServiceUrl: "https://www.bosch-home.in/service",
    supportPhone: "1800 266 1880",
    category: "home"
  },
  sony: {
    name: "Sony India (TV/Audio/PlayStation)",
    officialServiceUrl: "https://www.sony.co.in/electronics/support",
    supportPhone: "1800 103 7799",
    category: "electronics"
  }
};

export default function BrandServiceDirectory({
  brandName,
  modelNumber,
  applianceType,
  ticketId
}: BrandServiceDirectoryProps) {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState<string>("");
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [manualCity, setManualCity] = useState<string>("");

  const normalizedBrand = brandName.trim().toLowerCase();
  
  // Find matching Indian brand or fallback
  const matchedKey = Object.keys(INDIAN_BRAND_DIRECTORY).find(k => normalizedBrand.includes(k)) || "";
  const brandInfo: BrandInfo = matchedKey
    ? INDIAN_BRAND_DIRECTORY[matchedKey]
    : {
        name: brandName ? `${brandName} Service Care` : "Authorized Brand Service Center",
        officialServiceUrl: `https://www.google.co.in/search?q=${encodeURIComponent((brandName || applianceType) + " official service support India")}`,
        supportPhone: "1800 102 9999 (National Toll-Free Service)",
      };

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationName(`GPS: ${position.coords.latitude.toFixed(3)}, ${position.coords.longitude.toFixed(3)}`);
          setIsLocating(false);
        },
        (err) => {
          console.warn("Geolocation permission denied/unavailable:", err);
          setIsLocating(false);
        }
      );
    }
  };

  useEffect(() => {
    handleGetLocation();
  }, []);

  const cleanLocationInput = manualCity.trim().slice(0, 30);
  const searchQuery = encodeURIComponent(
    `${brandName || ""} ${applianceType || ""} repair service`
  );

  const googleMapsUrl = coords
    ? `https://www.google.co.in/maps/search/${searchQuery}/@${coords.lat},${coords.lng},13z`
    : `https://www.google.co.in/maps/search/${searchQuery}+near+${encodeURIComponent(cleanLocationInput || "India")}`;

  const urbanCompanyUrl = `https://www.urbancompany.com`;
  const justDialUrl = cleanLocationInput
    ? `https://www.justdial.com/${encodeURIComponent(cleanLocationInput)}/${encodeURIComponent((brandName || applianceType) + " Repair Services")}`
    : `https://www.justdial.com/India/Appliance-Repair-Services`;
  const sulekhaUrl = `https://www.sulekha.com/${encodeURIComponent((brandName || applianceType).toLowerCase().replace(/\s+/g, "-"))}-repair-services`;

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-6 shadow-2xl animate-fade-in">
      {/* Confirmation Header */}
      {ticketId && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-600/50 rounded-xl text-center space-y-1">
          <div className="flex items-center justify-center gap-2 text-emerald-400 font-extrabold text-base md:text-lg">
            <CheckCircle2 className="w-5 h-5" />
            <span>Service Ticket Registered (#{ticketId})</span>
          </div>
          <p className="text-xs text-slate-300">
            Details for <strong className="text-white">{brandInfo.name}</strong> (Model: <span className="font-mono text-emerald-300 font-bold">{modelNumber || "N/A"}</span>) recorded.
          </p>
        </div>
      )}

      {/* 1. OFFICIAL BRAND SERVICE & HOTLINE (INDIAN TOLL-FREE & CENTRES) */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 md:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Shield className="w-4 h-4" /> Official Brand Service Hub (India)
          </span>
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            Authorized Care
          </span>
        </div>

        <h3 className="text-lg font-extrabold text-white">
          {brandInfo.name} Authorized Support & Repair
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <a
            href={brandInfo.officialServiceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between text-xs font-semibold text-sky-300 transition-colors group"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-400" />
              <span>Official India Service Booking</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>

          <a
            href={`tel:${brandInfo.supportPhone.replace(/[^0-9+]/g, "")}`}
            className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between text-xs font-semibold text-emerald-300 transition-colors group"
          >
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>India Toll-Free: {brandInfo.supportPhone}</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* 2. LOCATION-BASED NEARBY LICENSED SERVICES (INDIA SERVICING PLATFORMS) */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 md:p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
            <MapPin className="w-4 h-4" /> Nearby Licensed Repair Centers (India)
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={isLocating}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold rounded-lg border border-slate-700 flex items-center gap-1 transition-colors"
            >
              <Navigation className={`w-3 h-3 text-sky-400 ${isLocating ? "animate-spin" : ""}`} />
              <span>{isLocating ? "Locating..." : "Detect My Location"}</span>
            </button>
          </div>
        </div>

        {locationName && (
          <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Detected Location: {locationName}
          </p>
        )}

        {/* Manual City/Pincode Input with Validation */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="text"
            maxLength={30}
            value={manualCity}
            onChange={(e) => setManualCity(e.target.value.slice(0, 30))}
            placeholder="Enter City or Pincode (e.g. Chennai, Mumbai, Bengaluru, Delhi, 600001)"
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500 placeholder:text-slate-500"
          />
        </div>

        {/* Nearby Directory Action Buttons tailored for India */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 pt-1">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-gradient-to-r from-sky-950 to-slate-900 hover:from-sky-900 border border-sky-800/60 rounded-xl text-center text-xs font-bold text-sky-200 flex items-center justify-center gap-1.5 transition-all hover:scale-[1.01]"
          >
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            <span>Google Maps (India)</span>
          </a>

          <a
            href={urbanCompanyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-gradient-to-r from-purple-950 to-slate-900 hover:from-purple-900 border border-purple-800/60 rounded-xl text-center text-xs font-bold text-purple-200 flex items-center justify-center gap-1.5 transition-all hover:scale-[1.01]"
          >
            <Wrench className="w-3.5 h-3.5 text-purple-400" />
            <span>Urban Company</span>
          </a>

          <a
            href={justDialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-gradient-to-r from-amber-950 to-slate-900 hover:from-amber-900 border border-amber-800/60 rounded-xl text-center text-xs font-bold text-amber-200 flex items-center justify-center gap-1.5 transition-all hover:scale-[1.01]"
          >
            <Building className="w-3.5 h-3.5 text-amber-400" />
            <span>Justdial India</span>
          </a>

          <a
            href={sulekhaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-gradient-to-r from-emerald-950 to-slate-900 hover:from-emerald-900 border border-emerald-800/60 rounded-xl text-center text-xs font-bold text-emerald-200 flex items-center justify-center gap-1.5 transition-all hover:scale-[1.01]"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sulekha Services</span>
          </a>
        </div>
      </div>
    </div>
  );
}
