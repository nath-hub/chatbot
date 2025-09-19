import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/ChatWindow.vue";
import About from "../pages/About.vue";
import Landing from "../pages/Landing.vue";

const routes = [
  { path: "/", name: "Landing", component: Landing },
  { path: "/home", name: "Home", component: Home },
  { path: "/about", name: "About", component: About },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
