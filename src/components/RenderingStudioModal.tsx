import React, { useState } from "react";
import {
  X,
  Sparkles,
  Palette,
  Image as ImageIcon,
  Download,
  Upload,
  Layers,
  Sun,
  Camera,
  Loader2,
  Check,
  RefreshCw,
  ArrowRight,
  Maximize2,
  Film,
} from "lucide-react";
import { generate3DRendering, edit3DRendering } from "../services/geminiService";

interface RenderingStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenVideoStudioWithImage?: (imageUrl: string) => void;
}

const STYLE_PRESETS = [
  { id: "modern_timber", label: "Pacific Northwest Timber & Glass", desc: "Warm cedar siding, dark steel frames, generous glass glazing" },
  { id: "scandinavian_adu", label: "Scandinavian Minimalist ADU", desc: "Clean pale wood cladding, standing seam metal roof, large sliding doors" },
  { id: "brutalist_concrete", label: "Board-Formed Concrete Villa", desc: "Textured architectural concrete, cantilevered planes, deep overhangs" },
  { id: "coastal_contemporary", label: "Contemporary Coastal Residence", desc: "White stucco, ipe hardwood decking, panoramic oceanfront balconies" },
  { id: "commercial_restaurant", label: "Modern Architectural Pavilion", desc: "Commercial curtain wall glazing, exposed steel trusses, polished concrete" },
];

const LIGHTING_PRESETS = [
  { id: "golden_hour", label: "Golden Hour (Warm Sunset Glow)" },
  { id: "dramatic_dusk", label: "Dramatic Twilight / Dusk (Interior Uplighting)" },
  { id: "soft_overcast", label: "Soft Diffused Overcast (True Material Fidelity)" },
  { id: "crisp_daylight", label: "Crisp Midday Sun (Sharp Architectural Shadows)" },
];

export const RenderingStudioModal: React.FC<RenderingStudioModalProps> = ({
  isOpen,
  onClose,
  onOpenVideoStudioWithImage,
}) => {
  const [activeTab, setActiveTab] = useState<"create" | "edit">("create");

  // Create Mode state
  const [prompt, setPrompt] = useState(
    "Modern two-story cantilevered residential home nestled in a pine forest, floor-to-ceiling glass corner windows, blackened timber slats, concrete foundation terrace."
  );
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "4:3" | "1:1" | "9:16">("16:9");
  const [selectedStyle, setSelectedStyle] = useState("modern_timber");
  const [selectedLighting, setSelectedLighting] = useState("golden_hour");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // Edit Mode state
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState(
    "Change the exterior siding from cedar to dark charred shou sugi ban wood, and add solar panels across the standing seam roof."
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editedImage, setEditedImage] = useState<string | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setErrorMsg(null);

    const styleObj = STYLE_PRESETS.find((s) => s.id === selectedStyle);
    const lightingObj = LIGHTING_PRESETS.find((l) => l.id === selectedLighting);

    try {
      const res = await generate3DRendering({
        prompt,
        aspectRatio,
        style: styleObj ? `${styleObj.label} (${styleObj.desc})` : "Modern Architectural",
        lighting: lightingObj ? lightingObj.label : "Golden Hour",
      });
      setGeneratedImage(res.imageUrl);
    } catch (err: any) {
      console.error("Rendering generation failed:", err);
      setErrorMsg(err.message || "Failed to generate 3D rendering. Check Gemini API key in settings.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSourceImage(reader.result as string);
        setEditedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!sourceImage || !editPrompt.trim() || isEditing) return;
    setIsEditing(true);
    setErrorMsg(null);

    try {
      const res = await edit3DRendering({
        imageBase64: sourceImage,
        editPrompt,
        aspectRatio,
      });
      setEditedImage(res.imageUrl);
    } catch (err: any) {
      console.error("Rendering edit failed:", err);
      setErrorMsg(err.message || "Failed to modify rendering with Gemini.");
    } finally {
      setIsEditing(false);
    }
  };

  const downloadImage = (dataUrl: string, filename: string) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendToVideo = (imgUrl: string) => {
    if (onOpenVideoStudioWithImage) {
      onOpenVideoStudioWithImage(imgUrl);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[880px] bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:px-6 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-neutral-100">
                  Architectural 3D Concept Studio
                </h2>
                <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                  gemini-3.1-flash-image
                </span>
              </div>
              <p className="text-xs text-neutral-400 hidden sm:block">
                Generate and edit photorealistic architectural exterior and interior concepts using text prompts
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Tabs */}
            <div className="flex items-center bg-neutral-900 p-1 rounded-lg border border-neutral-800 text-xs">
              <button
                onClick={() => setActiveTab("create")}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                  activeTab === "create"
                    ? "bg-amber-500 text-neutral-950 shadow-sm"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                Create New
              </button>
              <button
                onClick={() => setActiveTab("edit")}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                  activeTab === "edit"
                    ? "bg-amber-500 text-neutral-950 shadow-sm"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                Modify / Edit Existing
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Error notification banner */}
        {errorMsg && (
          <div className="px-6 py-2.5 bg-red-950/80 border-b border-red-500/40 text-red-200 text-xs flex items-center justify-between">
            <span>⚠️ {errorMsg}</span>
            <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-red-200 ml-2">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-5">
            {activeTab === "create" ? (
              <>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                    Architectural Vision & Description
                  </label>
                  <textarea
                    rows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe building typology, materials, massing, and surroundings..."
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm text-neutral-100 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                  />
                </div>

                {/* Style Presets */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Architectural Typology & Aesthetic
                  </label>
                  <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                    {STYLE_PRESETS.map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setSelectedStyle(st.id)}
                        className={`w-full text-left p-2 rounded-lg border text-xs transition-all ${
                          selectedStyle === st.id
                            ? "bg-amber-500/10 border-amber-500/50 text-amber-300"
                            : "bg-neutral-950/70 border-neutral-800/80 text-neutral-400 hover:border-neutral-700"
                        }`}
                      >
                        <div className="font-semibold">{st.label}</div>
                        <div className="text-[11px] text-neutral-500 mt-0.5">{st.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lighting Presets */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                    Lighting & Atmosphere
                  </label>
                  <select
                    value={selectedLighting}
                    onChange={(e) => setSelectedLighting(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
                  >
                    {LIGHTING_PRESETS.map((lt) => (
                      <option key={lt.id} value={lt.id}>
                        {lt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Aspect Ratio Selector */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                    Framing Aspect Ratio
                  </label>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    {[
                      { id: "16:9", label: "16:9", desc: "Wide Landscape" },
                      { id: "4:3", label: "4:3", desc: "Arch Standard" },
                      { id: "1:1", label: "1:1", desc: "Square" },
                      { id: "9:16", label: "9:16", desc: "Vertical" },
                    ].map((ar) => (
                      <button
                        key={ar.id}
                        type="button"
                        onClick={() => setAspectRatio(ar.id as any)}
                        className={`p-2 rounded-lg border text-center transition-all ${
                          aspectRatio === ar.id
                            ? "bg-amber-500 text-neutral-950 font-bold border-amber-500"
                            : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200"
                        }`}
                      >
                        <div className="text-xs">{ar.label}</div>
                        <div className="text-[9px] opacity-80">{ar.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-neutral-950 font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-neutral-950" />
                      <span>Synthesizing 3D Architectural Concept...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-neutral-950" />
                      <span>Generate Architectural Rendering</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                {/* Edit Tab Controls */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Source Architectural Image or Drawing
                  </label>
                  
                  {sourceImage ? (
                    <div className="relative rounded-xl border border-neutral-800 overflow-hidden bg-neutral-950 p-2 flex items-center space-x-3">
                      <img
                        src={sourceImage}
                        alt="Source"
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 text-xs">
                        <div className="text-neutral-200 font-semibold">Image Loaded</div>
                        <div className="text-neutral-500 text-[11px]">Ready for Gemini modification</div>
                      </div>
                      <label className="text-xs font-semibold text-amber-400 hover:underline cursor-pointer">
                        Replace
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-neutral-700 hover:border-amber-500/60 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-neutral-950/50">
                      <Upload className="w-8 h-8 text-neutral-500 mb-2" />
                      <span className="text-xs font-semibold text-neutral-300">
                        Upload sketch, CAD elevation, or 3D render
                      </span>
                      <span className="text-[11px] text-neutral-500 mt-0.5">
                        PNG, JPG, WebP supported
                      </span>
                      {generatedImage && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setSourceImage(generatedImage);
                          }}
                          className="mt-3 px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-amber-300 text-xs rounded-lg border border-neutral-700"
                        >
                          Use previously generated render
                        </button>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                    Modification Instructions (Text-to-Edit)
                  </label>
                  <textarea
                    rows={4}
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder="Specify exact material, facade, lighting, or structural changes..."
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm text-neutral-100 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                  />
                  <div className="text-[11px] text-neutral-500 mt-1">
                    Tip: "Change daylight to sunset twilight", "Add solar array to roof", "Replace brick with white stucco".
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleEdit}
                  disabled={isEditing || !sourceImage || !editPrompt.trim()}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-neutral-950 font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  {isEditing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-neutral-950" />
                      <span>Applying Architectural Modifications...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-neutral-950" />
                      <span>Apply Architectural Edit</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>

          {/* Preview / Output Column */}
          <div className="lg:col-span-7 flex flex-col justify-center items-center bg-neutral-950/80 rounded-xl border border-neutral-800/80 p-4 relative overflow-hidden min-h-[380px]">
            {activeTab === "create" ? (
              generatedImage ? (
                <div className="w-full flex flex-col items-center space-y-4">
                  <div className="relative rounded-lg overflow-hidden border border-neutral-800 shadow-2xl max-h-[500px] group">
                    <img
                      src={generatedImage}
                      alt="Generated Architectural Concept"
                      className="w-full h-auto object-contain rounded-lg max-h-[500px]"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => downloadImage(generatedImage, `architectural_concept_${Date.now()}.png`)}
                      className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>Download High-Res PNG</span>
                    </button>

                    <button
                      onClick={() => {
                        setSourceImage(generatedImage);
                        setActiveTab("edit");
                      }}
                      className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-colors"
                    >
                      <Palette className="w-3.5 h-3.5 text-amber-400" />
                      <span>Send to Edit Studio</span>
                    </button>

                    {onOpenVideoStudioWithImage && (
                      <button
                        onClick={() => handleSendToVideo(generatedImage)}
                        className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 transition-all shadow-md"
                      >
                        <Film className="w-3.5 h-3.5" />
                        <span>Generate Veo Video Walkthrough</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 max-w-sm">
                  <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto mb-4 text-neutral-500">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-200 mb-1">
                    Ready to Generate 3D Concept
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Select an architectural typology or describe your design to synthesize high-definition visualizations using gemini-3.1-flash-image.
                  </p>
                </div>
              )
            ) : editedImage ? (
              <div className="w-full flex flex-col items-center space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] font-mono text-neutral-400 mb-1">Original</span>
                    <img
                      src={sourceImage!}
                      alt="Original"
                      className="w-full h-auto max-h-[340px] object-contain rounded-lg border border-neutral-800"
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] font-mono text-amber-400 font-bold mb-1">
                      Gemini Modified
                    </span>
                    <img
                      src={editedImage}
                      alt="Edited"
                      className="w-full h-auto max-h-[340px] object-contain rounded-lg border border-amber-500/40 shadow-xl"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => downloadImage(editedImage, `architectural_edited_${Date.now()}.png`)}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>Download Modified PNG</span>
                  </button>

                  {onOpenVideoStudioWithImage && (
                    <button
                      onClick={() => handleSendToVideo(editedImage)}
                      className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 transition-all shadow-md"
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span>Animate in Veo Video</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center p-8 max-w-sm">
                <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto mb-4 text-neutral-500">
                  <Palette className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-200 mb-1">
                  Upload & Edit Architectural Renderings
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Provide an existing concept drawing or 3D view and instruct Gemini to modify facades, glazing, lighting, or materials.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
