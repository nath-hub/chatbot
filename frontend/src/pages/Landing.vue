<template>
  <v-container class="fill-height d-flex align-center justify-center text-center">
    <div>
      <v-avatar size="96" class="mb-4">
        <img src="./assets/logo.png" alt="Logo" />
      </v-avatar>
      <h1 class="text-h4 mb-2">Bienvenue sur LegalGPT</h1>
      <p class="mb-6">Votre assistante juridique intelligente. Posez vos questions et obtenez des réponses rapides.</p>
      <v-btn color="primary" size="large" :to="{ name: 'Home' }" prepend-icon="mdi-chat-processing">
        Accéder au chat
      </v-btn>
    </div>
  </v-container>
</template>

<script setup lang="ts">
// Landing page simple
</script>

<style scoped>
.v-container {
  background: radial-gradient(circle at 20% 20%, rgba(103,58,183,0.12), transparent 40%),
              radial-gradient(circle at 80% 30%, rgba(3,169,244,0.12), transparent 40%);
}
</style>
