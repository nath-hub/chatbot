<!-- frontend/src/App.vue -->
<template>
  <v-app>
    <v-layout>
      <v-navigation-drawer
        v-if="!hideDrawer"
        v-model="drawer"
        :rail="rail"
        permanent
        @click="rail = false"
        color="surface"
        width="300"
      >
        <div class="d-flex flex-column h-100">
          <!-- Header section -->
          <v-list>
            <v-list-item 
              :prepend-avatar="girlAvatar"
              :title="user.username || 'Invité'"
              :subtitle="user.email || ''"
               
            :style="rail
              ? 'min-width: 32px;  background-color: rgb(var(--v-theme-background)); height: 45px;'
              : ' font-size:23px; '
            "
            >
              <template v-slot:append>
                <v-btn 
                  :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
                  variant="text"
                  @click.stop="rail = !rail"
                />
              </template>
            </v-list-item>
          </v-list>

          <v-btn
            :to="{ name: 'Home' }"
            :variant="rail ? 'text' : 'tonal'"
            :block="false"
           
            :style="rail
              ? 'min-width: 32px; margin-top: 8px; margin-left: 4px; margin-right: 4px; background-color: rgb(var(--v-theme-background)); height: 45px;'
              : 'width:200px;height:50px; margin-left: 40px; margin-top: 40px; border-radius:10px;background-color: rgb(var(--v-theme-primary)); color: rgb(var(--v-theme-color-text)); font-size:13px; transition: background-color 0.2s; text-transform: none;'
            "
            :title="'Nouvelle conversation'"
            :prepend-icon="!rail ? 'mdi-square-edit-outline' : undefined"
            :size="rail ? 'x-small' : 'small'"
            rounded="md"
            density="compact"
          >
            <v-icon v-if="rail" icon="mdi-square-edit-outline" size="18" :style="'color: rgb(var(--v-theme-on-background));'" />
            <template v-else>Nouvelle conversation</template>
          </v-btn>


          <v-divider> </v-divider>

          <div class="system-prompt pa-2">

            <label  style="display: block; margin: 20px auto; font-size: 22px; text-align: center; padding: 0 20px; color: rgb(var(--v-theme-black));">Chats</label>

            <v-list density="compact" nav>
              <v-list-item
                v-for="conv in store.conversations"
                :key="conv.id"
                :active="store.activeId === conv.id"
                @click="store.setActive(conv.id)"
              >
                <template #prepend>
                  <v-icon icon="mdi-message-text-outline" />
                </template>
                <template #title>
                  <span
                    class="text-truncate d-inline-block"
                    :title="conv.title"
                    style="max-width: 200px"
                  >
                    {{ conv.title }}
                  </span>
                </template>
              </v-list-item>
            </v-list>
          </div>

          <!-- Spacer pushes footer links to bottom -->
          <div class="flex-grow-1"></div>

          <!-- Footer nav links -->
          <v-list density="compact" nav>
            <v-list-item
              prepend-icon="mdi-home-city"
              title="Home"
              value="home"
              to="/home"
              :active="route.name === 'Home'"
              :active-color="rail ? 'primary' : 'primary'"
            >
              <template v-slot:title>
                <span style="font-size: 18px">Home</span>
              </template>
            </v-list-item>
            <v-list-item
              prepend-icon="mdi-seal"
              title="S'abonner"
              value="abonnement"
              to="/abonnement"
              :active-color="rail ? 'primary' : 'primary'"
            >
              <template v-slot:title>
                <span style="font-size: 18px">S'abonner</span>
              </template>
            </v-list-item>
            <v-list-item
              prepend-icon="mdi-account-star"
              title="Profil"
              value="profil"
              to="/profil"
              :active-color="rail ? 'primary' : 'primary'"
            >
              <template v-slot:title>
                <span style="font-size: 18px">Profil</span>
              </template>
            </v-list-item>

            <v-list-item
              prepend-icon="mdi-cog"
              title="Parametre"
              value="setting"
              to="/about"
              :active-color="rail ? 'primary' : 'primary'"
            >
              <template v-slot:title>
                <span style="font-size: 18px">Parametre</span>
              </template>
            </v-list-item>
          </v-list>

          <!-- Theme toggle at the very bottom -->
          <div class="py-8">
            <v-btn
              :variant="rail ? 'text' : 'tonal'"
              :block="!rail"
              class="justify-center"
              @click="toggleTheme"
              :prepend-icon="
                !rail
                  ? isDark
                    ? 'mdi-white-balance-sunny'
                    : 'mdi-moon-waning-crescent'
                  : undefined
              "
              :title="isDark ? 'Mode clair' : 'Mode sombre'"
            >
              <v-icon
                size="24"
                v-if="rail"
                :icon="
                  isDark
                    ? 'mdi-white-balance-sunny'
                    : 'mdi-moon-waning-crescent'
                "
              />
              <template v-else>
                {{ isDark ? "Mode clair" : "Mode sombre" }}
              </template>
            </v-btn>
          </div>
        </div>
      </v-navigation-drawer>

      <v-main class="bg-background text-on-background overflow-y-auto">

 


        <!-- Contenu principal -->
        <router-view />
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted  } from "vue";
import { useRoute } from "vue-router";
import { useTheme } from "vuetify";
import { useChatStore } from "./stores/chat"; 
import girl from "./assets/girl.jpg"; 
import axios from "axios";

const drawer = ref(true);
const rail = ref(true);
const store = useChatStore();
const sys = ref(store.messages[0]?.content || "");

const girlAvatar = girl; 
const user = ref<{username?: string; email?: string}>({});

// Theme toggle with Vuetify 3
const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);
function toggleTheme() {
  theme.global.name.value = isDark.value ? "light" : "dark";
}

const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000'

// Récupération du profil user avec le token
onMounted(async () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.data.success) {
        user.value = res.data.user;
      }
    } catch (err) {
      console.error("Erreur récupération user:", err);
    }
  }
});




// Hide navigation drawer on Landing route
const route = useRoute();
const hideDrawer = computed(() => route.name === "Landing"|| route.name === "Verify"|| route.name === "Login");

</script>

<style>
/* s'assure que l'app prend toute la hauteur */
html,
body,
#app {
  height: 100%;
  margin: 0;
}

.custom-class {
  width: 260px; /* Définir la largeur du bouton */
  height: 40px; /* Définir la hauteur du bouton */
  border-radius: 15px; /* Bords arrondis */
  background-color: rgb(var(--v-theme-primary)); /* Couleur de fond du bouton */
  color: #ffffff; /* Couleur du texte */
  /* display: flex; Pour centrer le texte */
  /* align-items: center; Centrer verticalement */
  /* justify-content: center; Centrer horizontalement */
  font-size: 15px; /* Taille de la police */
  transition: background-color 0.3s; /* Transition pour le survol */

  min-width: 200px; /* Assurez-vous que la largeur minimale est respectée */
  min-height: 70px;
  text-transform: none;
}

.custom-class:hover {
  background-color: rgba(0, 123, 255, 0.1); /* Couleur de survol */
  color: #007bff; /* Couleur du texte au survol */
}
</style>
