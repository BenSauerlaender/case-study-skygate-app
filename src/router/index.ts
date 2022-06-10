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
      //'homepage' is either profile or login
      path: "/",
      redirect: (to) => {
        const store = useStore();
        if (store.loggedIn) {
          return { path: "/profile" };
        } else {
          return { path: "/login" };
        }
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
      //show simple message after the email was changed successful
      path: "/email-changed",
      component: EmailChangedView,
    },
    {
      //show simple message after the password was changed successful
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

//ensures that specific sites are only accessible if the user is logged in
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
