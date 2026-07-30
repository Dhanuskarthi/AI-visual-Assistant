import HistoryList from "@/components/HistoryList";

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h1 className="text-xl md:text-2xl font-extrabold text-white">Diagnostic History</h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          Review past appliance scans, safety risk assessments, and repair records.
        </p>
      </div>

      <HistoryList />
    </div>
  );
}
