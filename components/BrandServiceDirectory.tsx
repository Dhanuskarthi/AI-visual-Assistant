"use client";

import { useState, useEffect } from "react";
import { ExternalLink, Phone, MapPin, Globe, Shield, Wrench, Navigation, CheckCircle2 } from "lucide-react";

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
  partsUrl?: string;
}

const BRAND_DIRECTORY: Record<string, BrandInfo> = {
  samsung: {
    name: "Samsung Electronics",
    officialServiceUrl: "https://www.samsung.com/us/support/service/locations/",
    supportPhone: "1-800-SAMSUNG (1-800-726-7864)",
    partsUrl: "https://www.samsungparts.com",
  },
  lg: {
    name: "LG Electronics",
    officialServiceUrl: "https://www.lg.com/us/support/repair-service/schedule-repair",
    supportPhone: "1-800-243-0000",
    partsUrl: "https://www.lgcanadaparts.com",
  },
  whirlpool: {
    name: "Whirlpool",
    officialServiceUrl: "https://www.whirlpool.com/service-and-support.html",
    supportPhone: "1-866-698-2538",
    partsUrl: "https://www.whirlpoolparts.com",
  },
  ge: {
    name: "GE Appliances",
    officialServiceUrl: "https://www.geappliances.com/ge/service-and-support/service.htm",
    supportPhone: "1-800-432-2737",
    partsUrl: "https://www.geapplianceparts.com",
  },
  bosch: {
    name: "Bosch Home Appliances",
    officialServiceUrl: "https://www.bosch-home.com/us/owner-support/service",
    supportPhone: "1-800-944-2904",
    partsUrl: "https://www.bosch-home.com/us/store",
  },
  maytag: {
    name: "Maytag",
    officialServiceUrl: "https://www.maytag.com/owners.html",
    supportPhone: "1-800-344-1274",
    partsUrl: "https://www.maytag.com/replacement-parts.html",
  },
  kitchenaid: {
    name: "KitchenAid",
    officialServiceUrl: "https://www.kitchenaid.com/service-and-support.html",
    supportPhone: "1-800-422-1230",
    partsUrl: "https://www.kitchenaidparts.com",
  },
  frigidaire: {
    name: "Frigidaire",
    officialServiceUrl: "https://www.frigidaire.com/en/owner-center/service-and-repair",
    supportPhone: "1-800-374-4432",
    partsUrl: "https://www.frigidaireapplianceparts.com",
  },
  rheem: {
    name: "Rheem Heating & Water Heating",
    officialServiceUrl: "https://www.rheem.com/support/contact/",
    supportPhone: "1-866-720-2079",
    partsUrl: "https://www.rheem.com/parts/",
  },
  carrier: {
    name: "Carrier HVAC Systems",
    officialServiceUrl: "https://www.carrier.com/residential/en/us/find-a-dealer/",
    supportPhone: "1-800-CARRIER (1-800-227-7437)",
  },
  trane: {
    name: "Trane Residential HVAC",
    officialServiceUrl: "https://www.trane.com/residential/en/for-owners/find-a-dealer/",
    supportPhone: "1-800-961-9610",
  },
  "square d": {
    name: "Square D / Schneider Electric",
    officialServiceUrl: "https://www.se.com/us/en/work/services/",
    supportPhone: "1-888-778-2733",
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
  
  // Find matching brand or fallback
  const matchedKey = Object.keys(BRAND_DIRECTORY).find(k => normalizedBrand.includes(k)) || "";
  const brandInfo: BrandInfo = matchedKey
    ? BRAND_DIRECTORY[matchedKey]
    : {
        name: brandName || "Appliance Manufacturer",
        officialServiceUrl: `https://www.google.com/search?q=${encodeURIComponent((brandName || applianceType) + " official service support")}`,
        supportPhone: "1-800-555-0199 (Standard Hotline)",
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

  const searchQuery = encodeURIComponent(
    `${brandName || ""} ${applianceType || ""} repair service`
  );

  const googleMapsUrl = coords
    ? `https://www.google.com/maps/search/${searchQuery}/@${coords.lat},${coords.lng},12z`
    : `https://www.google.com/maps/search/${searchQuery}+near+${encodeURIComponent(manualCity || "me")}`;

  const yelpUrl = `https://www.yelp.com/search?find_desc=${searchQuery}&find_loc=${encodeURIComponent(manualCity || "near me")}`;
  const angieUrl = `https://www.homeadvisor.com/search.c.Appliance-Repair.html?q=${searchQuery}`;

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

      {/* 1. OFFICIAL BRAND SERVICE & HOTLINE */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 md:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Shield className="w-4 h-4" /> Official Brand Service Hub
          </span>
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            Authorized Support
          </span>
        </div>

        <h3 className="text-lg font-extrabold text-white">
          {brandInfo.name} Service & Repair
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
              <span>Official Service Booking Website</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>

          <a
            href={`tel:${brandInfo.supportPhone.replace(/[^0-9+]/g, "")}`}
            className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between text-xs font-semibold text-emerald-300 transition-colors group"
          >
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Hotline: {brandInfo.supportPhone}</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* 2. LOCATION-BASED NEARBY LICENSED SERVICES */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 md:p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
            <MapPin className="w-4 h-4" /> Nearby Licensed Repair Centers
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={isLocating}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold rounded-lg border border-slate-700 flex items-center gap-1 transition-colors"
            >
              <Navigation className={`w-3 h-3 text-sky-400 ${isLocating ? "animate-spin" : ""}`} />
              <span>{isLocating ? "Locating..." : "Detect My GPS Location"}</span>
            </button>
          </div>
        </div>

        {locationName && (
          <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Detected Location: {locationName}
          </p>
        )}

        {/* Manual City/Zip Fallback */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={manualCity}
            onChange={(e) => setManualCity(e.target.value)}
            placeholder="Enter City or ZIP code (e.g. Dallas, TX or 90210)"
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
          />
        </div>

        {/* Nearby Directory Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-gradient-to-r from-sky-950 to-slate-900 hover:from-sky-900 border border-sky-800/60 rounded-xl text-center text-xs font-bold text-sky-200 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          >
            <MapPin className="w-4 h-4 text-sky-400" />
            <span>Google Maps Repair Search</span>
          </a>

          <a
            href={yelpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-gradient-to-r from-red-950 to-slate-900 hover:from-red-900 border border-red-800/60 rounded-xl text-center text-xs font-bold text-red-200 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          >
            <Wrench className="w-4 h-4 text-red-400" />
            <span>Yelp Verified Technicians</span>
          </a>

          <a
            href={angieUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-gradient-to-r from-amber-950 to-slate-900 hover:from-amber-900 border border-amber-800/60 rounded-xl text-center text-xs font-bold text-amber-200 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          >
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Angie's List / HomeAdvisor</span>
          </a>
        </div>
      </div>
    </div>
  );
}
