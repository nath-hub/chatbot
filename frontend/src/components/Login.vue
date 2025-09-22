<template>
  <v-container
    fluid
    class="d-flex align-center justify-center fill-height"
    style="background: linear-gradient(135deg, #6a1b9a, #8e24aa);"
  >
    <v-card
      class="pa-8"
      width="420"
      elevation="12"
      rounded="xl"
    >
      <!-- Titre -->
      <div class="text-center mb-6">
        <v-icon size="48" color="purple-darken-2">mdi-account-circle</v-icon>
        <h2 class="text-h5 font-weight-bold purple--text">Connexion</h2>
        <p class="text-body-2 text-grey-darken-1">
          Accédez à votre espace sécurisé
        </p>
      </div>

      <!-- Formulaire -->
      <v-form>
        <v-text-field
          v-model="email"
          label="Email"
          type="email"
          prepend-inner-icon="mdi-email"
          variant="outlined"
          color="purple"
          class="mb-4"
        />

        <v-text-field
          v-model="password"
          label="Mot de passe"
          type="password"
          prepend-inner-icon="mdi-lock"
          variant="outlined"
          color="purple"
          class="mb-6"
        />

        <v-btn
          block
          color="purple-darken-2"
          size="large"
          class="mb-4"
          @click="login"
        >
          Se connecter
        </v-btn>
      </v-form>

      <!-- Lien inscription -->
      <div class="text-center">
        <p class="text-body-2 text-grey-darken-1">
          Pas encore de compte ?
          <a href="#" class="font-weight-bold purple--text">S’inscrire</a>
        </p>
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from "vue"

const email = ref("")
const password = ref("")

const login = () => {
  console.log("Email:", email.value, "Password:", password.value)
  // 👉 Ici tu mettras ton appel API
}
</script>
