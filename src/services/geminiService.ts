// Gemini Architectural AI Client Services

export type ModelTier = "fast" | "flash" | "pro";
export type GroundingMode = "none" | "search" | "maps";
export type ArchitecturalRole = "architect" | "code_specialist" | "cost_estimator";

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
  groundingMetadata?: {
    webSearchQueries?: string[];
    groundingChunks?: Array<{
      web?: { uri: string; title: string };
      maps?: { uri: string; title: string; placeId?: string };
    }>;
    groundingSupports?: any[];
  };
  modelUsed?: string;
}

export async function sendChatMessage(params: {
  messages: { role: string; content: string }[];
  modelTier?: ModelTier;
  groundingMode?: GroundingMode;
  role?: ArchitecturalRole;
}): Promise<{
  text: string;
  modelUsed: string;
  groundingMetadata?: any;
}> {
  const res = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Server responded with status ${res.status}`);
  }

  return await res.json();
}

export async function generate3DRendering(params: {
  prompt: string;
  aspectRatio?: "16:9" | "4:3" | "1:1" | "9:16";
  style?: string;
  lighting?: string;
}): Promise<{
  imageUrl: string;
  prompt: string;
  aspectRatio: string;
}> {
  const res = await fetch("/api/ai/generate-rendering", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Failed to generate 3D rendering (${res.status})`);
  }

  return await res.json();
}

export async function edit3DRendering(params: {
  imageBase64: string;
  editPrompt: string;
  aspectRatio?: "16:9" | "4:3" | "1:1" | "9:16";
}): Promise<{
  imageUrl: string;
  editPrompt: string;
}> {
  const res = await fetch("/api/ai/edit-rendering", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Failed to edit rendering (${res.status})`);
  }

  return await res.json();
}

export async function startVeoVideo(params: {
  prompt: string;
  imageBase64?: string;
  aspectRatio?: "16:9" | "9:16";
}): Promise<{
  operationName: string;
  modelUsed: string;
}> {
  const res = await fetch("/api/ai/video-start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Failed to initiate Veo video (${res.status})`);
  }

  return await res.json();
}

export async function checkVeoStatus(operationName: string): Promise<{
  done: boolean;
  error?: any;
}> {
  const res = await fetch("/api/ai/video-status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ operationName }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to check video status");
  }

  return await res.json();
}

export async function downloadVeoVideoBlob(operationName: string): Promise<Blob> {
  const res = await fetch("/api/ai/video-download", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ operationName }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to download video stream");
  }

  return await res.blob();
}
