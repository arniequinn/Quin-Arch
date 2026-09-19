import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Film,
  Sparkles,
  Upload,
  Download,
  Play,
  RotateCcw,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Monitor,
  Smartphone,
  Video,
} from "lucide-react";
import {
  startVeoVideo,
  checkVeoStatus,
  downloadVeoVideoBlob,
} from "../services/geminiService";

interface VideoWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialImage?: string | null;
}

const MOTION_PRESETS = [
  "Slow cinematic drone orbit around the modern exterior facade at golden hour, realistic lighting and reflections.",
  "Smooth forward dolly walkthrough through the main living room and out onto the cantilevered deck overlooking the landscape.",
  "Dramatic upward crane shot revealing the two-story glass corner and standing-seam timber roof against sunset clouds.",
  "Street-level architectural camera tracking shot showcasing the landscaping, driveway, and modern entry foyer.",
];

export const VideoWalkthroughModal: React.FC<VideoWalkthroughModalProps> = ({
  isOpen,
  onClose,
  initialImage,
}) => {
  const [sourceImage, setSourceImage] = useState<string | null>(initialImage || null);
  const [prompt, setPrompt] = useState(
    "Slow cinematic 3D architectural camera orbit showcasing the building facade, warm sunlight shifting across materials, photorealistic video."
  );
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16">("16:9");

  const [operationName, setOperationName] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStage, setProgressStage] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const pollIntervalRef = useRef<any>(null);

  useEffect(() => {
    if (initialImage) {
      setSourceImage(initialImage);
    }
  }, [initialImage]);

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSourceImage(reader.result as string);
        setVideoUrl(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartGeneration = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setErrorMsg(null);
    setVideoUrl(null);
    setProgressStage("Submitting request to Veo 3.1 video generation model...");

    try {
      const res = await startVeoVideo({
        prompt: prompt.trim(),
        imageBase64: sourceImage || undefined,
        aspectRatio,
      });

      setOperationName(res.operationName);
      setProgressStage("Veo 3.1 is synthesizing camera motion and temporal 3D geometry...");

      // Begin polling status every 7 seconds
      const opName = res.operationName;
      let attempts = 0;
      const maxAttempts = 60; // Up to 7 minutes

      pollIntervalRef.current = setInterval(async () => {
        attempts++;
        try {
          // Dynamic phased messages to inform the user of progress
          if (attempts === 2) setProgressStage("Simulating ray-traced shadows and material motion...");
          if (attempts === 5) setProgressStage("Rendering cinematic 60fps frames and depth maps...");
          if (attempts === 9) setProgressStage("Encoding high-definition video stream...");

          const status = await checkVeoStatus(opName);

          if (status.done) {
            clearInterval(pollIntervalRef.current);
            if (status.error) {
              throw new Error(status.error.message || "Video generation failed");
            }
            setProgressStage("Downloading generated MP4 video...");
            const blob = await downloadVeoVideoBlob(opName);
            const objectUrl = URL.createObjectURL(blob);
            setVideoUrl(objectUrl);
            setIsGenerating(false);
            setProgressStage("Video generation complete!");
          }

          if (attempts >= maxAttempts) {
            clearInterval(pollIntervalRef.current);
            throw new Error("Video generation timed out. Please try a simpler motion prompt or check again.");
          }
        } catch (pollErr: any) {
          clearInterval(pollIntervalRef.current);
          setIsGenerating(false);
          setErrorMsg(pollErr.message || "Failed during video status polling.");
        }
      }, 7000);
    } catch (err: any) {
      setIsGenerating(false);
      setErrorMsg(err.message || "Failed to start Veo video generation. Check your Gemini API key.");
    }
  };

  const handleDownloadVideo = () => {
    if (!videoUrl) return;
    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = `architectural_walkthrough_${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[880px] bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:px-6 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-neutral-100">
                  Veo 3D Architectural Walkthrough Studio
                </h2>
                <span className="text-[11px] font-mono text-orange-400 bg-orange-500/10 border border-orange-500/30 px-2 py-0.5 rounded">
                  veo-3.1-fast-generate-preview
                </span>
              </div>
              <p className="text-xs text-neutral-400 hidden sm:block">
                Transform architectural photos and 3D renderings into cinematic high-definition video walkthroughs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="px-6 py-2.5 bg-red-950/80 border-b border-red-500/40 text-red-200 text-xs flex items-center justify-between">
            <span>⚠️ {errorMsg}</span>
            <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-red-200 ml-2">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Studio Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-5">
            {/* Image Upload */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                Source Architectural Photo or Rendering (Optional)
              </label>
              {sourceImage ? (
                <div className="relative rounded-xl border border-neutral-800 overflow-hidden bg-neutral-950 p-2 flex items-center space-x-3">
                  <img
                    src={sourceImage}
                    alt="Source"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 text-xs">
                    <div className="text-neutral-200 font-semibold">Photo Attached</div>
                    <div className="text-neutral-500 text-[11px]">Veo will animate from this viewpoint</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSourceImage(null)}
                    className="text-xs text-red-400 hover:underline mr-2"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-neutral-700 hover:border-orange-500/60 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors bg-neutral-950/50">
                  <Upload className="w-7 h-7 text-neutral-500 mb-1.5" />
                  <span className="text-xs font-semibold text-neutral-300">
                    Upload architectural elevation or 3D render
                  </span>
                  <span className="text-[11px] text-neutral-500 mt-0.5">
                    Or leave empty to generate purely from text prompt
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Motion & Camera Prompt */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Camera Motion & Cinematic Prompt
              </label>
              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the camera trajectory, orbit, speed, and environmental atmosphere..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm text-neutral-100 focus:outline-none focus:border-orange-500 transition-colors resize-none"
              />
            </div>

            {/* Motion Presets */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Architectural Camera Presets
              </label>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {MOTION_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(preset)}
                    className="w-full text-left p-2 rounded-lg border border-neutral-800/80 bg-neutral-950/70 hover:border-neutral-700 text-[11px] text-neutral-400 hover:text-neutral-200 transition-all line-clamp-2"
                  >
                    "{preset}"
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio Selector */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Video Aspect Ratio
              </label>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setAspectRatio("16:9")}
                  className={`p-3 rounded-xl border flex items-center justify-center space-x-2 transition-all ${
                    aspectRatio === "16:9"
                      ? "bg-orange-500 text-neutral-950 font-bold border-orange-500 shadow-md shadow-orange-500/20"
                      : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                  <div className="text-left">
                    <div className="text-xs">16:9 Landscape</div>
                    <div className="text-[10px] opacity-80">Desktop & Presentations</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAspectRatio("9:16")}
                  className={`p-3 rounded-xl border flex items-center justify-center space-x-2 transition-all ${
                    aspectRatio === "9:16"
                      ? "bg-orange-500 text-neutral-950 font-bold border-orange-500 shadow-md shadow-orange-500/20"
                      : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <div className="text-left">
                    <div className="text-xs">9:16 Portrait</div>
                    <div className="text-[10px] opacity-80">Reels & Mobile Showcase</div>
                  </div>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleStartGeneration}
              disabled={isGenerating}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 disabled:opacity-50 text-neutral-950 font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-neutral-950" />
                  <span>Veo 3.1 Rendering Walkthrough...</span>
                </>
              ) : (
                <>
                  <Video className="w-4 h-4 text-neutral-950" />
                  <span>Generate Veo Architectural Video</span>
                </>
              )}
            </button>
          </div>

          {/* Video Player / Generation Display Column */}
          <div className="lg:col-span-7 flex flex-col justify-center items-center bg-neutral-950/80 rounded-xl border border-neutral-800/80 p-4 relative overflow-hidden min-h-[380px]">
            {isGenerating ? (
              <div className="text-center p-8 max-w-md space-y-4">
                <div className="w-20 h-20 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mx-auto text-orange-400 animate-pulse">
                  <Film className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-100 mb-1">
                    Veo 3.1 Video Synthesis in Progress
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed font-mono">
                    {progressStage}
                  </p>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full animate-[shimmer_2s_infinite]" />
                </div>
                <p className="text-[11px] text-neutral-500">
                  Video synthesis typically takes 60–120 seconds. Please keep this modal open.
                </p>
              </div>
            ) : videoUrl ? (
              <div className="w-full flex flex-col items-center space-y-4">
                <div
                  className={`relative rounded-xl overflow-hidden border border-neutral-800 shadow-2xl bg-black ${
                    aspectRatio === "9:16" ? "max-h-[520px] max-w-[290px]" : "w-full max-h-[480px]"
                  }`}
                >
                  <video
                    src={videoUrl}
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleDownloadVideo}
                    className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-neutral-950 font-bold text-xs rounded-xl flex items-center space-x-2 transition-all shadow-md shadow-orange-500/20"
                  >
                    <Download className="w-4 h-4 text-neutral-950" />
                    <span>Download Walkthrough MP4</span>
                  </button>

                  <button
                    onClick={() => {
                      setVideoUrl(null);
                      handleStartGeneration();
                    }}
                    className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Regenerate Variation</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 max-w-sm">
                <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto mb-4 text-neutral-500">
                  <Video className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-200 mb-1">
                  Veo 3D Architectural Cinematic Video
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Upload an elevation or 3D render and specify camera movement to produce fluid 720p walkthrough videos in landscape (16:9) or vertical presentation (9:16).
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
