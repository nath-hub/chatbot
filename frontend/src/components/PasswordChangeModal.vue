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
         yo
        </v-alert>
      </v-card-text>
      </v-card>
      </v-container>
      </template>
<script setup>
import { ref } from "vue";
</script>