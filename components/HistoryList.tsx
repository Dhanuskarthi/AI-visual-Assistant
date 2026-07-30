"use client";

import { useEffect, useState } from "react";
import { DiagnosisHistoryItem } from "@/types/diagnosis";
import { Calendar, ShieldAlert, ShieldCheck, Tag, ChevronRight, AlertCircle, RefreshCw, Search, X, Building2, Wrench, Smartphone, Car } from "lucide-react";

export default function HistoryList() {
  const [history, setHistory] = useState<DiagnosisHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<DiagnosisHistoryItem | null>(null);
  const [filterType, setFilterType] = useState<"all" | "diy" | "pro">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  const filteredHistory = history.filter((item) => {
    const matchesFilter =
      filterType === "all" ? true : filterType === "diy" ? item.is_diy_safe : !item.is_diy_safe;
    const matchesSearch =
      (item.appliance_type || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.identified_issue || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.brand_model_guess || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
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
            <p className="text-xs text-slate-400">Recorded scans across appliances, mobiles & vehicles ({history.length} records)</p>
          </div>

          <button
            onClick={fetchHistory}
            className="self-start md:self-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-sky-400" /> Refresh Vault
          </button>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-2xl border border-slate-800 w-fit">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterType === "all"
                  ? "bg-rose-600 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              All Records
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
            Try adjusting your search query or filter settings.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/90 rounded-2xl p-4 md:p-5 transition-all cursor-pointer flex items-center justify-between gap-4 group shadow-lg hover:scale-[1.005]"
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
                  <div className="flex items-center gap-2">
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
                  </div>

                  <h3 className="font-bold text-white text-sm md:text-base truncate capitalize group-hover:text-rose-400 transition-colors">
                    {item.appliance_type}
                  </h3>
                  <p className="text-xs text-slate-300 truncate">
                    {item.identified_issue}
                  </p>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors shrink-0" />
            </div>
          ))}
        </div>
      )}

      {/* Modal Detail View */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-slate-400">Scan ID #{selectedItem.id}</span>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-block ${
                  selectedItem.is_diy_safe
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-red-500/20 text-red-300 border border-red-500/40"
                }`}
              >
                {selectedItem.is_diy_safe ? "DIY Safe Repair" : "Professional Technician Required"}
              </span>

              <h3 className="text-2xl font-extrabold text-white capitalize">{selectedItem.appliance_type}</h3>
              <p className="text-sm font-bold text-rose-300">{selectedItem.identified_issue}</p>

              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2">
                <span className="font-bold text-slate-200 block">Safety Reasoning & Protocol:</span>
                <p className="leading-relaxed">
                  {selectedItem.requires_professional_reason || (selectedItem.is_diy_safe ? "This fix is assessed as safe for DIY homeowner repair." : "High risk detected. Requires licensed specialist.")}
                </p>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700"
              >
                Close Vault Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
