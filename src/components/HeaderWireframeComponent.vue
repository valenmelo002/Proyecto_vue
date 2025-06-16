<template>
  <v-app-bar
    app
    flat
    color="#2e2e2e"
    density="default"
  >
    <!-- Botón hamburguesa solo visible en pantallas pequeñas hasta 1280px -->
    <v-app-bar-nav-icon
      class="d-block d-md-none"
      @click="$emit('toggle-drawer')"
    />

    <!-- Logo visible solo en pantallas medianas y más grandes -->
    <LogoComponent class="logo mr-4 d-none d-md-flex" />

    <!-- Footer del header (oculto en pantallas pequeñas) -->
    <TopFooterComponent class="d-none d-md-flex" />

    <!-- Botón cerrar sesión -->
    <div class="d-flex align-center gap-4 ml-auto">
      <v-btn class="logout-button" color="error" @click="logout" size="small" variant="flat">
        Cerrar sesión
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import { authSetStore } from '@/stores/AuthStore'
import { useRouter } from 'vue-router'
import LogoComponent from '@/components/LogoComponent.vue'
import TopFooterComponent from '@/components/TopFooterComponent.vue'

const emit = defineEmits(['toggle-drawer'])

const authStore = authSetStore()
const router = useRouter()

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
/* Estilos para el logo */
.logo {
  height: 5.0rem;
  width: 5.0rem;
  margin-left: 1rem;
  transition: all 0.3s ease;
}

/* Botón de logout */
.logout-button {
  margin-right: 1rem;
  width: 120px;
  font-size: clamp(13px, 1.5vw, 14.5px);
  font-weight: 600;
}

/* Ajustes para pantallas pequeñas hasta 1280px */
@media (max-width: 1280px) {
  /* Reduce el tamaño del logo en pantallas más pequeñas */
  .logo {
    height: 4.0rem;
    width: 4.0rem;
  }

  /* Botón logout más grande y accesible en móviles */
  .logout-button {
    width: 130px;
    font-size: 14px;
  }

  /* Mostrar hamburguesa solo en pantallas pequeñas (hasta 1280px) */
  .d-md-none {
    display: block !important;
  }

  /* Mostrar logo y footer solo en pantallas grandes (a partir de 1280px) */
  .d-none {
    display: none !important;
  }

  .d-md-flex {
    display: flex !important;
  }
}

/* Ajustes para pantallas más pequeñas (menos de 960px) */
@media (max-width: 960px) {
  /* Establece el tamaño del logo en pantallas más pequeñas de 960px */
  .logo {
    height: 3.5rem;
    width: 3.5rem;
  }

  /* Botón logout más accesible */
  .logout-button {
    width: 140px;
    font-size: 15px;
  }

  /* Muestra solo el logo y el botón hamburguesa */
  .d-md-none {
    display: block !important;
  }
}
</style>
