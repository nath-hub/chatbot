<template>
  <div :class="['message', message.role]">
    <div class="bubble">
      <div v-html="formatted"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ChatMessage } from "../services/api";
const props = defineProps<{ message: ChatMessage }>();
const formatted = computed(() => {
  // Basic formatting: escape + convert newlines to <br>
  const t = props.message.content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return t.replace(/\n/g, "<br>");
});
</script>

<style scoped>
.message { display:flex; margin:8px 0; }
.message.user { justify-content: flex-end; }
.message.assistant { justify-content: flex-start; }
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

@keyframes fadeUp {
  0% { opacity: 0; transform: translateY(70px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* Theme-based colors */
.message.user .bubble {
  background: var(--v-theme-primary);
  color: var(--v-theme-on-primary, #fff);
  border-color: var(--v-theme-primary);
}
.message.assistant .bubble {
  background: var(--v-theme-surface);
  color: var(--v-theme-on-surface);
  border-color: var(--v-theme-on-surface);
}
.message.system .bubble {
  background: var(--v-theme-secondary);
  color: var(--v-theme-on-secondary, #000);
  border-color: var(--v-theme-secondary);
  font-style: italic;
}
</style>
