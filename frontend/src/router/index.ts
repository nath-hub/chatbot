import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/ChatWindow.vue";
import About from "../pages/About.vue";
import Landing from "../pages/Landing.vue";
import Login from "../components/Login.vue"
import Verify from "../components/Verify.vue";

const routes = [
  { path: "/", name: "Landing", component: Landing },
  //  { path: "/home", redirect: "/login" },
  { path: "/home", name: "Home", component: Home },
  { path: "/about", name: "About", component: About },
  { path: "/login", name: "Login", component: Login }, 
  { path: "/verify", name: "Verify", component: Verify },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
