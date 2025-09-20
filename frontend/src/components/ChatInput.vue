<template>
  <div class="chat-input">
    <div class="suggestions-row">
      <v-btn
        v-for="(q, i) in suggestions"
        :key="i"
        class="suggestion-btn"
        variant="text"
        rounded
        size="small"
        @click="pickSuggestion(q)"
        :title="q"
      >
        {{ shortLabel(q) }}
      </v-btn>
    </div>

    <div class="input-row">
      <textarea
        v-model="text"
        @keydown.enter.exact.prevent="send"
        placeholder="Écris ta question juridique..."
      ></textarea>
      <v-btn
        class="rounded-circle"
        :disabled="!text || loading"
        @click="send"
        icon="mdi-send"
        variant="text"
        style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; color: rgb(var(--v-theme-color-text)); background-color: rgb(var(--v-theme-primary));"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useChatStore } from "../stores/chat";
import { sendChat } from "../services/api";

const store = useChatStore();
const text = ref("");
const loading = ref(false);

// Preset suggestions displayed as circular buttons
const suggestions = ref<string[]>([
  "Quels sont mes droits en tant que locataire ?",
  "Comment créer une SARL ?",
  "Que faire en cas de licenciement abusif ?",
  "Comment rédiger un testament ?",
]);

function pickSuggestion(q: string) {
  text.value = q;
}

function shortLabel(q: string) {
  // Keep labels short for circular buttons
  const max = 22;
  return q.length > max ? q.slice(0, max - 1) + "…" : q;
}

async function send() {
  if (!text.value.trim()) return;
  const userMsg = { role: "user" as "user", content: text.value.trim(), timestamp: Date.now() };
  store.addMessage(userMsg);
  text.value = "";
  loading.value = true;
  store.loading = true;
  try {
    const resp = await sendChat(store.messages);
    // attend un objet { assistant: "..." } ou messages mis à jour
    const assistantContent =
      resp.assistant || resp.text || JSON.stringify(resp);
    store.addMessage({ role: "assistant", content: assistantContent, timestamp: Date.now() });
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
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  margin-bottom: 26px;
  margin-left: 260px;
  margin-right: 260px;
  border-radius: 12px;
  /* border: 1px solid rgb(var(--v-theme-on-surface)); */
  background-color: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-on-surface));
}

.suggestions-row {
  display: flex;
  gap: 9px;
  flex-wrap: wrap;
  align-items: center;
}
.suggestion-btn {
  padding: 6px 12px;
  border: 1px solid rgb(var(--v-theme-secondary));
  border-radius: 9999px;
  color: rgb(var(--v-theme-on-surface));
  background: rgb(var(--v-theme-));
  text-transform: none;
}
textarea {
  flex: 1;
  min-height: 58px;
  resize: vertical;
  background-color: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-on-surface));
  border: 1px solid rgb(var(--v-theme-fade));
  border-radius: 10px;
  padding: 8px;
}

.input-row {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

button:disabled {
  opacity: 1;
  cursor: not-allowed;
}

.custom-class {
  width: 70px;
  height: 80px;
  border-radius: 50px;
  background-color: rgb(var(--v-theme-primary));
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: background-color 0.3s;

  min-width: 30px;
  min-height: 70px; 
}

.custom-class:hover {
  background-color: rgb(var(--v-theme-secondary));
  color: rgb(var(--v-theme-primary));
}
</style>
