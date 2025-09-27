<template>
  <v-container
    class="d-flex justify-center align-center "
    style="height: 100vh; min-width: 100%; background-color: rgb(var(--v-theme-primary))"
  >
    <v-card class="pa-6 card-responsive" elevation="12" rounded="xl">
      <div class="text-center mb-6">
        <div class="header-logo">
          <img src="../assets/logo.jpg" alt="Logo" class="logo-img" />
        </div>
      </div>
      <v-card-title class="text-h5 text-center">Vérification OTP</v-card-title>
      <v-card-text>
        <div class="mb-4 text-center">
          Un code de vérification a été envoyé à : <b>{{ email }}</b
          >.
        </div>

        <v-text-field v-model="otp" label="Code OTP" outlined dense />

        <v-alert
          v-if="message"
          :type="success ? 'success' : 'error'"
          class="mt-4"
        >
          {{ message }}
        </v-alert>
      </v-card-text>

      <v-card-actions class="d-flex justify-center">
        <v-btn class="custom-class" @click="verifyOtp" :loading="loading">
          Vérifier
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const route = useRoute();
const email = route.query.email || "";
const otp = ref("");
const message = ref("");
const success = ref(false);
const loading = ref(false);

const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

const verifyOtp = async () => {
  loading.value = true;
  try {
    const res = await axios.post(`${API_BASE_URL}/api/verify`, {
      email,
      otp: otp.value,
    });

    if (res.data.success) {
      success.value = true;
      message.value = "Vérification réussie ✅";

      localStorage.setItem("token", res.data.token); 

      // ✅ rediriger vers la page OTP après 1s
      setTimeout(() => {
        router.push("/home");
      }, 1000);
    } else {
      success.value = false;
      message.value = res.data.message;
    }
  } catch (error) {
    success.value = false;
    message.value = error.response?.data?.message || "Erreur serveur";
  } finally {
    loading.value = false;
  }
};
</script>

<style>
.v-btn.custom-class {
  width: 100%;
  height: 60px;
  border-radius: 15px;
  background-color: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-secondary));
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

.v-btn.custom-class:hover {
  background-color: rgb(var(--v-theme-secondary));
  color: rgb(var(--v-theme-primary));
}
 

.card-responsive {
  width: 30%; /* Largeur par défaut pour les grands écrans */
  margin: 16px auto; /* Centrage avec un peu d'espace autour */
}

@media (max-width: 1200px) {
  .card-responsive {
    transform: scale(1.5);
    width: 50%; /* Largeur pour les écrans de taille moyenne */
  }
}

@media (max-width: 900px) {
  .card-responsive {
    width: 30%; /* Largeur pour les petits écrans */
    /* Vous pouvez ajouter padding ici si nécessaire */
  }
}

@media (max-width: 600px) {
  .card-responsive {
    width: 20%; /* Largeur pour les très petits écrans */
    /* Évitez le zoom permanent */ 
    padding: 16px; /* Ajoutez du padding si nécessaire */
     /* padding: 24px !important; */
    /* margin: 8px auto; */
    transform: scale(1.5);
  }
}

.header-logo .logo-img {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #eaeaecf5;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}
</style>
