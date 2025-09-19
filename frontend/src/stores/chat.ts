import { defineStore } from "pinia";
import { ref } from "vue";
import type { ChatMessage } from "../services/api";

export const useChatStore = defineStore("chat", () => {
  const messages = ref<ChatMessage[]>([
    { role: "system", content: "Tu es un assistant spécialisé en droit. Réponds de façon claire, neutre et cite les sources si possible." }
  ]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  function addMessage(msg: ChatMessage) {
    messages.value.push(msg);
  }
  function clearMessages() {
    messages.value = [{ role: "system", content: "..." }];
  }

  return { messages, loading, error, addMessage, clearMessages };
});
