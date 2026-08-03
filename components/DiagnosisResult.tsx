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
  ChevronUp,
  Activity,
  Printer,
  Share2,
  Cpu,
  Sparkles,
  Info
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

  // Progressive Disclosure: show fault & safety verdict first, toggle steps
  const [isStepsExpanded, setIsStepsExpanded] = useState<boolean>(true);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  // Brand & Model contact form state for Technical Support
  const [showContactForm, setShowContactForm] = useState<boolean>(false);
  const [showDiyBrandDirectory, setShowDiyBrandDirectory] = useState<boolean>(true);
  const [deviceBrand, setDeviceBrand] = useState<string>(diagnosis.brand_model_guess || "");
  const [deviceModel, setDeviceModel] = useState<string>("");
  const [contactPhone, setContactPhone] = useState<string>("");
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);
  const [ticketId, setTicketId] = useState<string>("");

  const totalSteps = diagnosis.repair_steps ? diagnosis.repair_steps.length : 0;
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

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

  const [contactError, setContactError] = useState<string | null>(null);

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

  // Export / Print PDF report function
  const handleExportPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>FixVision AI Diagnostic Report #${diagnosisId}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; color: #0f172a; max-width: 800px; margin: 0 auto; }
            .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 20px; }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-weight: bold; font-size: 12px; text-transform: uppercase; }
            .safe { background-color: #d1fae5; color: #065f46; }
            .unsafe { background-color: #fee2e2; color: #991b1b; }
            .card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 16px; background-color: #f8fafc; }
            h1 { margin: 0 0 8px 0; font-size: 24px; color: #0f172a; }
            h2 { font-size: 16px; margin-top: 0; color: #334155; }
            ol { padding-left: 20px; line-height: 1.6; }
            li { margin-bottom: 8px; }
            .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; text-center: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>FixVision AI 3.0 Diagnostic Report</h1>
            <p style="margin:0; font-size: 13px; color: #64748b;">Record ID #${diagnosisId} &bull; Generated ${new Date().toLocaleDateString()}</p>
          </div>

          <div style="margin-bottom: 16px;">
            <span class="badge ${diagnosis.is_diy_safe ? "safe" : "unsafe"}">
              ${diagnosis.is_diy_safe ? "DIY Safe Repair" : "Professional Required"}
            </span>
            <span style="font-size: 13px; font-weight: bold; margin-left: 12px;">
              Confidence: ${Math.round(diagnosis.confidence_score * 100)}% &bull; Model: ${diagnosis.ai_model_used || "FixVision AI"}
            </span>
          </div>

          <div class="card">
            <h2>Target Device & Fault</h2>
            <p><strong>Device Type:</strong> ${diagnosis.appliance_type}</p>
            ${diagnosis.brand_model_guess ? `<p><strong>Brand / Model:</strong> ${diagnosis.brand_model_guess}</p>` : ""}
            <p><strong>Identified Issue:</strong> ${diagnosis.identified_issue}</p>
            ${diagnosis.error_code ? `<p><strong>Error Code:</strong> ${diagnosis.error_code}</p>` : ""}
          </div>

          <div class="card">
            <h2>Safety Risk Evaluation</h2>
            <p><strong>Risk Level:</strong> ${diagnosis.safety_risk_level.toUpperCase()}</p>
            <p><strong>Safety Protocol:</strong> ${diagnosis.safety_reasoning}</p>
          </div>

          ${
            diagnosis.is_diy_safe && diagnosis.repair_steps.length > 0
              ? `
          <div class="card">
            <h2>Step-by-Step Repair Guide</h2>
            ${diagnosis.required_tools.length > 0 ? `<p><strong>Required Tools:</strong> ${diagnosis.required_tools.join(", ")}</p>` : ""}
            <ol>
              ${diagnosis.repair_steps.map((step) => `<li>${step}</li>`).join("")}
            </ol>
          </div>
          `
              : `
          <div class="card" style="background-color: #fff1f2; border-color: #fecdd3;">
            <h2 style="color: #991b1b;">Licensed Professional Recommended</h2>
            <p style="color: #991b1b;">${diagnosis.requires_professional_reason || diagnosis.safety_reasoning}</p>
            <p><strong>Indian Emergency Helpline:</strong> 1906 (LPG/PNG Gas Safety) or Contact Authorized Brand Support.</p>
          </div>
          `
          }

          <div class="footer">
            <p>This report is generated by FixVision AI 3.0. It provides automated diagnostic guidance, not certified engineering inspection advice.</p>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Copy share summary link function
  const handleShareDiagnosis = () => {
    const summaryText = `FixVision AI Diagnosis for ${diagnosis.appliance_type}:
Issue: ${diagnosis.identified_issue}
Status: ${diagnosis.is_diy_safe ? "DIY Safe" : "Pro Technician Required"} (Confidence ${Math.round(diagnosis.confidence_score * 100)}%)
Safety Note: ${diagnosis.safety_reasoning}`;

    navigator.clipboard.writeText(summaryText).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    });
  };

  const isDiySafe = diagnosis.is_diy_safe;
  const confPercent = Math.round(diagnosis.confidence_score * 100);

  const getCertaintyLabel = (score: number) => {
    if (score >= 80) return { label: "High Certainty", color: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10" };
    if (score >= 60) return { label: "Moderate Certainty", color: "text-amber-400 border-amber-500/40 bg-amber-500/10" };
    return { label: "Tentative Analysis", color: "text-rose-400 border-rose-500/40 bg-rose-500/10" };
  };

  const certaintyInfo = getCertaintyLabel(confPercent);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 md:p-8 shadow-2xl space-y-6 backdrop-blur-2xl animate-fade-in">
      {/* Header Info & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
                isDiySafe
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-950"
                  : "bg-red-500/20 text-red-300 border border-red-500/40 shadow-sm shadow-red-950"
              }`}
            >
              {isDiySafe ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> DIY Safe Repair
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" /> Professional Required
                </>
              )}
            </span>

            {/* AI Model Transparency Badge */}
            <span className="text-xs font-mono font-bold text-sky-300 bg-sky-950/80 px-3 py-0.5 rounded-full border border-sky-800 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-sky-400" />
              <span>Model: {diagnosis.ai_model_used || "NVIDIA Llama 3.2 Vision"}</span>
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-white capitalize tracking-tight">
            {diagnosis.appliance_type}
          </h2>

          {diagnosis.brand_model_guess && (
            <p className="text-xs text-amber-400 font-semibold flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>Model Ident: {diagnosis.brand_model_guess}</span>
            </p>
          )}
        </div>

        {/* Action Buttons: Export PDF, Share & New Scan */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={handleExportPDF}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all hover:scale-105"
            title="Export diagnosis as printable PDF"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export PDF</span>
          </button>

          <button
            type="button"
            onClick={handleShareDiagnosis}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all hover:scale-105"
            title="Copy summary link for technician"
          >
            <Share2 className="w-3.5 h-3.5 text-sky-400" />
            <span>{copySuccess ? "Copied!" : "Share"}</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 text-white text-xs font-extrabold shadow-md transition-all hover:scale-105"
          >
            Scan Another
          </button>
        </div>
      </div>

      {/* Identified Issue & Confidence Score Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Identified Issue */}
        <div className="md:col-span-2 bg-slate-800/50 border border-slate-700/70 rounded-2xl p-4 md:p-5 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Identified Fault Overview
          </span>
          <p className="text-base md:text-lg font-extrabold text-white leading-snug">
            {diagnosis.identified_issue}
          </p>
        </div>

        {/* Error Code & Confidence Meter */}
        <div className="bg-slate-800/50 border border-slate-700/70 rounded-2xl p-4 md:p-5 space-y-3 flex flex-col justify-between">
          {diagnosis.error_code ? (
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Error Code Displayed
              </span>
              <span className="text-lg font-mono font-extrabold text-rose-400 bg-rose-950/60 px-3 py-1 rounded-xl border border-rose-800/60 inline-block shadow-md">
                {diagnosis.error_code}
              </span>
            </div>
          ) : (
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Visual Pattern Match
              </span>
              <span className="text-xs font-semibold text-slate-300">
                Direct visual feature recognition
              </span>
            </div>
          )}

          {/* Confidence Meter */}
          <div className="space-y-1.5 pt-1 border-t border-slate-700/60">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold">AI Certainty Level</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${certaintyInfo.color}`}>
                {confPercent}% &bull; {certaintyInfo.label}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${confPercent}%` }}
              />
            </div>
          </div>
        </div>
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
              Safety Reasoning & Risk Guidelines
            </h4>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {diagnosis.safety_reasoning}
            </p>

            <div className="p-3.5 bg-red-950/50 border border-red-900/60 rounded-xl text-red-100 text-xs">
              <strong>Emergency Precaution:</strong> If you smell fuel/gas or see active sparking, evacuate immediately and dial emergency service or gas helpline (1906 for PNG/LPG).
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
                  Specs Required
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
                    placeholder="e.g. Samsung, Apple, Maruti Suzuki, LG, Whirlpool"
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
                    placeholder="e.g. iPhone 15, WA65A4002VS, Swift ZXi"
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
        /* DIY SAFE PATH with Progressive Disclosure */
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
                  <span className="text-xs text-slate-400 font-semibold block">Estimated Repair Time</span>
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

          {/* PROGRESSIVE DISCLOSURE TOGGLE BAR */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="font-extrabold text-white text-sm md:text-base">
                  Step-by-Step Repair Guide ({totalSteps} steps)
                </h3>
                <p className="text-xs text-slate-400">
                  {isStepsExpanded ? "Click to collapse instructions" : "Click to expand step-by-step DIY instructions"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsStepsExpanded((prev) => !prev)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <span>{isStepsExpanded ? "Collapse Guide" : "Expand Guide"}</span>
              {isStepsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* EXPANDABLE REPAIR STEPS CONTENT */}
          {isStepsExpanded && (
            <div className="space-y-6 animate-fade-in">
              {/* VOICE GUIDE ASSISTANT (Text-To-Speech) */}
              <VoiceGuidePlayer
                repairSteps={diagnosis.repair_steps || []}
                applianceType={diagnosis.appliance_type}
              />

              {/* Step Progress Completion Bar */}
              {totalSteps > 0 && (
                <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-emerald-400" /> Repair Completion Progress
                    </span>
                    <span className="font-mono text-emerald-300">{completedCount}/{totalSteps} Steps ({progressPercent}%)</span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500 rounded-full shadow-[0_0_10px_#10b981]"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Ordered Repair Steps */}
              <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Actionable Instructions</span>
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
                            ? "bg-emerald-950/30 border-emerald-700/60 text-slate-400"
                            : "bg-slate-800/80 border-slate-700/80 hover:border-slate-600 text-slate-100"
                        }`}
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
                          {step}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

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
