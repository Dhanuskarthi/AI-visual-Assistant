"use client";

import { useState } from "react";
import { ApplianceDiagnosis } from "@/types/diagnosis";
import SafetyBanner from "./SafetyBanner";
import BrandServiceDirectory from "./BrandServiceDirectory";
import VoiceGuidePlayer from "./VoiceGuidePlayer";
import RepairChatbot from "./RepairChatbot";
import {
  Wrench,
  Clock,
  CheckCircle2,
  PhoneCall,
  AlertTriangle,
  Tag,
  ThumbsUp,
  ThumbsDown,
  ShieldCheck,
  Building2,
  Check,
  Send,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface DiagnosisResultProps {
  diagnosis: ApplianceDiagnosis;
  diagnosisId: number;
  mediaUrl: string;
  mediaType: "image" | "video";
  onReset: () => void;
}

export default function DiagnosisResult({
  diagnosis,
  diagnosisId,
  mediaUrl,
  mediaType,
  onReset
}: DiagnosisResultProps) {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [feedbackStatus, setFeedbackStatus] = useState<string | null>(null);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState<boolean>(false);

  // Brand & Model contact form state for Technical Support
  const [showContactForm, setShowContactForm] = useState<boolean>(false);
  const [showDiyBrandDirectory, setShowDiyBrandDirectory] = useState<boolean>(true); // Default open for DIY safe as well!
  const [deviceBrand, setDeviceBrand] = useState<string>(diagnosis.brand_model_guess || "");
  const [deviceModel, setDeviceModel] = useState<string>("");
  const [contactPhone, setContactPhone] = useState<string>("");
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);
  const [ticketId, setTicketId] = useState<string>("");

  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleFeedback = async (feedbackType: "worked" | "didnt_work" | "called_pro") => {
    try {
      setIsSubmittingFeedback(true);
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          diagnosis_id: diagnosisId,
          feedback: feedbackType,
        }),
      });
      if (res.ok) {
        setFeedbackStatus(feedbackType);
      }
    } catch (err) {
      console.error("Failed to submit feedback:", err);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTicketId = `FX-IN-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(newTicketId);
    setContactSubmitted(true);
    handleFeedback("called_pro");
  };

  const isDiySafe = diagnosis.is_diy_safe;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-8 shadow-2xl space-y-6">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isDiySafe
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-red-500/20 text-red-300 border border-red-500/40"
              }`}
            >
              {isDiySafe ? "DIY Safe Repair" : "Professional Required"}
            </span>
            {diagnosis.confidence_score && (
              <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                Confidence: {Math.round(diagnosis.confidence_score * 100)}%
              </span>
            )}
          </div>
          <h2 className="text-2xl font-extrabold text-white capitalize">
            {diagnosis.appliance_type}
          </h2>
          {diagnosis.brand_model_guess && (
            <p className="text-xs text-amber-400 font-medium flex items-center gap-1.5 mt-0.5">
              <Tag className="w-3.5 h-3.5" />
              <span>Model Ident: {diagnosis.brand_model_guess}</span>
            </p>
          )}
        </div>

        <button
          onClick={onReset}
          className="self-start md:self-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
        >
          Scan Another Device
        </button>
      </div>

      {/* Identified Issue & Error Code */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Identified Fault
          </span>
          <p className="text-sm md:text-base font-semibold text-slate-100 leading-snug">
            {diagnosis.identified_issue}
          </p>
        </div>

        {diagnosis.error_code && (
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 flex flex-col justify-center">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Error Code Displayed
            </span>
            <span className="text-xl font-mono font-extrabold text-rose-400 bg-rose-950/40 px-3 py-1 rounded-lg border border-rose-800/50 inline-block w-fit">
              {diagnosis.error_code}
            </span>
          </div>
        )}
      </div>

      {/* CONDITIONAL RENDERING: DIY SAFE vs CALL PROFESSIONAL */}
      {!isDiySafe ? (
        /* UNSAFE PATH: Defense-in-depth: Never render repair steps! */
        <div className="space-y-6">
          <SafetyBanner
            variant="high_risk_callout"
            reasoning={diagnosis.requires_professional_reason || diagnosis.safety_reasoning}
          />

          <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-5 text-slate-300 space-y-3">
            <h4 className="font-bold text-slate-200 text-sm md:text-base flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              Safety Reasoning & Guidelines
            </h4>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {diagnosis.safety_reasoning}
            </p>

            <div className="p-3 bg-red-950/30 border border-red-900/50 rounded-xl text-red-200 text-xs">
              <strong>Emergency Precaution:</strong> If you smell gas or see active sparking, evacuate immediately and dial your local emergency service or gas utility helpline (1906 for PNG/LPG).
            </div>
          </div>

          {/* Contact Form OR Directory View */}
          {!showContactForm && !contactSubmitted ? (
            <div className="pt-2 text-center space-y-4">
              <button
                type="button"
                onClick={() => setShowContactForm(true)}
                className="inline-flex items-center gap-2.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 text-white font-extrabold text-base shadow-xl shadow-red-950/80 hover:scale-[1.02] transition-transform"
              >
                <PhoneCall className="w-5 h-5 animate-pulse" />
                <span>Contact Technical Support & Find Services (India)</span>
              </button>
            </div>
          ) : contactSubmitted ? (
            <BrandServiceDirectory
              brandName={deviceBrand || diagnosis.brand_model_guess || diagnosis.appliance_type}
              modelNumber={deviceModel}
              applianceType={diagnosis.appliance_type}
              ticketId={ticketId}
            />
          ) : (
            <form onSubmit={handleContactSubmit} className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 md:p-6 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-rose-400" />
                  <span>Indian Technical Team & Brand Service Lookup</span>
                </h3>
                <span className="text-xs text-rose-300 font-semibold bg-rose-950/60 px-2.5 py-0.5 rounded border border-rose-800">
                  Device Specs Required
                </span>
              </div>

              <p className="text-xs text-slate-300">
                Enter your device brand and model to automatically access official Indian brand service portals, toll-free customer care hotlines, and nearby local service centers (Urban Company, Justdial, Google Maps).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Device Brand <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={deviceBrand}
                    onChange={(e) => setDeviceBrand(e.target.value)}
                    placeholder="e.g. Samsung, LG, Whirlpool, IFB, Godrej, Voltas, Haier"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs md:text-sm text-white focus:outline-none focus:border-rose-500 placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Device Model Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={deviceModel}
                    onChange={(e) => setDeviceModel(e.target.value)}
                    placeholder="e.g. WA65A4002VS or Executive Plus"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs md:text-sm text-white focus:outline-none focus:border-rose-500 placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Contact Phone Number (India) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs md:text-sm text-white focus:outline-none focus:border-rose-500 placeholder:text-slate-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs md:text-sm flex items-center gap-2 shadow-lg shadow-rose-900/40"
                >
                  <Send className="w-4 h-4" />
                  <span>Get Indian Brand Support & Services</span>
                </button>
              </div>
            </form>
          )}

          {showContactForm && (
            <div className="pt-4 border-t border-slate-800">
              <BrandServiceDirectory
                brandName={deviceBrand || diagnosis.brand_model_guess || diagnosis.appliance_type}
                modelNumber={deviceModel}
                applianceType={diagnosis.appliance_type}
              />
            </div>
          )}
        </div>
      ) : (
        /* DIY SAFE PATH */
        <div className="space-y-6">
          {/* Persistent disclaimer banner */}
          <SafetyBanner variant="persistent_disclaimer" />

          {/* Time & Tools summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {diagnosis.estimated_time_minutes && (
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-semibold block">Estimated Time</span>
                  <span className="text-sm font-bold text-white">
                    ~{diagnosis.estimated_time_minutes} Minutes
                  </span>
                </div>
              </div>
            )}

            {diagnosis.required_tools && diagnosis.required_tools.length > 0 && (
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4">
                <span className="text-xs text-slate-400 font-semibold block mb-2 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-amber-400" /> Required Tools
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {diagnosis.required_tools.map((tool, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 font-medium"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* VOICE GUIDE ASSISTANT (Text-To-Speech) */}
          <VoiceGuidePlayer
            repairSteps={diagnosis.repair_steps || []}
            applianceType={diagnosis.appliance_type}
          />

          {/* Ordered Repair Steps */}
          <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Step-by-Step Repair Guide</span>
            </h3>

            <div className="space-y-3">
              {diagnosis.repair_steps && diagnosis.repair_steps.map((step, idx) => {
                const isDone = completedSteps[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isDone
                        ? "bg-emerald-950/20 border-emerald-800/50 text-slate-400"
                        : "bg-slate-800/80 border-slate-700/80 hover:border-slate-600 text-slate-100"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg shrink-0 flex items-center justify-center font-bold text-xs mt-0.5 transition-colors ${
                        isDone
                          ? "bg-emerald-500 text-slate-950"
                          : "bg-slate-700 text-slate-300 border border-slate-600"
                      }`}
                    >
                      {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                    </div>
                    <p className={`text-sm leading-relaxed ${isDone ? "line-through text-slate-400" : "font-medium"}`}>
                      {step}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BRAND SUPPORT & LOCAL SERVICE DIRECTORY FOR DIY SAFE REPAIRS */}
          <div className="bg-slate-800/40 border border-slate-700/80 rounded-2xl p-5 space-y-4">
            <button
              type="button"
              onClick={() => setShowDiyBrandDirectory((prev) => !prev)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-5 h-5 text-amber-400" />
                <div>
                  <h4 className="font-bold text-white text-sm md:text-base">
                    Need Professional Service or Spare Parts?
                  </h4>
                  <p className="text-xs text-slate-400">
                    Official Indian brand support hotlines, service portals & nearby licensed repair centers
                  </p>
                </div>
              </div>
              <div className="p-2 bg-slate-800 rounded-xl border border-slate-700 text-slate-300">
                {showDiyBrandDirectory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {showDiyBrandDirectory && (
              <div className="pt-2 animate-fade-in">
                <BrandServiceDirectory
                  brandName={diagnosis.brand_model_guess || diagnosis.appliance_type}
                  modelNumber=""
                  applianceType={diagnosis.appliance_type}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* INTERACTIVE TROUBLESHOOTING CHATBOT */}
      <RepairChatbot
        applianceType={diagnosis.appliance_type}
        identifiedIssue={diagnosis.identified_issue}
        isDiySafe={isDiySafe}
      />

      {/* FEEDBACK SECTION */}
      <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <span className="text-xs font-semibold text-slate-400">
          Was this diagnostic analysis helpful?
        </span>

        {feedbackStatus ? (
          <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Thank you for your feedback!
          </span>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleFeedback("worked")}
              disabled={isSubmittingFeedback}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-950/60 hover:text-emerald-300 text-slate-300 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" /> Worked
            </button>
            <button
              onClick={() => handleFeedback("didnt_work")}
              disabled={isSubmittingFeedback}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-300 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <ThumbsDown className="w-3.5 h-3.5 text-rose-400" /> Didn't Work
            </button>
            <button
              onClick={() => handleFeedback("called_pro")}
              disabled={isSubmittingFeedback}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-950/60 hover:text-amber-300 text-slate-300 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-400" /> Called Pro
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
