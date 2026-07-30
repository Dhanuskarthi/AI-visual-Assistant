"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { Camera, Upload, Film, FileImage, Sparkles, AlertCircle, RefreshCw, Smartphone, Car, Wrench, Home as HomeIcon, Scan, ShieldCheck } from "lucide-react";

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
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, 640, 480);
      ctx.fillStyle = "#f43f5e";
      ctx.font = "bold 24px sans-serif";
      ctx.fillText(`SPECIMEN CAPTURE: ${name.toUpperCase()}`, 40, 240);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "16px sans-serif";
      ctx.fillText("Simulated visual diagnostic capture", 40, 280);
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
    <div className="relative bg-slate-900/90 border border-slate-800 rounded-3xl p-5 md:p-8 shadow-2xl backdrop-blur-2xl overflow-hidden">
      {/* Header text */}
      <div className="text-center max-w-lg mx-auto mb-6 space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] font-bold text-amber-400">
          <Scan className="w-3.5 h-3.5 animate-pulse" /> Visual Scanner Portal
        </div>
        <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
          Capture or Upload Fault Media
        </h2>
        <p className="text-slate-400 text-xs md:text-sm">
          Snap a clear picture or video of any error code, leak, spark, or device component.
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
          className={`relative border-2 border-dashed rounded-3xl p-8 md:p-12 text-center transition-all cursor-pointer overflow-hidden ${
            isDragging
              ? "border-rose-500 bg-rose-500/10 scale-[0.99]"
              : "border-slate-700/80 bg-slate-950/60 hover:border-slate-500 hover:bg-slate-800/40"
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          {/* Animated corner scan guides */}
          <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-rose-500/70 rounded-tl-sm" />
          <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-rose-500/70 rounded-tr-sm" />
          <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-rose-500/70 rounded-bl-sm" />
          <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-rose-500/70 rounded-br-sm" />

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500/20 via-amber-500/10 to-slate-800 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/30 shadow-inner group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8 text-rose-400" />
          </div>

          <p className="text-slate-100 font-extrabold text-base md:text-lg">
            Tap to Snap or Drop Media Here
          </p>
          <p className="text-slate-400 text-xs mt-1">
            Supports High-Res Images & Short Video Clips (PNG, JPG, MP4, MOV up to 50MB)
          </p>

          {/* Action buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs md:text-sm font-extrabold flex items-center gap-2 shadow-xl shadow-rose-950/60 transition-all hover:scale-105 active:scale-95"
            >
              <Camera className="w-4 h-4" />
              <span>Use Live Camera</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs md:text-sm font-bold flex items-center gap-2 transition-all hover:scale-105"
            >
              <FileImage className="w-4 h-4 text-amber-400" />
              <span>Browse Files</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5 animate-fade-in">
          <div className="relative rounded-2xl overflow-hidden bg-black/80 border border-slate-700 aspect-video flex items-center justify-center group shadow-2xl">
            {/* Animated Laser Scanning Line during preview */}
            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-rose-500 to-transparent animate-scan z-20 pointer-events-none shadow-[0_0_15px_#f43f5e]" />

            {isVideo ? (
              <video src={previewUrl} controls className="max-h-full max-w-full object-contain" />
            ) : (
              <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain" />
            )}
            
            <button
              type="button"
              onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
              className="absolute top-3 right-3 bg-slate-950/90 hover:bg-red-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-md border border-slate-700 transition-colors z-30"
            >
              Change Media
            </button>
          </div>

          <div className="flex items-center justify-between px-2 text-xs">
            <span className="text-slate-300 font-medium truncate max-w-[240px]">
              {selectedFile?.name}
            </span>
            <span className="font-mono uppercase font-bold text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded-md border border-amber-800">
              {isVideo ? "Video Clip" : "High-Res Image"}
            </span>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-amber-600 to-rose-600 bg-[length:200%_auto] hover:bg-right text-white font-extrabold text-sm md:text-base flex items-center justify-center gap-2 shadow-2xl shadow-rose-950/80 transition-all duration-300 disabled:opacity-50 hover:scale-[1.01]"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-amber-300" />
                <span>Running Multimodal Vision & Safety Analysis...</span>
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
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">
          Or test with sample captures across device categories:
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => handleSampleClick("mobile_phone")}
            className="p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 text-left text-xs font-medium text-slate-200 transition-all hover:scale-[1.02] group"
          >
            <span className="block text-sky-400 font-bold mb-0.5 flex items-center gap-1.5 group-hover:text-sky-300">
              <Smartphone className="w-3.5 h-3.5" /> Mobile Phone
            </span>
            <span className="text-[11px] text-slate-400 block">Charging port & battery</span>
          </button>

          <button
            type="button"
            onClick={() => handleSampleClick("bike_car_vehicle")}
            className="p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 text-left text-xs font-medium text-slate-200 transition-all hover:scale-[1.02] group"
          >
            <span className="block text-amber-400 font-bold mb-0.5 flex items-center gap-1.5 group-hover:text-amber-300">
              <Car className="w-3.5 h-3.5" /> Vehicle / Bike
            </span>
            <span className="text-[11px] text-slate-400 block">12V Battery terminal</span>
          </button>

          <button
            type="button"
            onClick={() => handleSampleClick("dryer_lint")}
            className="p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 text-left text-xs font-medium text-slate-200 transition-all hover:scale-[1.02] group"
          >
            <span className="block text-emerald-400 font-bold mb-0.5 flex items-center gap-1.5 group-hover:text-emerald-300">
              <HomeIcon className="w-3.5 h-3.5" /> Appliance
            </span>
            <span className="text-[11px] text-slate-400 block">Lint screen trap</span>
          </button>

          <button
            type="button"
            onClick={() => handleSampleClick("circuit_breaker")}
            className="p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 text-left text-xs font-medium text-slate-200 transition-all hover:scale-[1.02] group"
          >
            <span className="block text-rose-400 font-bold mb-0.5 flex items-center gap-1.5 group-hover:text-rose-300">
              <Wrench className="w-3.5 h-3.5" /> Circuit Breaker
            </span>
            <span className="text-[11px] text-slate-400 block">High-voltage spark</span>
          </button>
        </div>
      </div>
    </div>
  );
}
