"use client";

import { useState } from "react";
import { ApplianceDiagnosis } from "@/types/diagnosis";
import SafetyBanner from "./SafetyBanner";
import BrandServiceDirectory from "./BrandServiceDirectory";
import VoiceGuidePlayer from "./VoiceGuidePlayer";
import RepairChatbot from "./RepairChatbot";
import StatusPill from "./StatusPill";
import {
  Wrench,
  Clock,
  CheckCircle2,
  PhoneCall,
  AlertTriangle,
  Tag,
  ThumbsUp,
  ThumbsDown,
  Building2,
  Check,
  Send,
  ChevronDown,
  ChevronUp,
  Activity,
  Printer,
  Share2,
  Copy,
  RotateCcw,
  Info,
  ShieldCheck,
  Volume2,
  VolumeX
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { getLocalizedText } from "@/lib/translationUtils";
import { playSpeech, stopAllSpeech } from "@/lib/speechHelper";

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
  const { language, t } = useLanguage();
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [checkedTools, setCheckedTools] = useState<Record<number, boolean>>({});
  const [copiedStepIdx, setCopiedStepIdx] = useState<number | null>(null);
  const [isSpeakingSummary, setIsSpeakingSummary] = useState<boolean>(false);

  const [feedbackStatus, setFeedbackStatus] = useState<string | null>(null);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState<boolean>(false);

  const toggleSpeakSummary = () => {
    if (isSpeakingSummary) {
      stopAllSpeech();
      setIsSpeakingSummary(false);
    } else {
      setIsSpeakingSummary(true);

      const localizedIssue = getLocalizedText(diagnosis.identified_issue, language);
      const localizedSafety = getLocalizedText(diagnosis.safety_reasoning || "", language);
      const summaryText = `${diagnosis.appliance_type}. ${localizedIssue}. ${localizedSafety}`;

      playSpeech({
        text: summaryText,
        lang: language,
        rate: 0.90,
        onEnd: () => setIsSpeakingSummary(false),
        onError: () => setIsSpeakingSummary(false)
      });
    }
  };

  // Progressive Disclosure: default steps visible
  const [isStepsExpanded, setIsStepsExpanded] = useState<boolean>(true);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  // Contact form state
  const [showContactForm, setShowContactForm] = useState<boolean>(false);
  const [showDiyBrandDirectory, setShowDiyBrandDirectory] = useState<boolean>(true);
  const [deviceBrand, setDeviceBrand] = useState<string>(diagnosis.brand_model_guess || "");
  const [deviceModel, setDeviceModel] = useState<string>("");
  const [contactPhone, setContactPhone] = useState<string>("");
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);
  const [ticketId, setTicketId] = useState<string>("");
  const [contactError, setContactError] = useState<string | null>(null);

  const totalSteps = diagnosis.repair_steps ? diagnosis.repair_steps.length : 0;
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleTool = (idx: number) => {
    setCheckedTools((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const copyStepText = (stepText: string, idx: number) => {
    navigator.clipboard.writeText(stepText);
    setCopiedStepIdx(idx);
    setTimeout(() => setCopiedStepIdx(null), 2000);
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

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: deviceBrand,
          model: deviceModel,
          phone: contactPhone,
          appliance_type: diagnosis.appliance_type,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit service request. Please try again.");
      }

      const data = await res.json();
      setTicketId(data.ticket_id || `FX-IN-${Math.floor(100000 + Math.random() * 900000)}`);
      setContactSubmitted(true);
      handleFeedback("called_pro");
    } catch (err: any) {
      setContactError(err.message || "Failed to log service ticket.");
    }
  };

  // Export / Print PDF report (#5)
  const handleExportPDF = () => {
    window.print();
  };

  // Copy share summary link
  const handleShareDiagnosis = () => {
    const summaryText = `FixVision AI Diagnosis for ${diagnosis.appliance_type}:
Issue: ${diagnosis.identified_issue}
Status: ${diagnosis.is_diy_safe ? "DIY Safe" : "Pro Technician Required"} (Confidence ${Math.round(diagnosis.confidence_score * 100)}%)
Engine: ${diagnosis.ai_model_used || "FixVision AI"}`;

    navigator.clipboard.writeText(summaryText).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    });
  };

  const isDiySafe = diagnosis.is_diy_safe;
  const isLowConfidence = diagnosis.confidence_score < 0.6; // #4

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 md:p-8 shadow-2xl space-y-6 backdrop-blur-2xl animate-fade-in">
      {/* Header Info & Always Visible Start Over Button (#5) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Pill for DIY vs Pro (#10) */}
            {isDiySafe ? (
              <StatusPill variant="diy_safe" />
            ) : (
              <StatusPill variant="pro_required" />
            )}

            {/* Engine Pill (#4) */}
            <StatusPill variant="engine" engineName={diagnosis.ai_model_used} />

            {/* Confidence Pill */}
            <StatusPill variant="confidence" score={diagnosis.confidence_score} />
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-white capitalize tracking-tight">
            {diagnosis.appliance_type}
          </h2>

          {diagnosis.brand_model_guess && (
            <p className="text-xs text-amber-400 font-semibold flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>Model Tag: {diagnosis.brand_model_guess}</span>
            </p>
          )}
        </div>

        {/* Action Buttons: Export PDF, Share & ALWAYS VISIBLE Start Over (#5) */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={handleExportPDF}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all hover:scale-105 min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t("print_pdf")}</span>
          </button>

          <button
            type="button"
            onClick={handleShareDiagnosis}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all hover:scale-105 min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none"
            title="Copy summary for technician"
          >
            <Share2 className="w-3.5 h-3.5 text-sky-400" />
            <span>{copySuccess ? "Copied!" : t("share")}</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-rose-600 to-amber-500 hover:from-indigo-500 hover:to-amber-400 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-indigo-950/50 transition-all hover:scale-105 min-h-[44px] focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t("start_over")}</span>
          </button>
        </div>
      </div>

      {/* Low Confidence Prominent Note (#4) */}
      {isLowConfidence && (
        <div className="p-4 bg-amber-950/60 border border-amber-500/50 rounded-2xl text-amber-100 text-xs md:text-sm flex items-start gap-3 shadow-lg" role="note">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-bold text-amber-300">Low confidence scan: </strong>
            <span>{t("low_confidence_note")}</span>
          </div>
        </div>
      )}

      {/* Identified Issue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-slate-800/50 border border-slate-700/70 rounded-2xl p-4 md:p-5 space-y-1 relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              {t("observed_fault")}
            </span>
            <button
              type="button"
              onClick={toggleSpeakSummary}
              className={`text-xs px-2.5 py-1 rounded-xl font-bold flex items-center gap-1.5 transition-colors ${
                isSpeakingSummary
                  ? "bg-amber-500 text-slate-950 animate-pulse"
                  : "bg-slate-700/80 hover:bg-slate-700 text-amber-400 border border-amber-500/30"
              }`}
              title={t("read_summary")}
            >
              {isSpeakingSummary ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isSpeakingSummary ? t("stop_listening") : t("read_summary")}</span>
            </button>
          </div>
          <p className="text-base md:text-lg font-extrabold text-white leading-snug pt-1">
            {getLocalizedText(diagnosis.identified_issue, language)}
          </p>
        </div>

        {diagnosis.error_code && (
          <div className="bg-slate-800/50 border border-slate-700/70 rounded-2xl p-4 md:p-5 flex flex-col justify-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              {t("error_code_displayed")}
            </span>
            <span className="text-lg font-mono font-extrabold text-rose-400 bg-rose-950/60 px-3 py-1 rounded-xl border border-rose-800/60 inline-block w-fit shadow-md">
              {diagnosis.error_code}
            </span>
          </div>
        )}
      </div>

      {/* CONDITIONAL RENDERING: DIY SAFE vs CALL PROFESSIONAL */}
      {!isDiySafe ? (
        <div className="space-y-6">
          <SafetyBanner
            variant="high_risk_callout"
            reasoning={diagnosis.requires_professional_reason || diagnosis.safety_reasoning}
          />

          <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-5 text-slate-300 space-y-3">
            <h4 className="font-bold text-slate-200 text-sm md:text-base flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              Safety Guidelines
            </h4>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {diagnosis.safety_reasoning}
            </p>
          </div>

          {/* Contact Form OR Directory View */}
          {!showContactForm && !contactSubmitted ? (
            <div className="pt-2 text-center space-y-4">
              <button
                type="button"
                onClick={() => setShowContactForm(true)}
                className="inline-flex items-center gap-2.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 text-white font-extrabold text-base shadow-xl shadow-red-950/80 hover:scale-[1.02] transition-transform min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none"
              >
                <PhoneCall className="w-5 h-5 animate-pulse" />
                <span>Contact Technical Support & Find Services</span>
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
                  <span>Technical Support Request</span>
                </h3>
                <span className="text-xs text-rose-300 font-semibold bg-rose-950/60 px-2.5 py-0.5 rounded border border-rose-800">
                  Required
                </span>
              </div>

              {contactError && (
                <p className="text-xs text-rose-400 font-semibold">{contactError}</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Brand <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={deviceBrand}
                    onChange={(e) => setDeviceBrand(e.target.value)}
                    placeholder="e.g. Samsung, Apple, LG, Maruti"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs md:text-sm text-white focus:outline-none focus:border-rose-500 placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Model Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={deviceModel}
                    onChange={(e) => setDeviceModel(e.target.value)}
                    placeholder="e.g. iPhone 15, WA65A4002VS"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs md:text-sm text-white focus:outline-none focus:border-rose-500 placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Contact Phone Number <span className="text-rose-400">*</span>
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
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs md:text-sm flex items-center gap-2 shadow-lg shadow-rose-900/40 min-h-[44px]"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Service Ticket</span>
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
          <SafetyBanner variant="persistent_disclaimer" />

          {/* Time & Required Tools Interactive Checklist (#5) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {diagnosis.estimated_time_minutes && (
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-semibold block">{t("estimated_time")}</span>
                  <span className="text-sm font-bold text-white">
                    ~{diagnosis.estimated_time_minutes} Mins
                  </span>
                </div>
              </div>
            )}

            {diagnosis.required_tools && diagnosis.required_tools.length > 0 && (
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 space-y-2">
                <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-amber-400" /> {t("required_tools")}
                </span>
                <div className="flex flex-wrap gap-2">
                  {diagnosis.required_tools.map((tool, idx) => {
                    const isChecked = checkedTools[idx];
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleTool(idx)}
                        className={`text-xs px-3 py-1.5 rounded-xl border font-semibold flex items-center gap-1.5 transition-all min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none ${
                          isChecked
                            ? "bg-emerald-950/80 text-emerald-300 border-emerald-700 line-through"
                            : "bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-500"
                        }`}
                      >
                        <Check className={`w-3.5 h-3.5 ${isChecked ? "text-emerald-400" : "opacity-30"}`} />
                        <span>{tool}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Progressive Disclosure Toggle Bar */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="font-extrabold text-white text-sm md:text-base">
                  {t("step_by_step_diy")} ({totalSteps} {language === "ta" ? "படிகள்" : "steps"})
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsStepsExpanded((prev) => !prev)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none"
            >
              <span>{isStepsExpanded ? t("hide_steps") : t("show_steps")}</span>
              {isStepsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* EXPANDABLE REPAIR STEPS CONTENT (#5) */}
          {isStepsExpanded && (
            <div className="space-y-6 animate-fade-in">
              <VoiceGuidePlayer
                repairSteps={(diagnosis.repair_steps || []).map((s) => getLocalizedText(s, language))}
                applianceType={diagnosis.appliance_type}
              />

              {totalSteps > 0 && (
                <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-emerald-400" /> Progress
                    </span>
                    <span className="font-mono text-emerald-300">{completedCount}/{totalSteps} Steps ({progressPercent}%)</span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Ordered Repair Steps with per-step Copy button (#5) */}
              <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-4">
                <div className="space-y-3">
                  {diagnosis.repair_steps && diagnosis.repair_steps.map((step, idx) => {
                    const isDone = completedSteps[idx];
                    const isCopied = copiedStepIdx === idx;
                    const localizedStep = getLocalizedText(step, language);
                    return (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                          isDone
                            ? "bg-emerald-950/30 border-emerald-700/60 text-slate-400"
                            : "bg-slate-800/80 border-slate-700/80 hover:border-slate-600 text-slate-100"
                        }`}
                      >
                        <div
                          onClick={() => toggleStep(idx)}
                          className="flex items-start gap-3 cursor-pointer flex-1"
                        >
                          <div
                            className={`w-6 h-6 rounded-lg shrink-0 flex items-center justify-center font-bold text-xs mt-0.5 transition-colors ${
                              isDone
                                ? "bg-emerald-500 text-slate-950 shadow-[0_0_10px_#10b981]"
                                : "bg-slate-700 text-slate-300 border border-slate-600"
                            }`}
                          >
                            {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                          </div>
                          <p className={`text-sm leading-relaxed ${isDone ? "line-through text-slate-400" : "font-medium"}`}>
                            {localizedStep}
                          </p>
                        </div>

                        {/* Per-step Copy Button (#5) */}
                        <button
                          type="button"
                          onClick={() => copyStepText(step, idx)}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center focus:ring-2 focus:ring-rose-500 focus:outline-none"
                          title="Copy step text"
                          aria-label={`Copy step ${idx + 1}`}
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* BRAND SUPPORT DIRECTORY */}
          <div className="bg-slate-800/40 border border-slate-700/80 rounded-2xl p-5 space-y-4">
            <button
              type="button"
              onClick={() => setShowDiyBrandDirectory((prev) => !prev)}
              className="w-full flex items-center justify-between text-left focus:ring-2 focus:ring-rose-500 focus:outline-none rounded-xl p-1"
            >
              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-5 h-5 text-amber-400" />
                <div>
                  <h4 className="font-bold text-white text-sm md:text-base">
                    Need Professional Service or Spare Parts?
                  </h4>
                  <p className="text-xs text-slate-400">
                    Official brand hotlines & nearby repair centers
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
              type="button"
              onClick={() => handleFeedback("worked")}
              disabled={isSubmittingFeedback}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-950/60 hover:text-emerald-300 text-slate-300 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none"
            >
              <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" /> Worked
            </button>
            <button
              type="button"
              onClick={() => handleFeedback("didnt_work")}
              disabled={isSubmittingFeedback}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-300 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none"
            >
              <ThumbsDown className="w-3.5 h-3.5 text-rose-400" /> Didn't Work
            </button>
            <button
              type="button"
              onClick={() => handleFeedback("called_pro")}
              disabled={isSubmittingFeedback}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-950/60 hover:text-amber-300 text-slate-300 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-400" /> Called Pro
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
