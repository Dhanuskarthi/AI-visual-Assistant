import HistoryList from "@/components/HistoryList";

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h1 className="text-xl md:text-2xl font-extrabold text-white">Your Past Scans</h1>
        <p className="text-xs md:text-sm text-slate-300 mt-1">
          Review your previous device scans, safety checks, and step-by-step repair guides.
        </p>
      </div>

      <HistoryList />
    </div>
  );
}
