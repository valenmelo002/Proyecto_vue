<template>
  <v-app-bar
    app
    flat
    color="#2e2e2e"
    density="default"
  >
    <!-- Botón hamburguesa solo en pantallas pequeñas -->
    <v-app-bar-nav-icon
      class="d-md-none"
      @click="$emit('toggle-drawer')"
    />

    <!-- Logo -->
    <LogoComponent class="logo mr-4" />

    <!-- Footer del header (oculto en pantallas pequeñas) -->
   <TopFooterComponent class="d-flex" />

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
.logo {
  height: 5.0rem;
  width: 5.0rem;
  margin-left: 1rem;
}

.logout-button {
  margin-right: 1rem;
  width: 100px;
}


</style>
