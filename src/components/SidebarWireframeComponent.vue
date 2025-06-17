<template>
  <v-navigation-drawer
    v-model="internalDrawer"
    :permanent="isDesktop"
    :temporary="!isDesktop"
    expand-on-hover
    rail
    app
    color="#2e2e2e"
  >
    <!-- Datos del usuario -->
    <v-list>
      <v-list-item
        :prepend-avatar="userData?.avatar"
        :subtitle="userData?.email"
        :title="userData?.nombre"
      />
    </v-list>

    <!-- Enlace al perfil -->
    <v-list-item
      prepend-icon="mdi-account-circle"
      title="Perfil"
      to="/perfil"
      link
      @click="closeDrawer"
    />

    <v-divider class="my-2" />

    <!-- Menú principal -->
    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-home" title="Dashboard" to="/dashboard" link />
      <v-list-item prepend-icon="mdi-clipboard-list" title="Inventario" to="/inventario" link />
      <v-list-item prepend-icon="mdi-cube-outline" title="Productos" to="/producto" link />
      <v-list-item prepend-icon="mdi-view-list" title="Historial" to="/historial-inventario" link />
      <v-list-item prepend-icon="mdi-truck" title="Recepción" to="/recepcion" link />
      <v-list-item prepend-icon="mdi-cash-multiple" title="mesas" to="/mesa" link />
      <v-list-item prepend-icon="mdi-account-circle" title="Cajero" to="/cajero" link />
      <v-list-item prepend-icon="mdi-account-group" title="Proveedores" to="/proveedores" link />
      <v-list-item prepend-icon="mdi-box" title="zona-pesaje" to="/zona-pesaje" link />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { inject, ref, watch, onMounted, onBeforeUnmount } from 'vue'

// Props: recibe control desde el layout
const props = defineProps<{ drawer: boolean }>()
const internalDrawer = ref(props.drawer)
watch(() => props.drawer, (val) => (internalDrawer.value = val))

// Determinar si es pantalla de escritorio
const isDesktop = ref(window.innerWidth >= 1280)
const handleResize = () => {
  isDesktop.value = window.innerWidth >= 1280
  if (!isDesktop.value) internalDrawer.value = false
  else internalDrawer.value = true
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

// Función para cerrar el drawer en pantallas pequeñas al navegar
const closeDrawer = () => {
  if (!isDesktop.value) {
    internalDrawer.value = false
  }
}

// Usuario desde provide
const userData = inject('userData')
</script>

<style scoped>
.v-navigation-drawer {
  border-right: 1px solid #eee;
}

/* Ajustar el drawer en pantallas pequeñas */
@media (max-width: 1280px) {
  .v-navigation-drawer {
    width: 250px;
  }
}
</style>
