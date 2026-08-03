"use client";

import { useState, useRef, ChangeEvent, DragEvent, useEffect } from "react";
import {
  Camera,
  Upload,
  FileImage,
  Sparkles,
  AlertOctagon,
  RefreshCw,
  Smartphone,
  Car,
  Wrench,
  Home as HomeIcon,
  Scan,
  ShieldCheck,
  X,
  FileCheck,
  CheckCircle2,
  HelpCircle,
  Video,
  Info
} from "lucide-react";
import PhotoGuidance from "./PhotoGuidance";
import OnboardingStrip from "./OnboardingStrip";
import { useLanguage } from "@/context/LanguageContext";

interface UploadSectionProps {
  onAnalyze: (file: File) => void;
  isLoading: boolean;
}

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // Server limit: 25MB (#2)

export default function UploadSection({ onAnalyze, isLoading }: UploadSectionProps) {
  const { language, t } = useLanguage();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Live Camera stream state (#2)
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoStreamRef = useRef<HTMLVideoElement | null>(null);

  // Progressive Loading State steps (#3)
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const loadingStepsList = [
    { title: "Uploading media…", desc: "Preparing specimen frame for vision models" },
    { title: "Analyzing image with vision model…", desc: "Scanning error codes, branding & structural defects" },
    { title: "Running safety gate evaluation…", desc: "Checking for gas leaks, electrical arcing & hazardous conditions" },
    { title: "Generating repair steps…", desc: "Compiling personalized step-by-step DIY instructions" }
  ];

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < loadingStepsList.length - 1 ? prev + 1 : prev));
      }, 1500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Clean up camera stream when component unmounts or camera is closed
  const stopCameraStream = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const startLiveCamera = async () => {
    setValidationError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setCameraStream(stream);
      setIsCameraActive(true);
      if (videoStreamRef.current) {
        videoStreamRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.warn("Live camera access failed, falling back to file picker:", err);
      setValidationError("Camera permission was not granted or live camera is unavailable. Please select a photo from files.");
      setIsCameraActive(false);
    }
  };

  const captureCameraFrame = () => {
    if (!videoStreamRef.current) return;
    const video = videoStreamRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `live_camera_capture_${Date.now()}.jpg`, { type: "image/jpeg" });
          stopCameraStream();
          validateAndSetFile(file);
        }
      }, "image/jpeg", 0.92);
    }
  };

  const validateAndSetFile = (file: File) => {
    setValidationError(null);

    // Check size limit (25MB) (#2)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setValidationError(`File size (${sizeMB} MB) exceeds the 25 MB limit. Please choose a smaller photo or short clip.`);
      return;
    }

    // Check file type
    const isImg = file.type.startsWith("image/");
    const isVid = file.type.startsWith("video/") || file.name.endsWith(".mp4") || file.name.endsWith(".mov") || file.name.endsWith(".webm");

    if (!isImg && !isVid) {
      setValidationError("Unsupported file format. Please select an image (JPG, PNG, WEBP) or a short video clip (MP4, MOV).");
      return;
    }

    setSelectedFile(file);
    setIsVideo(isVid);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const createSampleFile = async (name: string) => {
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
    const file = await createSampleFile(sampleType);
    validateAndSetFile(file);
  };

  const handleSubmit = () => {
    if (selectedFile && !isLoading) {
      onAnalyze(selectedFile);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + " KB";
    }
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="relative bg-slate-900/90 border border-slate-800 rounded-3xl p-5 md:p-8 shadow-2xl backdrop-blur-2xl space-y-6 overflow-hidden">
      {/* Onboarding Quick Strip (#1) */}
      <OnboardingStrip />

      {/* Header text */}
      <div className="text-center max-w-lg mx-auto space-y-1.5">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          {t("capture_upload_title")}
        </h2>
        <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
          {t("capture_upload_subtitle")}
        </p>
      </div>

      {/* Client Validation Error Alert (#3) */}
      {validationError && (
        <div className="p-4 bg-red-950/90 border border-red-700 rounded-2xl text-red-200 text-xs md:text-sm flex items-start justify-between gap-3 shadow-xl animate-fade-in" role="alert">
          <div className="flex items-start gap-2.5">
            <AlertOctagon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-red-200 block mb-0.5">Could Not Process File</strong>
              <span>{validationError}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setValidationError(null)}
            className="text-red-300 hover:text-white p-1 focus:ring-2 focus:ring-rose-500 rounded min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept="image/*,video/*"
        className="hidden"
        aria-label="Upload image or video file"
      />

      {/* LIVE CAMERA MODAL FEED (#2) */}
      {isCameraActive ? (
        <div className="relative rounded-3xl overflow-hidden bg-black border-2 border-rose-500/80 p-4 space-y-4 shadow-2xl animate-fade-in">
          <div className="relative aspect-video bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center">
            <video
              ref={(el) => {
                videoStreamRef.current = el;
                if (el && cameraStream) {
                  el.srcObject = cameraStream;
                  el.play().catch(() => {});
                }
              }}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-slate-950/80 text-rose-400 border border-rose-500/40 text-xs font-mono font-bold px-3 py-1 rounded-full flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span>{t("live_camera_stream")}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={captureCameraFrame}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 text-white font-extrabold text-xs md:text-sm flex items-center gap-2 shadow-xl hover:scale-105 min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none"
            >
              <Camera className="w-4 h-4" />
              <span>{t("capture_specimen")}</span>
            </button>

            <button
              type="button"
              onClick={stopCameraStream}
              className="px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none"
            >
              {t("cancel_camera")}
            </button>
          </div>
        </div>
      ) : !previewUrl ? (
        /* DROPZONE WINDOW */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              fileInputRef.current?.click();
            }
          }}
          className={`relative border-2 border-dashed rounded-3xl p-8 md:p-12 text-center transition-all cursor-pointer overflow-hidden outline-none focus:ring-2 focus:ring-rose-500 ${
            isDragging
              ? "border-rose-500 bg-rose-500/20 scale-[0.99] shadow-[0_0_30px_rgba(244,63,94,0.3)]"
              : "border-slate-700/90 bg-slate-950/70 hover:border-slate-500 hover:bg-slate-800/50 shadow-inner"
          }`}
          aria-label="Dropzone for image or video upload"
        >
          {/* Animated corner scan guides */}
          <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-rose-500/80 rounded-tl-sm motion-reduce:animate-none" />
          <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-rose-500/80 rounded-tr-sm motion-reduce:animate-none" />
          <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-rose-500/80 rounded-bl-sm motion-reduce:animate-none" />
          <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-rose-500/80 rounded-br-sm motion-reduce:animate-none" />

          <div
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500/20 via-amber-500/10 to-slate-800 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/30 shadow-inner transition-transform duration-300 ${
              isDragging ? "scale-125 rotate-6" : "group-hover:scale-110"
            }`}
          >
            <Upload className="w-8 h-8 text-rose-400" />
          </div>

          <p className="text-slate-100 font-extrabold text-base md:text-lg">
            {isDragging ? t("release_file") : t("drag_drop_text")}
          </p>

          {/* Visible Format & Size Hint (#2) */}
          <p className="text-slate-400 text-xs mt-1.5 flex items-center justify-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{t("format_size_hint")}</span>
          </p>

          {/* Action buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={startLiveCamera}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs md:text-sm font-extrabold flex items-center gap-2 shadow-xl shadow-rose-950/60 transition-all hover:scale-105 active:scale-95 min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none"
            >
              <Camera className="w-4 h-4" />
              <span>{t("use_camera")}</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs md:text-sm font-bold flex items-center gap-2 transition-all hover:scale-105 min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none"
            >
              <FileImage className="w-4 h-4 text-amber-400" />
              <span>{t("browse_files")}</span>
            </button>
          </div>
        </div>
      ) : (
        /* MEDIA PREVIEW WINDOW */
        <div className="space-y-5 animate-fade-in">
          <div className="relative rounded-2xl overflow-hidden bg-black/80 border border-slate-700 aspect-video flex items-center justify-center group shadow-2xl">
            {/* Animated Laser Scanning Line during preview */}
            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-rose-500 to-transparent animate-scan z-20 pointer-events-none shadow-[0_0_15px_#f43f5e] motion-reduce:animate-none" />

            {isVideo ? (
              <video src={previewUrl} controls className="max-h-full max-w-full object-contain" />
            ) : (
              <img src={previewUrl} alt="Device specimen capture" className="max-h-full max-w-full object-contain" />
            )}

            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                setPreviewUrl(null);
                setValidationError(null);
              }}
              className="absolute top-3 right-3 bg-slate-950/90 hover:bg-red-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-md border border-slate-700 transition-colors z-30 flex items-center gap-1 min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none"
            >
              <X className="w-3.5 h-3.5" />
              <span>{t("change_media")}</span>
            </button>
          </div>

          {/* File Details */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-200 font-semibold truncate max-w-[200px] md:max-w-[320px]">
                {selectedFile?.name}
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px]">
              {selectedFile && (
                <span className="text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded border border-slate-800">
                  {formatFileSize(selectedFile.size)}
                </span>
              )}
              <span className="font-bold uppercase text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-800">
                {isVideo ? "Video Clip" : "High-Res Photo"}
              </span>
            </div>
          </div>

          {/* Step-by-Step Progress Indicator During Loading (#3) */}
          {isLoading && (
            <div className="bg-slate-950/90 border border-rose-500/30 rounded-2xl p-5 space-y-4 animate-pulse motion-reduce:animate-none">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-rose-400 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-400 motion-reduce:animate-none" />
                  <span>{t("checking_device")}</span>
                </span>
                <span className="text-slate-400 font-mono">Step {loadingStep + 1} of 4</span>
              </div>

              <div className="space-y-1">
                <h4 className="font-extrabold text-white text-sm">{loadingStepsList[loadingStep].title}</h4>
                <p className="text-xs text-slate-400">{loadingStepsList[loadingStep].desc}</p>
              </div>

              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-400 transition-all duration-500 rounded-full"
                  style={{ width: `${((loadingStep + 1) / 4) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-amber-600 to-rose-600 bg-[length:200%_auto] hover:bg-right text-white font-extrabold text-sm md:text-base flex items-center justify-center gap-2 shadow-2xl shadow-rose-950/80 transition-all duration-300 disabled:opacity-50 hover:scale-[1.01] min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-amber-300 motion-reduce:animate-none" />
                <span>{t("checking_device")}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300 animate-bounce motion-reduce:animate-none" />
                <span>{t("run_diagnostic_scan")}</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Embedded Photo Guidance Helper (#2) */}
      <PhotoGuidance />

      {/* Quick Test Samples */}
      <div className="pt-4 border-t border-slate-800">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">
          {t("sample_captures_header")}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => handleSampleClick("mobile_phone")}
            className="p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 text-left text-xs font-medium text-slate-200 transition-all hover:scale-[1.02] group min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none"
          >
            <span className="block text-sky-400 font-bold mb-0.5 flex items-center gap-1.5 group-hover:text-sky-300">
              <Smartphone className="w-3.5 h-3.5" /> {t("sample_mobile")}
            </span>
            <span className="text-[11px] text-slate-400 block">{t("sample_mobile_sub")}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSampleClick("bike_car_vehicle")}
            className="p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 text-left text-xs font-medium text-slate-200 transition-all hover:scale-[1.02] group min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none"
          >
            <span className="block text-amber-400 font-bold mb-0.5 flex items-center gap-1.5 group-hover:text-amber-300">
              <Car className="w-3.5 h-3.5" /> {t("sample_vehicle")}
            </span>
            <span className="text-[11px] text-slate-400 block">{t("sample_vehicle_sub")}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSampleClick("dryer_lint")}
            className="p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 text-left text-xs font-medium text-slate-200 transition-all hover:scale-[1.02] group min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none"
          >
            <span className="block text-emerald-400 font-bold mb-0.5 flex items-center gap-1.5 group-hover:text-emerald-300">
              <HomeIcon className="w-3.5 h-3.5" /> {t("sample_appliance")}
            </span>
            <span className="text-[11px] text-slate-400 block">{t("sample_appliance_sub")}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSampleClick("circuit_breaker")}
            className="p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 text-left text-xs font-medium text-slate-200 transition-all hover:scale-[1.02] group min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none"
          >
            <span className="block text-rose-400 font-bold mb-0.5 flex items-center gap-1.5 group-hover:text-rose-300">
              <Wrench className="w-3.5 h-3.5" /> {t("sample_breaker")}
            </span>
            <span className="text-[11px] text-slate-400 block">{t("sample_breaker_sub")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
