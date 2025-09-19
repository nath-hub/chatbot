<!-- frontend/src/App.vue -->
<template>

  <v-app>
    <v-layout>
      <v-navigation-drawer
        v-model="drawer"
        :rail="rail"
        permanent
        @click="rail = false"
        color="surface"
      >
        <div class="d-flex flex-column h-100">
          <!-- Header section -->
          <v-list>
            <v-list-item
              prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
              title="John Leider"
               subtitle="example@gmailcom"
            
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

          <v-divider></v-divider>

          <!-- Spacer pushes footer links to bottom -->
          <div class="flex-grow-1"></div>

          <!-- Footer nav links -->
          <v-list density="compact" nav>
            <v-list-item
              prepend-icon="mdi-home-city"
              title="Home"
              value="home"
              to="/home"
            />
            <v-list-item
              prepend-icon="mdi-account"
              title="S'abonner"
              value="account"
              to="/account"
            />
            <v-list-item
              prepend-icon="mdi-account-group-outline"
              title="Profil"
              value="users"
              to="/users"
            />

            <v-list-item
              prepend-icon="mdi-account-group-outline"
              title="Parametre"
              value="users"
              to="/about"
            />
          </v-list>

          <!-- Theme toggle at the very bottom -->
          <div class="pa-2">
            <v-btn
              variant="tonal"
              block
              @click="toggleTheme"
              :prepend-icon="isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent'"
            >
              {{ isDark ? 'Mode clair' : 'Mode sombre' }}
            </v-btn>
          </div>
        </div>
      </v-navigation-drawer>

      <v-main class="bg-background text-on-background">
        <!-- Contenu principal -->
        <router-view />
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useTheme } from "vuetify";

const drawer = ref(true);
const rail = ref(true);

// Theme toggle with Vuetify 3
const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);
function toggleTheme() {
  theme.global.name.value = isDark.value ? 'light' : 'dark';
}

</script>

<style>
/* s'assure que l'app prend toute la hauteur */
html,
body,
#app {
  height: 100%;
  margin: 0;
}
/* .v-application {
  min-height: 100vh;
} */
</style>
