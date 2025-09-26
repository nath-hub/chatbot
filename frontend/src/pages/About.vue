<template>
  <v-container
    fluid
    class="pa-6"
    style="
      min-height: 100vh;
      background-color: rgb(var(--v-theme-on-background));
    "
  >
    <!-- En-tête -->
    <!-- <v-card class="pa-4 mb-6 d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <v-btn
          variant="text"
          color="purple"
          prepend-icon="mdi-arrow-left"
          style="text-transform: lowercase"
        >
          Retour
        </v-btn>
        <div class="ml-8">
          <h1 class="text-h5 font-weight-bold text-purple">Paramètres</h1>
          <p class="text-caption text-purple-darken-2">
            Personnalisez votre expérience de chat
          </p>
        </div>
      </div>

      <v-btn
        :color="saveState === 'saved' ? 'green' : 'purple'"
        :loading="saveState === 'saving'"
        :disabled="saveState === 'saving'"
        @click="handleSave"
      >
        <template v-if="saveState === 'saved'">✓ Sauvegardé</template>
        <template v-else-if="saveState === 'saving'">Sauvegarde...</template>
        <template v-else>Sauvegarder</template>
      </v-btn>
    </v-card> -->

    <v-app-bar :elevation="2" style="height: 80px">
      <v-app-bar-title class="d-flex align-center">
        <transition name="fade-slide" appear>
          <div class="d-flex align-center">
            <v-btn
              variant="text"
              prepend-icon="mdi-arrow-left"
              style="text-transform: lowercase"
              id="style_color"
            >
              Retour
            </v-btn>
            <div class="ml-8">
              <h1 class="text-h5 font-weight-bold" id="style_color">
                Paramètres
              </h1>
              <p class="text-caption" id="style_color">
                Personnalisez votre expérience de chat
              </p>
            </div>
          </div>
        </transition>
      </v-app-bar-title>

      <template v-slot:append>
        <v-btn
          :color="
            saveState === 'saved'
              ? 'rgb(var(--v-theme-color-text))'
              : 'rgb(var(--v-theme-color-text))'
          "
          :loading="saveState === 'saving'"
          :disabled="saveState === 'saving'"
          :style="{
            'text-transform': 'lowercase',
            backgroundColor:
              saveState === 'saved' ? 'green' : 'rgb(var(--v-theme-primary))',
          }"
          @click="handleSave"
        >
          <template v-if="saveState === 'saved'">✓ Sauvegardé</template>
          <template v-else-if="saveState === 'saving'">Sauvegarde...</template>
          <template v-else>Sauvegarder</template>
        </v-btn>
      </template>
    </v-app-bar>

    <!-- 1. Profil Utilisateur -->
    <v-card class="pa-6 mb-6" outlined>
      <h2 class="text-h6 mb-4">Profil Utilisateur</h2>
      <v-row>
        <v-col cols="12" md="4" class="d-flex flex-column align-center">
          <!-- Avatar -->
          <v-avatar size="100">
            <v-img :src="userProfile.avatar" cover />
          </v-avatar>

          <!-- Bouton pour changer -->
          <v-btn icon color="purple" class="mt-2" @click="triggerFileInput">
            <v-icon>mdi-camera</v-icon>
          </v-btn>
          <small class="text-purple">Changer l'avatar</small>

          <!-- Input file caché -->
          <input
            type="file"
            ref="fileInput"
            accept="image/*"
            style="display: none"
            @change="handleFileChange"
          />

          <div class="mt-4 d-flex flex-column align-center">
            <v-chip
              :color="userProfile.is_active ? 'green' : 'red'"
              text-color="white"
              class="mb-2"
              variant="flat"
            >
              {{ userProfile.is_active ? "Compte Actif" : "Compte Inactif" }}
            </v-chip>

            <v-chip
              :color="userProfile.abonner ? 'purple' : 'grey'"
              text-color="white"
              variant="flat"
            >
              {{ userProfile.abonner ? "Abonné" : "Non abonné" }}
            </v-chip>
          </div>
        </v-col>

        <v-col cols="12" md="8">
          <v-text-field
            v-model="userProfile.username"
            label="Nom d'utilisateur"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            v-model="userProfile.email"
            label="Email"
            readonly
            variant="outlined"
            density="comfortable"
            append-inner-icon="mdi-check-circle"
          />
          <v-textarea
            v-model="userProfile.bio"
            label="Biographie"
            rows="3"
            variant="outlined"
            density="comfortable"
          />
        </v-col>
      </v-row>
    </v-card>

    <!-- 2. Apparence -->
    <v-card class="pa-6 mb-6" outlined>
      <h2 class="text-h6 mb-4">Apparence</h2>
      <v-row>
        <v-col cols="12" md="6">
          <v-radio-group
            v-model="userProfile.theme"
            label="Thème"
            @change="toggleTheme"
          >
            <v-radio label="Clair" value="clair" />
            <v-radio label="Sombre" value="sombre" />
            <v-radio label="Auto" value="auto" />
          </v-radio-group>
        </v-col>
        <v-col cols="12" md="6">
          <v-slider
            v-model="userProfile.fontSize"
            :min="12"
            :max="20"
            step="1"
            label="Taille de police"
            thumb-label
          />
        </v-col>
      </v-row>
      <v-switch
        v-model="userProfile.animations"
        label="Activer les animations de l'interface"
        color="purple"
      />
    </v-card>

    <!-- 3. Préférences de Chat -->
    <v-card class="pa-6 mb-6" outlined>
      <h2 class="text-h6 mb-4">Préférences de Chat</h2>
      <v-switch
        v-model="chatPrefs.enterToSend"
        label="Appuyer sur Entrée pour envoyer"
        color="purple"
      />
      <v-switch
        v-model="chatPrefs.suggestions"
        label="Afficher les suggestions automatiques"
        color="purple"
      />
      <v-switch
        v-model="chatPrefs.autoCorrect"
        label="Correction automatique du texte"
        color="purple"
      />
      <v-switch
        v-model="chatPrefs.autoDelete"
        label="Suppression automatique des anciens messages"
        color="purple"
      />
    </v-card>

    <!-- 4. Sécurité -->
    <v-card class="pa-6 mb-6" outlined>
      <h2 class="text-h6 mb-4">Sécurité</h2>
      <v-switch
        v-model="security.twoFA"
        label="Activer la double authentification (2FA)"
        color="purple"
      />
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Sessions actives</v-list-item-title>
            <v-list-item-subtitle
              >{{ security.sessions }} appareils connectés</v-list-item-subtitle
            >
          </v-list-item-content>
          <v-btn color="red" variant="text" @click="logoutAll"
            >Déconnecter tout</v-btn
          >
        </v-list-item>
      </v-list>
    </v-card>

    <!-- 5. Avancé -->
    <v-card class="pa-6 mb-6" outlined>
      <h2 class="text-h6 mb-4">Paramètres Avancés</h2>
      <v-btn
        color="purple"
        variant="outlined"
        class="mb-2"
        @click="resetSettings"
      >
        Réinitialiser tous les paramètres
      </v-btn>
      <v-btn color="purple" variant="outlined" @click="clearCache">
        Vider le cache local
      </v-btn>
    </v-card>

    <!-- 6. Zone dangereuse -->
    <v-card class="pa-6 mb-6" outlined>
      <h2 class="text-h6 mb-4 text-red">Zone Dangereuse</h2>
      <v-btn color="red" dark @click="deleteDialog = true">
        Supprimer mon compte
      </v-btn>
    </v-card>

    <!-- Modal suppression -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Confirmer la suppression</v-card-title>
        <v-card-text>
          Cette action est <strong>irréversible</strong>. Toutes vos données
          seront supprimées.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="deleteDialog = false">Annuler</v-btn>
          <v-btn color="red" dark @click="confirmDelete">Supprimer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useTheme } from "vuetify";

const saveState = ref("idle"); // idle, saving, saved
const deleteDialog = ref(false);

const userProfile = ref({
  username: "JohnDoe",
  email: "john@example.com",
  bio: "Passionné d'IA et de technologie",
  avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  is_active: true,
  abonner: true,
  theme: "clair",
  fontSize: 14,
  animations: true,
});

const fileInput = ref(null);

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    userProfile.value.avatar = URL.createObjectURL(file);
  }
};

const theme = useTheme();

function toggleTheme() {
  switch (userProfile.value.theme) {
    case "clair":
      theme.global.name.value = "light";
      break;
    case "sombre":
      theme.global.name.value = "dark";
      break;
    default: 
      theme.global.name.value = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
  }
}

const appearance = ref({
  theme: "auto",
  fontSize: 14,
  animations: true,
});

const chatPrefs = ref({
  enterToSend: true,
  suggestions: true,
  autoCorrect: false,
  autoDelete: false,
});

const security = ref({
  twoFA: false,
  sessions: 2,
});

const handleSave = () => {
  saveState.value = "saving";
  setTimeout(() => {
    saveState.value = "saved";
    setTimeout(() => (saveState.value = "idle"), 2000);
  }, 1000);
};

const resetSettings = () => alert("Paramètres réinitialisés !");
const clearCache = () => alert("Cache vidé !");
const logoutAll = () => alert("Toutes les sessions ont été déconnectées !");
const confirmDelete = () => {
  alert("Compte supprimé !");
  deleteDialog.value = false;
};
</script>

<style>
#style_color {
  color: "rgb(var(--v-theme-primary))";
}
</style>
