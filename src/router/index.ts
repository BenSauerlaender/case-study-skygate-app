import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import PrivacyView from "../views/PrivacyView.vue";
import TermsOfUseView from "../views/TermsOfUseView.vue";
import NotFound from "../views/NotFoundView.vue";
import ProfileView from "../views/ProfileView.vue";
import SearchView from "../views/SearchView.vue";
import { useStore } from "@/stores/store";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      redirect: (to) => {
        return { path: "/login" };
      },
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/privacy",
      name: "privacy",
      component: PrivacyView,
    },
    {
      path: "/terms-of-use",
      name: "terms-of-use",
      component: TermsOfUseView,
    },
    {
      path: "/search",
      name: "search",
      component: SearchView,
      meta: {
        requiresLogin: true,
      },
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfileView,
      meta: {
        requiresLogin: true,
      },
    },
    { path: "/404", alias: "/:pathMatch(.*)*", component: NotFound },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresLogin)) {
    const store = useStore();
    if (!store.loggedIn) {
      next("/login");
      return;
    }
  }
  next();
});

export default router;
