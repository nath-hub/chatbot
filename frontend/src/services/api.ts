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

const API_BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:3000";

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
    const token = localStorage.getItem("token"); // Récupération du token

    const resp = await axios.get(`${API_BASE_URL}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Ajout du token dans l'en-tête
      },
    });

    const data = resp.data;
    const arr = Array.isArray(data)
      ? data
      : Array.isArray(data?.messages)
      ? data.messages
      : [];
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
    () => fetcher("/api/messages")
  );
}

// Save a single message
export async function saveMessage(
  msg: ChatMessage
): Promise<{ success: boolean }> {
  const payload = { 
    role: msg.role,
    user_id: localStorage.getItem("id") || "anonymous", 
    message: msg.content,
    timestamp: msg.timestamp ?? Date.now(),
    metadata: msg.metadata ?? "vide", 
  };
 
  const poster = async (path: string) => { 
    const resp = await api.post(path, payload); 
    return resp.data ?? { success: true };
  }; 

  return withFallback(
    () => poster("/api/messages"),
    () => poster("/api/messages")
  );
}

export type ChatMessage = {
  timestamp?: number; // epoch ms of when the message was created
  saved?: boolean; // whether this message was persisted server-side
  id?: string; // UUID généré côté front ou back 
  user_id?: string; // id de l'utilisateur (optionnel si message GPT)
  role: "user" | "assistant" | "system";
  content: string;
  metadata?: any; // ex: { model: "gpt-4", tokens: 120 }
  created_at?: string; // généré côté backend si non fourni
  updated_at?: string;
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

    const token = localStorage.getItem("token"); // Récupération du token

    const resp = await api.post(
      "/api/chat",
      { prompt }, // Données de la requête
      {
        headers: {
          Authorization: `Bearer ${token}`, // Ajout du token dans l'en-tête
        },
      }
    );

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
