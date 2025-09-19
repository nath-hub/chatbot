<template> 

  <aside class="sidebar">
    <div class="brand">LegalGPT</div>
    <div>
      <v-btn @click="newConv" block>Nouvelle conversation</v-btn>
    </div>

    <!-- <div class="system-prompt">
      <label>Prompt système</label>
      <textarea v-model="sys" rows="3"></textarea>
      <v-btn @click="applySystem">Appliquerrr</v-btn>
    </div> -->

      
    <footer class="muted">
         <v-btn color="red">Logout</v-btn> <p></p>
        Assistant spécialisé en droit
   
    </footer>
  </aside>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useChatStore } from "../stores/chat";

const store = useChatStore();
const sys = ref(store.messages[0]?.content || "");

const items = ref([
  { icon: "mdi-home", text: "Accueil", action: "/" },
  { icon: "mdi-history", text: "Historique", action: "/history" },
  { icon: "mdi-help", text: "À propos", action: "/about" },
]);

function newConv() {
  store.clearMessages();
  store.addMessage({ role: "system", content: sys.value });
}
function applySystem() {
  // replace system message
  if (store.messages.length > 0 && store.messages[0].role === "system") {
    store.messages[0].content = sys.value;
  } else {
    store.messages.unshift({ role: "system", content: sys.value });
  }
}
</script>

<style scoped>
.sidebar {
  width: 260px;
  padding: 16px;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100vh;
  justify-content: space-between;
}
.brand {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 1rem;
}
.system-prompt textarea {
  width: 100%;
}

.system-prompt label {
  display: block;
  margin-bottom: 0.25rem;
}

.sidebar-bottom {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.muted {
  margin-top: auto;
  font-size: 20px;
}
</style>
