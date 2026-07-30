"use client";

import { useEffect, useState } from "react";
import { DiagnosisHistoryItem } from "@/types/diagnosis";
import { Calendar, ShieldAlert, ShieldCheck, Tag, ChevronRight, AlertCircle, RefreshCw } from "lucide-react";

export default function HistoryList() {
  const [history, setHistory] = useState<DiagnosisHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<DiagnosisHistoryItem | null>(null);

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

  if (isLoading) {
    return (
      <div className="text-center py-16 space-y-3">
        <RefreshCw className="w-8 h-8 text-rose-500 animate-spin mx-auto" />
        <p className="text-slate-400 text-sm">Loading diagnostic history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-950/40 border border-red-800 rounded-2xl p-6 text-center space-y-2">
        <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
        <p className="text-slate-200 font-semibold">{error}</p>
        <button
          onClick={fetchHistory}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 mt-2"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
          <Calendar className="w-7 h-7" />
        </div>
        <h3 className="font-bold text-slate-200 text-base">No Diagnoses Yet</h3>
        <p className="text-slate-400 text-xs max-w-sm mx-auto">
          Run your first appliance scan from the home Troubleshooter tab to build your diagnostic record.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Diagnostic Logs ({history.length})</h2>
        <button
          onClick={fetchHistory}
          className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {history.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all cursor-pointer flex items-center justify-between gap-4 group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-14 h-14 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                {item.media_url ? (
                  <img src={item.media_url} alt="Scan preview" className="w-full h-full object-cover" />
                ) : (
                  <Tag className="w-6 h-6 text-slate-500" />
                )}
              </div>

              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      item.is_diy_safe
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        : "bg-red-950 text-red-400 border border-red-800"
                    }`}
                  >
                    {item.is_diy_safe ? "DIY Safe" : "Pro Required"}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-bold text-slate-100 text-sm truncate capitalize">
                  {item.appliance_type}
                </h3>
                <p className="text-xs text-slate-400 truncate">
                  {item.identified_issue}
                </p>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors shrink-0" />
          </div>
        ))}
      </div>

      {/* Item Modal Details */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-400">Diagnosis #{selectedItem.id}</span>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-xs font-bold text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-extrabold text-white capitalize">{selectedItem.appliance_type}</h3>
              <p className="text-sm font-semibold text-rose-300">{selectedItem.identified_issue}</p>
              
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-1">
                <span className="font-bold block text-slate-200">Safety Status:</span>
                <p>{selectedItem.requires_professional_reason || (selectedItem.is_diy_safe ? "Safe for DIY repair." : "Requires licensed professional.")}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
