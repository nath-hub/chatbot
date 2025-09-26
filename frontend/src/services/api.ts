import axios from "axios";

interface ImportMetaEnv {
  VITE_API_BASE?: string;
}

// Extend the global ImportMeta interface so TypeScript recognizes import.meta.env
declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

// Axios instance available to all API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:3000",
  timeout: 60000,
});

// Helper: try a primary endpoint, fallback to a secondary one
async function withFallback<T>(
  primary: () => Promise<T>,
  fallback: () => Promise<T>
): Promise<T> {
  try {
    return await primary();
  } catch (e: any) {
    const status = e?.response?.status;
    if (status === 404 || status === 405 || status === 500 || !status) {
      return await fallback();
    }
    throw e;
  }
}

// GET all messages
export async function getMessages(): Promise<ChatMessage[]> {
  const fetcher = async (path: string) => {
    const resp = await api.get(path);
    const data = resp.data;
    const arr = Array.isArray(data) ? data : Array.isArray(data?.messages) ? data.messages : [];
    const normalized: ChatMessage[] = arr.map((m: any) => ({
      role: m.role === "assistant" || m.role === "system" ? m.role : "user",
      content: String(m.content ?? ""),
      id: m.id ?? undefined,
      timestamp: typeof m.timestamp === "number" ? m.timestamp : Date.now(),
      saved: true,
    }));
    console.log(normalized);
    return normalized;
  };

  return withFallback(
    () => fetcher("/api/messages"),
    () => fetcher("/messages")
  );
}

// Save a single message
export async function saveMessage(msg: ChatMessage): Promise<{ success: boolean }>{
  const payload = {
    role: msg.role,
    content: msg.content,
    timestamp: msg.timestamp ?? Date.now(),
    id: msg.id,
  };

  const poster = async (path: string) => {
    const resp = await api.post(path, payload);
    return resp.data ?? { success: true };
  };

  return withFallback(
    () => poster("/api/messages"),
    () => poster("/messages")
  );
}

export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
  id?: string;
  timestamp?: number; // epoch ms of when the message was created
  saved?: boolean; // whether this message was persisted server-side
};

export type ChatResponse = { assistant: string };

export async function sendChat(messages: ChatMessage[]): Promise<ChatResponse> {
  // Pick the latest user message as the prompt
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const prompt = lastUser?.content?.trim();
  if (!prompt) {
    throw new Error("Aucun message utilisateur à envoyer");
  }

  try {
    const resp = await api.post("/api/chat", { prompt });
    const data = resp.data ?? {};
    const assistant: string =
      data.assistant || data.reply || data.message || data.text || "";
    if (!assistant) {
      throw new Error("Réponse vide du serveur");
    }
    return { assistant };
  } catch (err: any) {
    const msg = err?.response?.data?.detail || err?.message || "Erreur réseau";
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }
}
