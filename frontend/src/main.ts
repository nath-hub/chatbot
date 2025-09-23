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
          background: "hsl(0, 0.00%, 91.80%)",
          surface: "hsl(0, 4.30%, 95.50%)",
          primary: "#6c2399ff", // violet
          secondary: "#e7e7e7",
          error: "#f44336",
          "on-background": "#1f1f1f",
          "on-surface": "#1f1f1f",
          fade: "hsl(0, 0.00%, 42.00%)",
          black: "hsla(302, 78.40%, 7.30%, 0.98)",
          "color-text": "hsla(0, 100.00%, 98.40%, 0.98)",
          "bg-msg": "hsl(268, 100.00%, 29.60%)",
        },
      },
      dark: {
        dark: true,
        colors: {
          background: "hsl(0, 0.00%, 20.40%)",
          surface: "hsl(0, 0.00%, 20.40%)", //pour le menu
          primary: "hsl(268, 100.00%, 29.60%)", // violet clair
          secondary: "hsl(0, 0.00%, 24.30%)",
          error: "hsl(0, 0.00%, 98.40%)",
          "on-background": "hsl(0, 0.00%, 98.40%)",
          "on-surface": "hsl(0, 0.00%, 98.40%)",
          fade: "hsl(280, 3.30%, 82.20%)",
          black: "hsla(302, 78.40%, 7.30%, 0.98)",
          "color-text": "hsla(0, 0.00%, 96.90%, 0.98)",
          "bg-msg": "hsl(268, 100.00%, 29.60%)",
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
