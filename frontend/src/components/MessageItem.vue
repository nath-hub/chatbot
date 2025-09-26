<template>
  <div :class="['message', message.role]">
    <template v-if="message.role === 'assistant'">
      <img class="avatar" src="../assets/logo.jpg" alt="Assistant" />
      <div class="bubble"> 
        <div v-if="message.loading" class="loader">
          <span></span><span></span><span></span>
        </div>
        <div v-else v-html="formatted"></div>
        <div class="meta">{{ time }}</div>
      </div>
    </template>

     
    <template v-else-if="message.role === 'user'">
      <div class="bubble">
        <div v-html="formatted"></div>
        <div class="meta right">{{ time }}</div>
      </div>
      <img class="avatar" :src="userAvatar" alt="Utilisateur" />
    </template>

   
    <template v-else>
      <img class="avatar" src="../assets/logo.jpg" alt="Assistant" />
      <div class="bubble">
        <div v-html="formatted"></div>
        <div class="meta">{{ time }}</div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch, ref } from "vue";
import type { ChatMessage } from "../services/api";
import { saveMessage } from "../services/api";
import girl from "../assets/girl.jpg";
const props = defineProps<{ message: ChatMessage }>();
const formatted = computed(() => {
  // Basic formatting: escape + convert newlines to <br>
  const t = props.message.content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return t.replace(/\n/g, "<br>");
});

const time = computed(() => {
  const ts = props.message.timestamp ?? Date.now();
  const d = new Date(ts);
  try {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return `${d.getHours().toString().padStart(2, "0")}:${d
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  }
});

const userAvatar = girl;

// Persist message once (user/assistant only), avoid duplicates
const savedOnce = ref(false);

async function tryPersistMessage(msg: ChatMessage) {
  try {
    if (savedOnce.value) return;
    if (msg.saved) return; // already persisted
    if (!msg || !msg.content || !(msg.role === "user" || msg.role === "assistant")) return;
    await saveMessage(msg);
    savedOnce.value = true;
    // Mark as saved to prevent other components from resaving
    // Mutating prop's nested field is acceptable here since the object comes from the store
    (msg as any).saved = true;
  } catch (e) {
    // Silently ignore persistence errors for now; can add UI later
    // console.error("Failed to save message", e);
  }
}

onMounted(() => {
  tryPersistMessage(props.message);
});

watch(
  () => [props.message.content, props.message.role],
  () => {
    tryPersistMessage(props.message);
  }
);
</script>

<style scoped>
.loader {
  display: flex;
  gap: 4px;
}
.loader span {
  width: 6px;
  height: 6px;
  background: #555;
  border-radius: 50%;
  display: inline-block;
  animation: bounce 1.2s infinite ease-in-out;
}
.loader span:nth-child(1) {
  animation-delay: 0s;
}
.loader span:nth-child(2) {
  animation-delay: 0.2s;
}
.loader span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.message {
  display: flex;
  margin: 8px 0;
}
.message.user {
  justify-content: flex-end;
}
.message.assistant {
  justify-content: flex-start;
}
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 8px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}
.bubble {
  max-width: 70%;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--v-theme-on-surface);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  /* Animation: opacity 0 -> 1, translateY(70px) -> 0 */
  opacity: 0;
  transform: translateY(70px);
  transition: all 0.8s ease-out;
  animation: fadeUp 0.8s ease-out forwards;
}

.meta {
  margin-top: 6px;
  font-size: 11px;
  color: rgb(var(--v-theme-on-surface));
}
.meta.right {
  text-align: right;
}

@keyframes fadeUp {
  0% {
    opacity: 0;
    transform: translateY(70px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Theme-based colors */
.message.user .bubble {
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
  border-color: rgb(var(--v-theme-primary));
}
.message.assistant .bubble {
  background: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-on-surface));
  border-color: rgb(var(--v-theme-on-surface));
}
.message.system .bubble {
  background: rgb(var(--v-theme-secondary));
  color: rgb(var(--v-theme-on-secondary));
  border-color: rgb(var(--v-theme-secondary));
  font-style: italic;
}
</style>
