<template>
  <div class="app-shell">
    <v-app-bar :elevation="2" style="height: 80px">
      <template v-slot:prepend>
        <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
      </template>

      <v-app-bar-title class="d-flex align-center">
        <transition name="fade-slide" appear>
          <div class="header">
            <div class="header-logo">
              <img src="../assets/logo.jpg" alt="Logo" class="logo-img" />
            </div>
            <div class="header-text">
              <h3>Legal Chat IA</h3>
              <p>Assistante juridique intelligente</p>
            </div>
          </div>
        </transition>
      </v-app-bar-title>

      <template v-slot:append>
        
        <v-btn icon="mdi-magnify" class="ml-12 mt-6"></v-btn>

        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn  class="ml-12 mt-6" icon="mdi-dots-vertical" v-bind="props"></v-btn>
          </template>

          <v-list>
            <v-list-item @click="goProfile">
              <v-list-item-title>Profil</v-list-item-title>
            </v-list-item>
            <v-list-item @click="goSettings">
              <v-list-item-title>Paramètres</v-list-item-title>
            </v-list-item>
            <v-list-item @click="logout">
              <v-list-item-title>Déconnexion</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-app-bar>

    <!-- <Sidebar /> -->
    <main class="chat-area">
      <div class="messages" ref="msgs">
        <MessageItem v-for="(m, i) in store.messages" :key="i" :message="m" />
      </div>

      <ChatInput />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue"; 
import MessageItem from "./MessageItem.vue";
import ChatInput from "./ChatInput.vue";
import { useChatStore } from "../stores/chat"; 
import { getMessages } from "../services/api";

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
  // Load existing messages once at app start
  (async () => {
    try {
      // If we only have the initial system message, populate from backend
      if (store.messages.length <= 1) {
        const msgs = await getMessages();
        msgs.forEach((m) => {
          // Mark as saved to prevent resaving by MessageItem
          m.saved = true;
          store.addMessage(m);
        });
      }
    } catch (e) {
      // optional: set a store error
      store.error = (e as any)?.message || "Impossible de charger les messages";
    }
  })();
});
</script>

<style scoped>
.app-shell {
  display: flex;
  height: 90vh;
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

  /* opacity: 0;
  transform: translateY(70px);
  transition: all 0.8s ease-out; */
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

/* Transition fade-slide */
.fade-slide-enter-active {
  transition: all 0.8s ease-out;
}
.fade-slide-leave-active {
  transition: all 0.5s ease-in;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(70px);
}
.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(70px);
}
</style>
