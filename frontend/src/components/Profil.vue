<template>
  <v-container class="py-6">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card elevation="6" class="rounded-xl">
          <!-- Header avec avatar -->
          <v-card-title class="d-flex align-center purple--text">
            <v-avatar size="70" class="mr-4">
              <v-img :src="user.avatar || defaultAvatar" alt="Photo de profil" />
            </v-avatar>
            <div>
              <div class="text-h6 font-weight-bold">{{ user.username }}</div>
              <div class="grey--text">{{ user.email }}</div>
            </div>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text>
            <v-list dense>
              <!-- ID -->
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>ID</v-list-item-title>
                  <v-list-item-subtitle>{{ user.id }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <!-- Username -->
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Nom d’utilisateur</v-list-item-title>
                  <v-list-item-subtitle>{{ user.username }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <!-- OTP -->
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>OTP</v-list-item-title>
                  <v-list-item-subtitle>{{ user.otp }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <!-- OTP Expiry -->
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Expiration OTP</v-list-item-title>
                  <v-list-item-subtitle>{{ user.otp_expiry }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <!-- Actif -->
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Statut</v-list-item-title>
                  <v-chip :color="user.is_active ? 'success' : 'error'" dark small>
                    {{ user.is_active ? 'Actif' : 'Inactif' }}
                  </v-chip>
                </v-list-item-content>
              </v-list-item>

              <!-- Email -->
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Email</v-list-item-title>
                  <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <!-- Google ID -->
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Google ID</v-list-item-title>
                  <v-list-item-subtitle>{{ user.google_id }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <!-- Abonnement -->
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Abonnement</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ user.abonner ? "Abonné" : "Non abonné" }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <!-- Email vérifié -->
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Email vérifié</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ user.email_verified_at || "Non vérifié" }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <!-- Dernière connexion -->
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Dernière connexion</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ user.last_connection_date }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <!-- Création -->
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Créé le</v-list-item-title>
                  <v-list-item-subtitle>{{ user.created_at }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <!-- Mise à jour -->
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Dernière mise à jour</v-list-item-title>
                  <v-list-item-subtitle>{{ user.updated_at }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "MyAccount",
  data() {
    return {
      defaultAvatar:
        "https://cdn-icons-png.flaticon.com/512/149/149071.png", // Avatar par défaut
      user: {
        id: 1,
        username: "JeanDupont",
        otp: "123456",
        otp_expiry: "2025-09-30 12:00:00",
        is_active: true,
        email: "jean.dupont@example.com",
        google_id: "google-123456",
        abonner: true,
        email_verified_at: "2025-09-20 14:33:00",
        last_connection_date: "2025-09-25 18:45:00",
        created_at: "2025-08-10 09:15:00",
        updated_at: "2025-09-26 10:00:00",
        avatar: null, // si l'utilisateur a une photo, mettre l'URL
      },
    };
  },
};
</script>

<style scoped>
.v-card {
  background: white;
}
</style>
