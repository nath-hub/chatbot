<template>
  <v-container class="py-6">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card elevation="6" class="rounded-xl">
          <v-card-title class="text-h5 font-weight-bold purple--text">
            💳 Mon abonnement
          </v-card-title>
          <v-divider></v-divider>

          <v-card-text>
            <!-- Cas NON abonné -->
            <div v-if="!subscription.active" class="text-center py-6">
              <v-icon size="64" color="purple">mdi-credit-card-off</v-icon>
              <p class="mt-3 text-subtitle-1">
                Vous n’avez pas encore d’abonnement actif.
              </p>
              <v-btn color="purple" dark large class="mt-4" @click="subscribe">
                S’abonner maintenant
              </v-btn>
            </div>

            <!-- Cas ABONNÉ -->
            <div v-else>
              <v-list dense>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Type d’abonnement</v-list-item-title>
                    <v-list-item-subtitle>{{ subscription.plan }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Date de début</v-list-item-title>
                    <v-list-item-subtitle>{{ subscription.start_date }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Date de fin</v-list-item-title>
                    <v-list-item-subtitle>{{ subscription.end_date }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Status</v-list-item-title>
                    <v-chip
                      :color="subscription.active ? 'success' : 'error'"
                      dark
                      small
                    >
                      {{ subscription.active ? "Actif" : "Expiré" }}
                    </v-chip>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Prix payé</v-list-item-title>
                    <v-list-item-subtitle>{{ subscription.price }} €</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-divider class="my-4"></v-divider>

                <v-btn color="purple" dark block @click="renew">
                  🔄 Renouveler l’abonnement
                </v-btn>
              </v-list>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Subscription",
  data() {
    return {
      subscription: {
        active: true, // mettre false si l’utilisateur n’a pas payé
        plan: "Premium - Mensuel",
        start_date: "2025-09-01",
        end_date: "2025-10-01",
        price: 9.99,
      },
    };
  },
  methods: {
    subscribe() {
      alert("Redirection vers la page de paiement...");
    },
    renew() {
      alert("Renouvellement en cours...");
    },
  },
};
</script>

<style scoped>
.v-card {
  background: white;
}
</style>
