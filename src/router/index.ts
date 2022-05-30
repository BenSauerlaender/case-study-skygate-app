import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import PrivacyView from '../views/PrivacyView.vue'
import TermsOfUseView from '../views/TermsOfUseView.vue'
import NotFound from '../views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: to => {
        return { path: "/login"}
      }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: PrivacyView
    },
    {
      path: '/terms-of-use',
      name: 'terms-of-use',
      component: TermsOfUseView
    },
    { path: '/404', alias: '/:pathMatch(.*)*', component: NotFound,}
  ]
})

export default router