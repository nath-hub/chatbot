import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./styles.css"; // ton CSS global
// Si tu utilises Vuetify, importe et configure ici.
import { createVuetify } from "vuetify";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        dark: false,
        colors: {
          background: "hsl(283, 77.80%, 98.20%)",
          surface: "#ffffff",
          primary: "#673AB7", // violet
          secondary: "#e7e7e7",
          error: "#f44336",
          "on-background": "#1f1f1f",
          "on-surface": "#1f1f1f",

        },
      },
      dark: {
        dark: true,
        colors: {
          background: "hsl(0, 0.00%, 20.40%)",
          surface: "hsl(132, 83.50%, 38.00%)", //pour le menu
          primary: "hsl(0, 86.30%, 34.30%)", // violet clair
          secondary: "hsl(0, 81.20%, 39.60%)",
          error: "hsl(0, 0.00%, 98.40%)",
          "on-background": "hsl(0, 0.00%, 98.40%)",
          "on-surface": "hsl(0, 0.00%, 98.40%)",
        },
      },
    },
  },
});

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(vuetify);
app.mount("#app");
