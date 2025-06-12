<template>
  <v-app>
    <HeaderWireframeComponent />
    <SidebarWireframeComponent />

      <!-- Contenido principal -->
      <v-main>
          <router-view />
      </v-main>

  </v-app>
</template>

<script setup lang="ts">
import SidebarWireframeComponent from '@/components/SidebarWireframeComponent.vue';
import HeaderWireframeComponent from '@/components/HeaderWireframeComponent.vue';
import { provide, ref, onMounted } from 'vue'

const userData = ref({
  nombre: '',
  email: '',
  avatar: 'https://i.pravatar.cc/100?img=3',
})

// Cargar desde localStorage o store
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

provide('userData', userData)
</script>
