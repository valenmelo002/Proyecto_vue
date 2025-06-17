<template>
  <v-app>
    <!-- Header con botón para abrir/cerrar el sidebar -->
    <HeaderWireframeComponent @toggle-drawer="drawer = !drawer" />

    <!-- Sidebar controlado por la variable 'drawer' -->
    <SidebarWireframeComponent :drawer="drawer" />

    <!-- Contenido principal -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import SidebarWireframeComponent from '@/components/SidebarWireframeComponent.vue'
import HeaderWireframeComponent from '@/components/HeaderWireframeComponent.vue'
import { provide, ref, onMounted } from 'vue'

// Estado del menú lateral (drawer)
const drawer = ref(window.innerWidth >= 1280) // true si pantalla grande

// Datos del usuario
const userData = ref({
  nombre: '',
  email: '',
  avatar: 'https://i.pravatar.cc/100?img=3',
})

// Cargar desde localStorage
onMounted(() => {
  const localUser = localStorage.getItem('user')
  if (localUser) {
    const parsed = JSON.parse(localUser)
    userData.value = {
      nombre: parsed.nombre,
      email: parsed.correo,
      avatar: parsed.avatar || 'https://i.pravatar.cc/100?img=3',
    }
  }
})

// Proveer datos del usuario para uso global (inject)
provide('userData', userData)
</script>
