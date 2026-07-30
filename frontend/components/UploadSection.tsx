"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { Camera, Upload, Film, FileImage, Sparkles, AlertCircle, RefreshCw } from "lucide-react";

interface UploadSectionProps {
  onAnalyze: (file: File) => void;
  isLoading: boolean;
}

export default function UploadSection({ onAnalyze, isLoading }: UploadSectionProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setIsVideo(file.type.startsWith("video/") || file.name.endsWith(".mp4") || file.name.endsWith(".mov"));
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const createSampleFile = async (name: string, type: string) => {
    // Create a dummy mock image blob for testing
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(0, 0, 640, 480);
      ctx.fillStyle = "#f43f5e";
      ctx.font = "bold 24px sans-serif";
      ctx.fillText(`TEST SPECIMEN: ${name.toUpperCase()}`, 40, 240);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "16px sans-serif";
      ctx.fillText("Simulated visual capture for AI analysis", 40, 280);
    }
    
    return new Promise<File>((resolve) => {
      canvas.toBlob((blob) => {
        const file = new File([blob || new Blob()], `${name}_sample.jpg`, { type: "image/jpeg" });
        resolve(file);
      }, "image/jpeg");
    });
  };

  const handleSampleClick = async (sampleType: string) => {
    const file = await createSampleFile(sampleType, "image/jpeg");
    handleFileSelect(file);
  };

  const handleSubmit = () => {
    if (selectedFile && !isLoading) {
      onAnalyze(selectedFile);
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 md:p-8 shadow-2xl backdrop-blur-xl">
      <div className="text-center max-w-lg mx-auto mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Visual Fault Diagnostics
        </h2>
        <p className="text-slate-400 text-xs md:text-sm mt-1">
          Upload a clear photo or short video of the appliance error code, leak, or breaker fault.
        </p>
      </div>

      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept="image/*,video/*"
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleInputChange}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {/* Main dropzone or preview */}
      {!previewUrl ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-6 md:p-10 text-center transition-all cursor-pointer ${
            isDragging
              ? "border-rose-500 bg-rose-500/10 scale-[0.99]"
              : "border-slate-700 bg-slate-800/40 hover:border-slate-500 hover:bg-slate-800/80"
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-slate-600 shadow-inner">
            <Upload className="w-8 h-8" />
          </div>
          <p className="text-slate-200 font-semibold text-sm md:text-base">
            Tap to upload photo or short video
          </p>
          <p className="text-slate-400 text-xs mt-1">
            PNG, JPG, MP4, MOV up to 50MB
          </p>

          {/* Action buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <Camera className="w-4 h-4" />
              <span>Use Camera</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-all hover:scale-105"
            >
              <FileImage className="w-4 h-4 text-amber-400" />
              <span>Choose File</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-black/60 border border-slate-700 aspect-video flex items-center justify-center group">
            {isVideo ? (
              <video src={previewUrl} controls className="max-h-full max-w-full object-contain" />
            ) : (
              <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain" />
            )}
            
            <button
              type="button"
              onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
              className="absolute top-3 right-3 bg-slate-900/80 hover:bg-red-600 text-white p-2 rounded-xl text-xs font-medium backdrop-blur-md border border-slate-700 transition-colors"
            >
              Change Media
            </button>
          </div>

          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-slate-400 truncate max-w-[200px]">
              {selectedFile?.name}
            </span>
            <span className="text-[11px] font-mono uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
              {isVideo ? "Video" : "Image"}
            </span>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-amber-600 to-rose-600 bg-[length:200%_auto] hover:bg-right text-white font-bold text-sm md:text-base flex items-center justify-center gap-2 shadow-xl shadow-rose-900/30 transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-amber-300" />
                <span>Diagnosing Appliance & Assessing Safety...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300 animate-bounce" />
                <span>Run Multimodal AI Diagnosis</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Quick Test Samples */}
      <div className="mt-8 pt-6 border-t border-slate-800">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 text-center">
          Or test with sample scenarios:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => handleSampleClick("dryer_lint")}
            className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left text-xs font-medium text-slate-300 transition-colors"
          >
            <span className="block text-emerald-400 font-bold mb-0.5">Dryer Lint Trap</span>
            <span className="text-[11px] text-slate-400">Safe DIY cosmetic fix</span>
          </button>
          <button
            type="button"
            onClick={() => handleSampleClick("circuit_breaker")}
            className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left text-xs font-medium text-slate-300 transition-colors"
          >
            <span className="block text-rose-400 font-bold mb-0.5">Circuit Breaker</span>
            <span className="text-[11px] text-slate-400">Electrical spark hazard</span>
          </button>
          <button
            type="button"
            onClick={() => handleSampleClick("gas_heater")}
            className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left text-xs font-medium text-slate-300 transition-colors"
          >
            <span className="block text-amber-400 font-bold mb-0.5">Gas Appliance</span>
            <span className="text-[11px] text-slate-400">Gas smell / ignition fault</span>
          </button>
          <button
            type="button"
            onClick={() => handleSampleClick("in_wall_leak")}
            className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left text-xs font-medium text-slate-300 transition-colors"
          >
            <span className="block text-sky-400 font-bold mb-0.5">Wall Plumbing</span>
            <span className="text-[11px] text-slate-400">Behind-wall leak</span>
          </button>
        </div>
      </div>
    </div>
  );
}
