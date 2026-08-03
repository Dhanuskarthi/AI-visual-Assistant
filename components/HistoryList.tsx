"use client";

import { useEffect, useState } from "react";
import { DiagnosisHistoryItem } from "@/types/diagnosis";
import {
  Calendar,
  ShieldCheck,
  Tag,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  Search,
  X,
  Building2,
  ThumbsUp,
  ThumbsDown,
  Printer,
  Share2,
  Cpu,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

export default function HistoryList() {
  const [history, setHistory] = useState<DiagnosisHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<DiagnosisHistoryItem | null>(null);
  const [filterType, setFilterType] = useState<"all" | "diy" | "pro">("all");
  const [outcomeFilter, setOutcomeFilter] = useState<"all" | "worked" | "didnt_work" | "called_pro">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/history");
      if (!res.ok) throw new Error("Failed to load history");
      const data = await res.json();
      setHistory(data);
    } catch (err: any) {
      setError(err.message || "Could not load diagnosis history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleUpdateOutcome = async (
    item: DiagnosisHistoryItem,
    feedbackType: "worked" | "didnt_work" | "called_pro"
  ) => {
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          diagnosis_id: item.id,
          feedback: feedbackType,
        }),
      });

      if (res.ok) {
        setHistory((prev) =>
          prev.map((h) => (h.id === item.id ? { ...h, feedback: feedbackType } : h))
        );
        if (selectedItem && selectedItem.id === item.id) {
          setSelectedItem({ ...selectedItem, feedback: feedbackType });
        }
      }
    } catch (err) {
      console.error("Failed to tag outcome:", err);
    }
  };

  const handleExportPDF = (item: DiagnosisHistoryItem) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>FixVision AI History Report #${item.id}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; color: #0f172a; max-width: 800px; margin: 0 auto; }
            .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 20px; }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-weight: bold; font-size: 12px; text-transform: uppercase; }
            .safe { background-color: #d1fae5; color: #065f46; }
            .unsafe { background-color: #fee2e2; color: #991b1b; }
            .card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 16px; background-color: #f8fafc; }
            h1 { margin: 0 0 8px 0; font-size: 24px; color: #0f172a; }
            h2 { font-size: 16px; margin-top: 0; color: #334155; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>FixVision AI Diagnostic Record #${item.id}</h1>
            <p style="margin:0; font-size: 13px; color: #64748b;">Logged: ${new Date(item.created_at).toLocaleString()}</p>
          </div>

          <div style="margin-bottom: 16px;">
            <span class="badge ${item.is_diy_safe ? "safe" : "unsafe"}">
              ${item.is_diy_safe ? "DIY Safe Repair" : "Professional Technician Required"}
            </span>
            <span style="font-size: 13px; font-weight: bold; margin-left: 12px;">
              Confidence: ${Math.round(item.confidence_score * 100)}% &bull; Model: ${item.ai_model_used || "FixVision AI"}
            </span>
          </div>

          <div class="card">
            <h2>Device & Observed Fault</h2>
            <p><strong>Device Category:</strong> ${item.appliance_type}</p>
            ${item.brand_model_guess ? `<p><strong>Brand / Model:</strong> ${item.brand_model_guess}</p>` : ""}
            <p><strong>Identified Issue:</strong> ${item.identified_issue}</p>
            ${item.error_code ? `<p><strong>Error Code:</strong> ${item.error_code}</p>` : ""}
            ${item.feedback ? `<p><strong>Tagged Outcome:</strong> ${item.feedback === "worked" ? "Fixed / Worked" : item.feedback === "didnt_work" ? "Still Broken" : "Contacted Professional"}</p>` : ""}
          </div>

          <div class="card">
            <h2>Safety Evaluation & Reason</h2>
            <p><strong>Risk Level:</strong> ${item.safety_risk_level.toUpperCase()}</p>
            <p><strong>Safety Protocol:</strong> ${item.requires_professional_reason || "Safety assessment verified by FixVision automated rules."}</p>
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

  const handleShareItem = (item: DiagnosisHistoryItem) => {
    const text = `FixVision AI Scan #${item.id}: ${item.appliance_type} - ${item.identified_issue}. Status: ${item.is_diy_safe ? "DIY Safe" : "Pro Required"}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    });
  };

  const filteredHistory = history.filter((item) => {
    const matchesFilter =
      filterType === "all" ? true : filterType === "diy" ? item.is_diy_safe : !item.is_diy_safe;
    const matchesOutcome =
      outcomeFilter === "all" ? true : item.feedback === outcomeFilter;
    const matchesSearch =
      (item.appliance_type || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.identified_issue || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.brand_model_guess || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesOutcome && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="text-center py-20 space-y-4">
        <RefreshCw className="w-10 h-10 text-rose-500 animate-spin mx-auto" />
        <p className="text-slate-400 text-sm font-medium">Loading diagnostic history vault...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-950/40 border border-red-800 rounded-3xl p-8 text-center space-y-3 shadow-xl">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
        <p className="text-slate-200 font-semibold">{error}</p>
        <button
          onClick={fetchHistory}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Controls */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl backdrop-blur-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white">Diagnostic History Vault</h2>
            <p className="text-xs text-slate-400">
              Recorded scans with outcome tagging & technician share features ({history.length} total scans)
            </p>
          </div>

          <button
            onClick={fetchHistory}
            className="self-start md:self-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-sky-400" /> Refresh Vault
          </button>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2">
          {/* Tabs: Safety Filter */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/80 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterType === "all"
                  ? "bg-rose-600 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              All Scans
            </button>
            <button
              onClick={() => setFilterType("diy")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterType === "diy"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              DIY Safe
            </button>
            <button
              onClick={() => setFilterType("pro")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterType === "pro"
                  ? "bg-red-600 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Pro Required
            </button>
          </div>

          {/* Outcome Filter */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/80 p-1 rounded-2xl border border-slate-800 text-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase px-2">Outcome:</span>
            <button
              onClick={() => setOutcomeFilter("all")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                outcomeFilter === "all" ? "bg-slate-800 text-amber-300" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Any
            </button>
            <button
              onClick={() => setOutcomeFilter("worked")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                outcomeFilter === "worked" ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Fixed
            </button>
            <button
              onClick={() => setOutcomeFilter("didnt_work")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                outcomeFilter === "didnt_work" ? "bg-rose-950 text-rose-300 border border-rose-800" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Still Broken
            </button>
            <button
              onClick={() => setOutcomeFilter("called_pro")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                outcomeFilter === "called_pro" ? "bg-amber-950 text-amber-300 border border-amber-800" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Called Pro
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by device or fault..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500 placeholder:text-slate-500"
            />
          </div>
        </div>
      </div>

      {/* History List Items */}
      {filteredHistory.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto border border-slate-700">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-base">No Matching Diagnostic Scans Found</h3>
          <p className="text-slate-400 text-xs max-w-sm mx-auto">
            Try adjusting your search query or outcome filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/90 rounded-2xl p-4 md:p-5 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group shadow-lg hover:scale-[1.005]"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center relative">
                  {item.media_url ? (
                    <img src={item.media_url} alt="Scan preview" className="w-full h-full object-cover" />
                  ) : (
                    <Tag className="w-6 h-6 text-slate-500" />
                  )}
                </div>

                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                        item.is_diy_safe
                          ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800"
                          : "bg-red-950/80 text-red-300 border border-red-800"
                      }`}
                    >
                      {item.is_diy_safe ? "DIY Safe" : "Pro Required"}
                    </span>

                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>

                    {/* Outcome Badge */}
                    {item.feedback && (
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          item.feedback === "worked"
                            ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                            : item.feedback === "didnt_work"
                            ? "bg-rose-950 text-rose-300 border-rose-800"
                            : "bg-amber-950 text-amber-300 border-amber-800"
                        }`}
                      >
                        {item.feedback === "worked"
                          ? "✓ Fixed"
                          : item.feedback === "didnt_work"
                          ? "✕ Still Broken"
                          : "🛠 Called Pro"}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-white text-sm md:text-base truncate capitalize group-hover:text-rose-400 transition-colors">
                    {item.appliance_type}
                  </h3>
                  <p className="text-xs text-slate-300 truncate">
                    {item.identified_issue}
                  </p>
                </div>
              </div>

              {/* Tag Outcome Quick Buttons */}
              <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => handleUpdateOutcome(item, "worked")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors flex items-center gap-1 ${
                    item.feedback === "worked"
                      ? "bg-emerald-600 text-white border-emerald-500 shadow"
                      : "bg-slate-800 hover:bg-emerald-950 text-slate-300 border-slate-700"
                  }`}
                  title="Tag as Fixed"
                >
                  <ThumbsUp className="w-3 h-3 text-emerald-400" />
                  <span>Fixed</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateOutcome(item, "didnt_work")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors flex items-center gap-1 ${
                    item.feedback === "didnt_work"
                      ? "bg-rose-600 text-white border-rose-500 shadow"
                      : "bg-slate-800 hover:bg-rose-950 text-slate-300 border-slate-700"
                  }`}
                  title="Tag as Still Broken"
                >
                  <ThumbsDown className="w-3 h-3 text-rose-400" />
                  <span>Broken</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateOutcome(item, "called_pro")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors flex items-center gap-1 ${
                    item.feedback === "called_pro"
                      ? "bg-amber-600 text-white border-amber-500 shadow"
                      : "bg-slate-800 hover:bg-amber-950 text-slate-300 border-slate-700"
                  }`}
                  title="Tag as Called Pro"
                >
                  <Building2 className="w-3 h-3 text-amber-400" />
                  <span>Called Pro</span>
                </button>

                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors ml-1" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Detail View */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-400">Scan ID #{selectedItem.id}</span>
                <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                  {selectedItem.ai_model_used || "FixVision AI"}
                </span>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-block ${
                    selectedItem.is_diy_safe
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-red-500/20 text-red-300 border border-red-500/40"
                  }`}
                >
                  {selectedItem.is_diy_safe ? "DIY Safe Repair" : "Professional Technician Required"}
                </span>
                <span className="text-xs font-mono text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700">
                  Certainty: {Math.round(selectedItem.confidence_score * 100)}%
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-white capitalize">{selectedItem.appliance_type}</h3>
              <p className="text-sm font-bold text-rose-300">{selectedItem.identified_issue}</p>

              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2">
                <span className="font-bold text-slate-200 block">Safety Protocol & Assessment:</span>
                <p className="leading-relaxed">
                  {selectedItem.requires_professional_reason || (selectedItem.is_diy_safe ? "Assessed as safe for DIY homeowner repair." : "High risk detected. Requires licensed specialist.")}
                </p>
              </div>

              {/* Tag Outcome in Modal */}
              <div className="p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700 space-y-2">
                <span className="text-xs font-bold text-slate-300 block">Tag Outcome Status:</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateOutcome(selectedItem, "worked")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                      selectedItem.feedback === "worked"
                        ? "bg-emerald-600 text-white border-emerald-500 shadow"
                        : "bg-slate-900 text-slate-300 border-slate-700"
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Fixed / Worked</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateOutcome(selectedItem, "didnt_work")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                      selectedItem.feedback === "didnt_work"
                        ? "bg-rose-600 text-white border-rose-500 shadow"
                        : "bg-slate-900 text-slate-300 border-slate-700"
                    }`}
                  >
                    <ThumbsDown className="w-3.5 h-3.5 text-rose-400" />
                    <span>Still Broken</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateOutcome(selectedItem, "called_pro")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                      selectedItem.feedback === "called_pro"
                        ? "bg-amber-600 text-white border-amber-500 shadow"
                        : "bg-slate-900 text-slate-300 border-slate-700"
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Contacted a Pro</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Export & Share buttons in modal */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleExportPDF(selectedItem)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Export PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleShareItem(selectedItem)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5 text-sky-400" />
                  <span>{copySuccess ? "Copied!" : "Share"}</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
