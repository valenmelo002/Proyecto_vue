import { createRouter, createWebHistory } from 'vue-router';
import { authSetStore } from '@/stores/AuthStore';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import RestoreView from '@/views/RestoreView.vue';
import DashboardView from '@/views/DashboardView.vue';
import InventarioView from '@/views/InventoryView.vue';
import ProductsView from '@/views/ProductsView.vue';
import ProviderView from '@/views/ProviderView.vue';
import FacturaCompra from '@/views/facturaCompra.vue';
import entradaSalidaProductosView from '@/views/imagenGramera.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { layout: 'AuthLayout' }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { layout: 'AuthLayout' }
    },
    {
      path: '/restore',
      name: 'restore',
      component: RestoreView,
      meta: { layout: 'AuthLayout' }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { layout: 'WireframeLayout' }
    },
    {
      path: '/inventario',
      name: 'inventario',
      component: InventarioView,
      meta: { layout: 'WireframeLayout' }
    },
    {
      path: '/producto',
      name: 'producto',
      component: ProductsView,
      meta: { layout: 'WireframeLayout' }
    },
    {
      path: '/proveedores',
      name: 'proveedores',
      component: ProviderView,
      meta: { layout: 'WireframeLayout' }
    },   
    {
      path: '/facturaCompra',
      name: 'facturaCompra',
      component: FacturaCompra,
    },
      {
      path: '/zona-pesaje',
      name: 'zona-pesaje',
      component: entradaSalidaProductosView,
      meta: { layout: 'WireframeLayout' }
    }
    
  ]
});

router.beforeEach((to, from, next) => {
  const authStore = authSetStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated()) {
    next('/login');
  } else {
    next();
  }
});

export default router;
