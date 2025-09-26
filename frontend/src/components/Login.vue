<template>
  <v-container
    fluid
    class="d-flex align-center justify-center fill-height full-width"
    style="background: linear-gradient(135deg, #6a1b9a, #8e24aa)"
  >
    <v-card class="pa-8 card-responsive" elevation="12" rounded="xl">
      <!-- Titre -->
      <div class="text-center mb-6">
        <div class="header-logo">
          <img src="../assets/logo.jpg" alt="Logo" class="logo-img" />
        </div>
        <h1
          class="text-h4 font-weight-bold"
          style="color: rgb(var(--v-theme-black))"
        >
          Connexion
        </h1>
        <p class="text-body-3" style="color: rgb(var(--v-theme-fade))">
          Accédez à votre espace sécurisé
        </p>

        <v-btn class="custom-class">
          <img
            src="../assets/google-icon.png"
            alt="Google"
            class="google-icon"
          />
          Continuer avec Google
        </v-btn>
      </div>

      <!-- Formulaire -->
      <v-form @submit.prevent="sendEmail">
        <v-text-field
          v-model="username"
          label="Username"
          type="name"
          prepend-inner-icon="mdi-account-star"
          variant="outlined" 
          color="purple"
          class="mb-4"
        />

        <v-text-field
          v-model="email"
          label="Email"
          type="email"
          prepend-inner-icon="mdi-email"
          variant="outlined"
          color="purple"
          class="mb-4"
        />

        <v-btn class="custom" :loading="loading"  @click="sendEmail" type="submit" block size="large">
          Continuer avec email
        </v-btn>
      </v-form>

        <v-alert
          v-if="message"
          :type="success ? 'success' : 'error'"
          class="mt-4"
        >
        {{ message }}
        </v-alert>

      <!-- Lien inscription -->
      <div class="text-center">
        <p class="text-body-2 mt-4 text-grey-darken-1">
          En poursuivant, vous acceptez
          <a href="#" class="font-weight-bold purple--text"
            >la Politique de Confidentialité</a
          >
          de Legal
        </p>
      </div>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const username = ref("");
const email = ref("");
const message = ref("");
const success = ref(false);
const loading = ref(false);

import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

const sendEmail = async () => {
  console.log("Envoi des données:", {
    username: username.value,
    email: email.value,
  });
    try {
    const res = await axios.post("http://localhost:3000/api/register", {
      username: username.value,
      email: email.value,
    });
    console.log("Réponse reçue :", res);

    if (res.data.success) {
      success.value = true;
      message.value = res.data.message;
      console.log("Succès:", message.value);

       // ✅ rediriger vers la page OTP après 1s
      setTimeout(() => {
        router.push({ name: "Verify", query: { email: email.value } });
      }, 1000);
    }
  } catch (error) {
    console.error("Erreur axios :", error);
 
    if (error.response) {
      success.value = false;
      message.value = error.response.data.message || "Une erreur est survenue";
      console.log("Erreur backend:", message.value);
    } else {
      message.value = "Erreur réseau ou serveur injoignable";
      console.log(message.value);
    }
  }finally {
    loading.value = false;
  }

};
</script>

<style>
.google-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

.card-responsive { 
  width: 2%;
 height: 50%; 
  transform: scale(1.2);
}

@media (max-width: 900px) {
  .card-responsive {
    width: 80% !important; 
  }
}

.v-btn.custom-class {
  width: 100%;
  height: 60px;
  border-radius: 15px; 
  color: rgb(var(--v-theme-primary));
  border: none;
  display: flex;
  margin-top: 30px;
  margin-bottom: 30px;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: background-color 0.3s;
  text-transform: none;
  min-width: 200px;
  min-height: 50px;
  text-transform: none;
}

.custom-class:hover {
  background-color: rgb(var(--v-theme-secondary));
  color: rgb(var(--v-theme-primary));
}

.header-logo .logo-img {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #eaeaecf5;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.v-btn.custom {
  width: 100%;
  height: 60px;
  border-radius: 15px;
  background-color: rgb(var(--v-theme-primary));
  color: #ffffff;
  border: none;
  display: flex;
  /* margin-top: 30px; */
  margin-bottom: 30px;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: background-color 0.3s;
  text-transform: none;
  min-width: 200px;
  min-height: 50px;
  text-transform: none;
}

.custom:hover {
  background-color: rgb(var(--v-theme-secondary));
  color: rgb(var(--v-theme-primary));
}
</style>
