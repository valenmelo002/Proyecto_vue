import { createRouter, createWebHistory } from 'vue-router';
import { authSetStore } from '@/stores/AuthStore';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import RestoreView from '@/views/RestoreView.vue';
import DashboardView from '@/views/DashboardView.vue';
import InventarioView from '@/views/InventoryView.vue';
import ProductsView from '@/views/ProductsView.vue';
import ProviderView from '@/views/ProviderView.vue';
import HistoryInventoryView from '@/views/HistoryInventoryView.vue';
import ReceptionView from '@/views/ReceptionView.vue';
import entradaSalidaProductosView from '@/views/imagenGramera.vue';
import PerfilView from '@/views/PerfilView.vue';
import UsersView from '@/views/UsersView.vue';
import ConfirmarResetView from '@/views/ConfirmarResetView.vue'
import WireframeLayout from '@/layouts/WireframeLayout.vue';
import FacturaCompraView from '@/views/FacturaCompraView.vue';

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
      path: '/enlace-generado',
      name: 'enlace-generado',
      component: () => import('@/views/EnlaceGeneradoView.vue'),
      meta: { layout: 'AuthLayout' }
    },
    {
    path: '/reset/:token',
    name: 'reset-password',
    component: ConfirmarResetView,
    meta: { layout: 'AuthLayout' }
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: PerfilView,
      meta: { layout: 'WireframeLayout' }
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
      path: '/historial-inventario',
      name: 'historial',
      component: HistoryInventoryView,
      meta: { layout: 'WireframeLayout' }
    },
    {
      path: '/recepcion',
      name: 'recepcion',
      component: ReceptionView,
      meta: { layout: 'WireframeLayout' }
    },
    {
      path: '/proveedores',
      name: 'proveedores',
      component: ProviderView,
      meta: { layout: 'WireframeLayout' }
    },
    {
      path: '/zona-pesaje',
      name: 'zona-pesaje',
      component: entradaSalidaProductosView,
      meta: { layout: 'WireframeLayout' }
    },
    {
      path: '/facturasCompra',
      name: 'facturasCompra',
      component: FacturaCompraView,
      meta: { layout: 'WireframeLayout' }
    },
    {
      path: '/setting/user',
      name: 'usuarios',
      component: UsersView,
      meta: { layout: 'WireframeLayout' }
    },
     {
      path: '/setting/user',
      name: 'usuarios',
      component: UsersView,
      meta: { layout: 'WireframeLayout', requiresAuth: true }
    },
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
