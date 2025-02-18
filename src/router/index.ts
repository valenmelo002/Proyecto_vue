import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import RestoreView from '../views/RestoreView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },

    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },

    {
      path: '/restore',
      name: 'restore',
      component: RestoreView,
    },

    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
  ],
})

export default router
