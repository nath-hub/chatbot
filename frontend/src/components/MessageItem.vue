<template>
  <div :class="['message', message.role]">
    <!-- Assistant: avatar/logo on the left, bubble next -->
    <template v-if="message.role === 'assistant'">
      <img class="avatar" src="../assets/logo.jpg" alt="Assistant" />
      <div class="bubble">
        <div v-html="formatted"></div>
        <div class="meta">{{ time }}</div>
      </div>
    </template>

    <!-- User: bubble first, avatar on the right -->
    <template v-else-if="message.role === 'user'">  
      <div class="bubble">
        <div v-html="formatted"></div>
        <div class="meta right">{{ time }}</div>
      </div>
      <img class="avatar" :src="userAvatar" alt="Utilisateur" />
    </template>

    <!-- System or others: just bubble -->
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
import { computed } from "vue";
import type { ChatMessage } from "../services/api";
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
</script>

<style scoped>
.message { display:flex; margin:8px 0; }
.message.user { justify-content: flex-end; }
.message.assistant { justify-content: flex-start; }
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 8px;
  border: 1px solid rgba(0,0,0,0.08);
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.bubble {
  max-width: 70%;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--v-theme-on-surface);
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);

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
.meta.right { text-align: right; }

@keyframes fadeUp {
  0% { opacity: 0; transform: translateY(70px); }
  100% { opacity: 1; transform: translateY(0); }
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
