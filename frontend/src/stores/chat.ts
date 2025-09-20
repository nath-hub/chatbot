import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { ChatMessage } from "../services/api";

export const useChatStore = defineStore("chat", () => {
  type Conversation = {
    id: string;
    title: string; // short title
    messages: ChatMessage[];
    createdAt: number;
  };

  // Initialize with a single default conversation from previous structure
  const initialSystem: ChatMessage = {
    role: "system",
    content:
      "Tu es un assistant spécialisé en droit. Réponds de façon claire, neutre et cite les sources si possible.",
  };

  const conversations = ref<Conversation[]>([
    {
      id: cryptoRandomId(),
      title: "Nouvelle conversation",
      messages: [initialSystem],
      createdAt: Date.now(),
    },
  ]);
  const activeId = ref<string>(conversations.value[0].id);

  const loading = ref(false);
  const error = ref<string | null>(null);

  const activeConversation = computed(() =>
    conversations.value.find((c) => c.id === activeId.value) || conversations.value[0]
  );
  const messages = computed<ChatMessage[]>(() => activeConversation.value.messages);

  function cryptoRandomId() {
    // Simple random ID; replace with better UUID if needed
    return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  }

  function deriveTitleFromMessages(msgs: ChatMessage[]): string {
    const firstUser = msgs.find((m) => m.role === "user");
    if (!firstUser) return "Nouvelle conversation";
    const t = firstUser.content.trim().replace(/\s+/g, " ");
    return t.length > 32 ? t.slice(0, 32) + "…" : t || "Nouvelle conversation";
  }

  function addMessage(msg: ChatMessage) {
    activeConversation.value.messages.push(msg);
    // If no user title yet, try derive from first user message
    if (msg.role === "user") {
      activeConversation.value.title = deriveTitleFromMessages(activeConversation.value.messages);
    }
  }

  // function clearMessages() {
  //   // Clears current conversation to a fresh system-only state
  //   activeConversation.value.messages = [{ role: "system", content: "..." }];
  //   activeConversation.value.title = "Nouvelle conversation";
  // }

  function newConversation(systemContent?: string) {
    const sys: ChatMessage = { role: "system", content: systemContent ?? initialSystem.content };
    const conv: Conversation = {
      id: cryptoRandomId(),
      title: "Nouvelle conversation",
      messages: [sys],
      createdAt: Date.now(),
    };
    conversations.value.unshift(conv);
    activeId.value = conv.id;
    return conv.id;
  }

  function setActive(id: string) {
    if (conversations.value.some((c) => c.id === id)) {
      activeId.value = id;
    }
  }

  return {
    // state
    conversations,
    activeId,
    messages,
    loading,
    error,
    // actions
    addMessage,
    // clearMessages,
    newConversation,
    setActive,
  };
});
