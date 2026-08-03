"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DiagnosisHistoryItem } from "@/types/diagnosis";
import StatusPill from "./StatusPill";
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
  Sparkles,
  Camera,
  Filter
} from "lucide-react";

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (isNaN(diffSec) || diffSec < 0) return "Recently";
  if (diffSec < 60) return "Just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
  return date.toLocaleDateString();
}

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
    window.print();
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
        <RefreshCw className="w-10 h-10 text-rose-500 animate-spin mx-auto motion-reduce:animate-none" />
        <p className="text-slate-400 text-sm font-medium">Loading your past scans…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-950/40 border border-red-800 rounded-3xl p-8 text-center space-y-3 shadow-xl" role="alert">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
        <p className="text-slate-200 font-semibold">{error}</p>
        <button
          type="button"
          onClick={fetchHistory}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none"
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
            <h2 className="text-xl md:text-2xl font-extrabold text-white">Your Past Scans</h2>
            <p className="text-xs text-slate-400">
              Review diagnostic history and tagged repair outcomes ({history.length} total scans)
            </p>
          </div>

          <button
            type="button"
            onClick={fetchHistory}
            className="self-start md:self-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none"
          >
            <RefreshCw className="w-3.5 h-3.5 text-sky-400" /> Refresh
          </button>
        </div>

        {/* Clear Filter Bar (#7) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setFilterType("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none ${
                filterType === "all"
                  ? "bg-rose-600 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              All Scans
            </button>
            <button
              type="button"
              onClick={() => setFilterType("diy")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none ${
                filterType === "diy"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              DIY Safe
            </button>
            <button
              type="button"
              onClick={() => setFilterType("pro")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none ${
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
            <span className="text-[10px] font-bold text-slate-500 uppercase px-2 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Outcome:
            </span>
            <button
              type="button"
              onClick={() => setOutcomeFilter("all")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none ${
                outcomeFilter === "all" ? "bg-slate-800 text-amber-300" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Any
            </button>
            <button
              type="button"
              onClick={() => setOutcomeFilter("worked")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none ${
                outcomeFilter === "worked" ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Fixed
            </button>
            <button
              type="button"
              onClick={() => setOutcomeFilter("didnt_work")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none ${
                outcomeFilter === "didnt_work" ? "bg-rose-950 text-rose-300 border border-rose-800" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Broken
            </button>
            <button
              type="button"
              onClick={() => setOutcomeFilter("called_pro")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none ${
                outcomeFilter === "called_pro" ? "bg-amber-950 text-amber-300 border border-amber-800" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Called Pro
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search past scans…"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500 placeholder:text-slate-500 min-h-[44px]"
            />
          </div>
        </div>
      </div>

      {/* Empty State Illustration + CTA Button (#7) */}
      {filteredHistory.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-3xl bg-slate-800/80 text-rose-400 flex items-center justify-center mx-auto border border-slate-700 shadow-inner">
            <Camera className="w-8 h-8 text-rose-400" />
          </div>

          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="font-extrabold text-white text-base md:text-lg">No Past Diagnostic Scans Found</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              {history.length === 0
                ? "You haven't run any device diagnostic scans yet. Take a picture or video of your faulty device to get instant AI repair steps."
                : "No past scans matched your search or filter settings."}
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 text-white font-extrabold text-xs md:text-sm shadow-xl hover:scale-105 transition-all min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Run Your First Diagnosis</span>
            </Link>
          </div>
        </div>
      ) : (
        /* History Item List with Relative Timestamps (#7) */
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
                    <img src={item.media_url} alt={`${item.appliance_type} scan specimen`} className="w-full h-full object-cover" />
                  ) : (
                    <Tag className="w-6 h-6 text-slate-500" />
                  )}
                </div>

                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Consistent Status Pill (#10) */}
                    {item.is_diy_safe ? (
                      <StatusPill variant="diy_safe" />
                    ) : (
                      <StatusPill variant="pro_required" />
                    )}

                    {/* Relative Timestamp (#7) */}
                    <span className="text-[11px] text-slate-400 font-mono font-medium">
                      {formatRelativeTime(item.created_at)}
                    </span>

                    {/* Outcome Badge (#10) */}
                    {item.feedback === "worked" && <StatusPill variant="outcome_fixed" />}
                    {item.feedback === "didnt_work" && <StatusPill variant="outcome_broken" />}
                    {item.feedback === "called_pro" && <StatusPill variant="outcome_called_pro" />}
                  </div>

                  <h3 className="font-bold text-white text-sm md:text-base truncate capitalize group-hover:text-rose-400 transition-colors">
                    {item.appliance_type}
                  </h3>
                  <p className="text-xs text-slate-300 truncate">
                    {item.identified_issue}
                  </p>
                </div>
              </div>

              {/* Tag Outcome Buttons */}
              <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => handleUpdateOutcome(item, "worked")}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1 min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none ${
                    item.feedback === "worked"
                      ? "bg-emerald-600 text-white border-emerald-500 shadow"
                      : "bg-slate-800 hover:bg-emerald-950 text-slate-300 border-slate-700"
                  }`}
                  title="Tag as Fixed"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Fixed</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateOutcome(item, "didnt_work")}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1 min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none ${
                    item.feedback === "didnt_work"
                      ? "bg-rose-600 text-white border-rose-500 shadow"
                      : "bg-slate-800 hover:bg-rose-950 text-slate-300 border-slate-700"
                  }`}
                  title="Tag as Still Broken"
                >
                  <ThumbsDown className="w-3.5 h-3.5 text-rose-400" />
                  <span>Broken</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateOutcome(item, "called_pro")}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1 min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none ${
                    item.feedback === "called_pro"
                      ? "bg-amber-600 text-white border-amber-500 shadow"
                      : "bg-slate-800 hover:bg-amber-950 text-slate-300 border-slate-700"
                  }`}
                  title="Tag as Called Pro"
                >
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pro</span>
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
                <StatusPill variant="engine" engineName={selectedItem.ai_model_used} />
              </div>

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 min-h-[44px] min-w-[44px] flex items-center justify-center focus:ring-2 focus:ring-rose-500 focus:outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {selectedItem.is_diy_safe ? (
                  <StatusPill variant="diy_safe" />
                ) : (
                  <StatusPill variant="pro_required" />
                )}
                <StatusPill variant="confidence" score={selectedItem.confidence_score} />
              </div>

              <h3 className="text-2xl font-extrabold text-white capitalize">{selectedItem.appliance_type}</h3>
              <p className="text-sm font-bold text-rose-300">{selectedItem.identified_issue}</p>

              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2">
                <span className="font-bold text-slate-200 block">Safety Protocol:</span>
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
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none ${
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
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none ${
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
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none ${
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

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleExportPDF(selectedItem)}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none"
                >
                  <Printer className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Print / PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleShareItem(selectedItem)}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none"
                >
                  <Share2 className="w-3.5 h-3.5 text-sky-400" />
                  <span>{copySuccess ? "Copied!" : "Share"}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none"
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
