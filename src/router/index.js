import { createRouter, createWebHashHistory } from "vue-router";
import homeView from "../views/home-view.vue";
import boardView from "../views/board-view.vue";
import welcomeView from "../views/welcome-view.vue";
import authView from "../views/auth-view.vue";
import logIn from "../components/auth/log-in.vue";
import signUp from "../components/auth/sign-up.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/auth",
      name: "auth",
      component: authView,
      children: [
        {
          path: "login",
          component: logIn,
        },
        {
          path: "signup",
          component: signUp,
        },
      ],
    },
    {
      path: "/welcome",
      name: "welcome",
      component: welcomeView,
    },
    {
      path: "/",
      name: "home",
      component: homeView,
    },
    {
      path: "/board/:boardId",
      name: "board",
      component: boardView,
    },
  ],
});

export default router;
