<template>
  <v-container class="d-flex flex-column text-center">
    <!-- Hero (top) -->
    <div class="animated-fade-in">
      <div class="header-logo">
        <img src="../assets/logo.jpg" alt="Logo" class="logo-img" />
      </div>
      <h1 class="text-h4 mb-4 mt-4">Legal Chat IA</h1>
      <p style="font-size: 22px; color: rgb(var(--v-theme-fade))">
        Votre assistant juridique intelligent pour toutes vos questions de droit
        français
      </p>
    </div>

    <div class="d-flex justify-center py-12 px-10" style="gap: 40px">
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="text-center feature-card"
        style="
          flex: 0 0 auto;
          width: 356px;
          background: rgb(var(--v-theme-surface));
          border: 2px solid rgb(var(--v-theme-secondary));
          border-radius: 12px;
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.06);
          padding: 14px;
        "
      >
        <div class="d-flex justify-center mb-4" style="padding: 10px">
          <v-icon
            :size="40"
            :icon="card.icon"
            :color="card.vColor"
            :title="card.title"
          />
        </div>
        <h2 class="font-weight-medium mb-4">{{ card.title }}</h2>
        <div class="text-body-1" style="color: rgb(var(--v-theme-fade))">
          {{ card.text }}
        </div>
      </div>
    </div>

    <!-- Large card below the row -->
    <v-card
      class="mx-auto text-white text-center"
      color="surface"
      max-width="800"
      height="300"
      style="
        border: 2px solid rgb(var(--v-theme-secondary));
        border-radius: 12px;
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.06);
      "
    >
      <v-card-text class="py-6 ml-4 mr-4">
        <div class="text-h5 mb-4" style="color: rgb(var(--v-theme-black))">
          Commencez dès maintenant
        </div>
        <div style="font-size: 16px; color: rgb(var(--v-theme-fade))">
          Posez vos questions juridiques et obtenez des réponses expertes
          instantanément. Essai gratuit pendant 1 mois, puis abonnement pour
          continuer.
        </div>
      </v-card-text>
      <v-card-actions class="justify-center">
        <div
          class="d-flex flex-column align-center"
          style="gap: 16px; width: 100%"
        >
          <v-btn
            class="custom-class"
            @click="handleChatStart"
            prepend-icon="mdi-chat-processing"
          >
            Démarrer le chat
          </v-btn>
          <div
            class="d-flex align-center justify-center"
            style="gap: 24px; flex-wrap: wrap"
          >
            <div class="d-flex align-center mt-4" style="gap: 8px">
              <v-icon icon="mdi-check" :size="20" color="primary" />
              <span style="color: rgb(var(--v-theme-fade))"
                >1 mois gratuit</span
              >
            </div>
            <div class="d-flex align-center mt-4" style="gap: 8px">
              <v-icon icon="mdi-check" :size="20" color="primary" />
              <span style="color: rgb(var(--v-theme-fade))"
                >Sans engagement</span
              >
            </div>
            <div class="d-flex align-center mt-4" style="gap: 8px">
              <v-icon icon="mdi-check" :size="20" color="primary" />
              <span style="color: rgb(var(--v-theme-fade))"
                >Questions illimitées</span
              >
            </div>
          </div>
        </div>
      </v-card-actions>
    </v-card>

    <div
      class="d-flex justify-center py-12 px-10"
      style="gap: 40px; overflow-x: auto"
    >
      <div
        class="text-center animated-zoom-in feature-card"
        style="
          flex: 0 0 auto;
          width: 356px;
          background: rgb(var(--v-theme-surface));
          border: 2px solid rgb(var(--v-theme-secondary));
          border-radius: 12px;
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.06);
          padding: 14px;
        "
      >
        <h2 class="font-weight-medium mb-4">10k+</h2>
        <div class="text-body-1" style="color: rgb(var(--v-theme-fade))">
          Questions traitées
        </div>
      </div>
      <div
        class="text-center animated-zoom-in feature-card"
        style="
          flex: 0 0 auto;
          width: 356px;
          background: rgb(var(--v-theme-surface));
          border: 2px solid rgb(var(--v-theme-secondary));
          border-radius: 12px;
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.06);
          padding: 14px;
        "
      >
        <h2 class="font-weight-medium mb-4">98%</h2>
        <div class="text-body-1" style="color: rgb(var(--v-theme-fade))">
          Satisfaction client
        </div>
      </div>
      <div
        class="text-center animated-zoom-in feature-card"
        style="
          flex: 0 0 auto;
          width: 356px;
          background: rgb(var(--v-theme-surface));
          border: 2px solid rgb(var(--v-theme-secondary));
          border-radius: 12px;
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.06);
          padding: 14px;
        "
      >
        <h2 class="font-weight-medium mb-4">24/7</h2>
        <div class="text-body-1" style="color: rgb(var(--v-theme-fade))">
          Disponibilité
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {useRouter} from "vue-router";

const router = useRouter();

const cards = [
  {
    icon: "mdi-scale-balance",
    title: "Expertise juridique",
    text: "Réponses basées sur le droit français et la jurisprudence actuelle",
    vColor: "primary",
  },
  {
    icon: "mdi-clock-time-four-outline",
    title: "Réponses instantanées",
    text: "Obtenez des réponses précises en quelques secondes",
    vColor: "primary",
  },
  {
    icon: "mdi-shield-check-outline",
    title: "Confidentialité totale",
    text: "Vos conversations sont privées et sécurisées",
    vColor: "primary",
  },
  {
    icon: "mdi-face-agent",
    title: "Support 24/7",
    text: "Assistance juridique disponible à tout moment",
    vColor: "primary",
  },
];

const handleChatStart = async () => {
  const token = localStorage.getItem("token");
  console.log("url :",  import.meta.env.VITE_API_BASE);
  const API_BASE_URL =  import.meta.env.VITE_API_BASE || 'http://localhost:3000'

  console.log("url :", API_BASE_URL);

  if (token) {
    try {
      // Remplacez 'api/me' par l'URL de votre endpoint
      const response = await fetch(`${API_BASE_URL}/api/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        // Rediriger vers la page de chat (Home)
        router.push({ name: "Home" }); // Assurez-vous que 'Home' est le nom correct de votre route
      } else {
        // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
        router.push({ name: "Login" });
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des informations utilisateur:",
        error
      );
      // Rediriger vers la page de connexion en cas d'erreur
      router.push({ name: "Login" });
    }
  } else {
    // Si le token n'est pas présent, rediriger vers la page de connexion
    router.push({ name: "Login" });
  }
};
</script>

<style scoped>
.v-container {
  background-image: linear-gradient(
    to left,
    var(--v-theme-background),
    var(--v-theme-secondary)
  );

  /* background-image: radial-gradient(
      circle at 20% 20%,
      rgba(103, 58, 183, 0.12),
      transparent 40%
    ),
    radial-gradient(circle at 80% 30%, rgba(3, 169, 244, 0.12), transparent 40%); */
}

.header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border-bottom: 1px solid #ff0707;
  color: var(--v-theme-on-background);

  opacity: 0;
  transform: translateY(70px);
  transition: all 0.8s ease-out;
}
.header-logo .logo-img {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #f0f0f0f5;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px); /* Déplacement vers le bas */
  }
  to {
    opacity: 1;
    transform: translateY(0); /* Retour à la position d'origine */
  }
}

.animated-fade-in {
  animation: fadeIn 0.5s ease-out; /* Durée et type de transition */
}

.custom-class {
  width: 260px;
  height: 80px;
  border-radius: 15px;
  background-color: rgb(var(--v-theme-primary));
  color: #ffffff;
  /* border: none; Supprimer les bordures par défaut */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: background-color 0.3s;

  min-width: 200px;
  min-height: 70px;
  text-transform: none;
}

.custom-class:hover {
  background-color: rgb(var(--v-theme-secondary));
  color: rgb(var(--v-theme-primary));
}

/* Hover animation for feature cards */
.feature-card {
  transition: transform 0.25s ease, box-shadow 0.25s ease,
    border-color 0.25s ease, background-color 0.25s ease;
  will-change: transform, box-shadow;
}
.feature-card:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
  border-color: rgb(var(--v-theme-primary));
}
.feature-card:active {
  transform: translateY(-2px) scale(0.999);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

@keyframes zoomIn {
  from {
    transform: scale(0.8); /* Démarre à 80% de la taille */
    opacity: 0; /* Invisible au départ */
  }
  to {
    transform: scale(1); /* Échelle normale */
    opacity: 1; /* Rendre visible */
  }
}

.animated-zoom-in {
  animation: zoomIn 0.5s ease-out; /* Durée et type de transition */
}

.feature-card {
  flex: 0 1 calc(25% - 40px); /* Largeur par défaut des cartes */
  margin: 8px; /* Espace autour des cartes */
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  will-change: transform, box-shadow;
}

.feature-card:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
  border-color: rgb(var(--v-theme-primary));
}

/* Responsive Design */
@media (max-width: 1200px) {
  .feature-card {
    flex: 0 1 calc(33% - 40px); /* 3 cartes par ligne */
  }
}

@media (max-width: 900px) {
  .feature-card {
    flex: 0 1 calc(50% - 40px); /* 2 cartes par ligne */
  }
}

@media (max-width: 600px) {
  .feature-card {
    flex: 0 1 100%; /* 1 carte par ligne */
  }

  .header-logo .logo-img {
    width: 80px; /* Ajustement de la taille du logo */
    height: 80px;
  }
}
</style>
