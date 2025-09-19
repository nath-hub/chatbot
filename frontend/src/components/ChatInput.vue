<template>
  <div class="chat-input">
    <textarea v-model="text" @keydown.enter.exact.prevent="send" placeholder="Écris ta question juridique..."></textarea>
    <button :disabled="!text || loading" @click="send">Envoyer</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useChatStore } from "../stores/chat";
import { sendChat } from "../services/api";

const store = useChatStore();
const text = ref("");
const loading = ref(false);

async function send() {
  if (!text.value.trim()) return;
  const userMsg = { role: "user" as "user", content: text.value.trim() };
  store.addMessage(userMsg);
  text.value = "";
  loading.value = true;
  store.loading = true;
  try {
    const resp = await sendChat(store.messages);
    // attend un objet { assistant: "..." } ou messages mis à jour
    const assistantContent = resp.assistant || resp.text || JSON.stringify(resp);
    store.addMessage({ role: "assistant", content: assistantContent });
  } catch (err: any) {
    store.error = err?.message || "Erreur serveur";
  } finally {
    loading.value = false;
    store.loading = false;
  }
}
</script>

<style scoped>
.chat-input {
  display: flex;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid var(--v-theme-on-surface);
  background-color: var(--v-theme-surface);
  color: var(--v-theme-on-surface);
}
textarea {
  flex: 1;
  min-height: 48px;
  resize: vertical;
  background-color: var(--v-theme-surface);
  color: var(--v-theme-on-surface);
  border: 1px solid var(--v-theme-on-surface);
  border-radius: 6px;
  padding: 8px;
}
button {
  width: 110px;
  background-color: var(--v-theme-primary);
  color: var(--v-theme-on-primary, #fff);
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
