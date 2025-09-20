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

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:3000",
  timeout: 60000,
});

export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
  id?: string;
  timestamp?: number; // epoch ms of when the message was created
};

export async function sendChat(messages: ChatMessage[]) {
  // attend un body {messages, systemPrompt?}
  const resp = await api.post("/api/chat", { messages });
  return resp.data;
}
