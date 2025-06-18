<template>
  <v-container class="py-10" max-width="600">
    <h2 class="text-h5 text-center mb-4">Enlace de Recuperación Generado</h2>
    <v-alert type="info" text>
      Este es tu enlace de recuperación:<br />
      <strong>{{ enlace }}</strong>
    </v-alert>
    <v-btn color="primary" @click="volver">Volver al login</v-btn>
  </v-container>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const enlace = route.query.link

const volver = () => {
  router.push('/login')
}
</script>
