import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore} from '../stores/AuthStore'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import RestoreView from '@/views/RestoreView.vue'
import HomeView from '../views/HomeView.vue'
import InventarioView from '@/views/InventarioView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },

    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { layout: 'AuthLayout' },
    },

    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { layout: 'AuthLayout' },
    },

    {
      path: '/restore',
      name: 'restore',
      component: RestoreView,
      meta: { layout: 'AuthLayout' },
    },

    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { layout: 'WireframeLayout' },
    },

    {
      path: '/inventario',
      name: 'inventario',
      component: InventarioView,
      meta: { layout: 'WireframeLayout' },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated()) {
    next('/login') // Si no está autenticado, redirigir al login
  } else {
    next()
  }
})

export default router
