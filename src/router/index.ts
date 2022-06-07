import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import PrivacyView from "../views/PrivacyView.vue";
import TermsOfUseView from "../views/TermsOfUseView.vue";
import NotFound from "../views/NotFoundView.vue";
import ProfileView from "../views/ProfileView.vue";
import SearchView from "../views/SearchView.vue";
import UserView from "../views/UserView.vue";
import PasswordChangedView from "../views/PasswordChangedView.vue";
import EmailChangedView from "../views/EmailChangedView.vue";
import { useStore } from "@/stores/store";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: (to) => {
        return { path: "/login" };
      },
    },
    {
      path: "/login",
      component: LoginView,
    },
    {
      path: "/register",
      component: RegisterView,
    },
    {
      path: "/privacy",
      component: PrivacyView,
    },
    {
      path: "/terms-of-use",
      component: TermsOfUseView,
    },
    {
      path: "/email-changed",
      component: EmailChangedView,
    },
    {
      path: "/password-changed",
      component: PasswordChangedView,
    },
    {
      path: "/search",
      component: SearchView,
      meta: {
        requiresLogin: true,
      },
    },
    {
      path: "/profile",
      component: ProfileView,
      meta: {
        requiresLogin: true,
      },
    },
    {
      path: "/user/:id",
      component: UserView,
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
