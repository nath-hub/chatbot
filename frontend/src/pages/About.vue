<template>
  <v-container class="py-8">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">À propos</h1>
        <p>
          Bienvenue dans LegalGPT. Cette page présente l'application et ses fonctionnalités.
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <v-card variant="elevated" class="mb-4">
          <v-card-title>Fonctionnalités</v-card-title>
          <v-card-text>
            <ul>
              <li>Discussions assistées par IA</li>
              <li>Historique des conversations</li>
              <li>Mode clair/sombre</li>
            </ul>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card variant="elevated" class="mb-4">
          <v-card-title>Contact</v-card-title>
          <v-card-text>
            <div>Email: contact@example.com</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// Simple page component
</script>

<style scoped>
/* Suit le thème automatiquement grâce aux composants Vuetify */
</style>
