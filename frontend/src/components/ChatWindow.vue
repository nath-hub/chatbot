<template>
  <div class="app-shell">
    <!-- <Sidebar /> -->
    <main class="chat-area">
      <div class="header" ref="headerRef" :class="{ animate: isVisible }">
        <div class="header-logo">
          <img src="../assets/logo.jpg" alt="Logo" class="logo-img" />
        </div>

        <div class="header-text">
          <h2>Legal Chat IA</h2>
          <p>Assistante juridique intelligente</p>
        </div>
      </div>

      <div class="messages" ref="msgs">
        <MessageItem v-for="(m, i) in store.messages" :key="i" :message="m" />
      </div>

      <ChatInput />
    </main>
    <!-- <myContentDrawer  /> -->
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
// import Sidebar from "./Sidebar.vue";
import MessageItem from "./MessageItem.vue";
import ChatInput from "./ChatInput.vue";
import { useChatStore } from "../stores/chat";
import myContentDrawer from "./Drawer.vue";

const headerRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);

const store = useChatStore();
const msgs = ref<HTMLElement | null>(null);

// scroll to bottom when new message (if you want)
watch(
  () => store.messages.length,
  () => {
    // scroll only if not desired? ici on scroll pour expérience chat
    setTimeout(() => {
      msgs.value?.scrollTo({
        top: msgs.value.scrollHeight,
        behavior: "smooth",
      });
    }, 50);
  }
);

onMounted(() => {
  if (headerRef.value) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          isVisible.value = true;
        }
      },
      { threshold: 0.2 } // déclenche à 20% visible
    );
    observer.observe(headerRef.value);
  }
});
</script>

<style scoped>
.app-shell {
  display: flex;
  height: 100vh;
  width: 100%;
}
.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  /* Follow theme background by default */
  background-color: var(--v-theme-background);
  color: var(--v-theme-on-background);
}
.messages {
  margin-left: 260px;
  margin-right: 260px;
  flex: 1;
  padding: 26px;
  overflow: auto;
  /* border: 1px solid #3a2828; */
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.15);
   
  color: var(--v-theme-on-surface);
  /* background-color: var(--v-theme-surface); */
  background-image: linear-gradient(
    to left,
    var(--v-theme-background),
    var(--v-theme-secondary)
  );
 
} 

.header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-left: 10px;
  padding-top: 10px;
  border-bottom: 1px solid #eee;
  color: var(--v-theme-on-background);

  opacity: 0;
  transform: translateY(70px);
  transition: all 0.8s ease-out;
}
.header-logo .logo-img {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #eaeaecf5;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.header.animate {
  opacity: 1;
  transform: translateY(0);
}
</style>
