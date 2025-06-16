<template>
  <div>
    <v-form @submit.prevent="confirmar">
      <v-text-field
        v-model="nueva"
        label="Nueva Contraseña"
        type="password"
        required
        :error-messages="errores"
        class="text-black"
      />
      <v-btn type="submit" color="primary" block>Confirmar</v-btn>
    </v-form>

    <!-- ALERTA DE ERROR -->
    <v-alert
      v-if="mensajeError"
      type="error"
      class="mt-4"
      dismissible
    >
      {{ mensajeError }}
    </v-alert>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const nueva = ref('')
const errores = ref<string[]>([])
const mensajeError = ref('')
const route = useRoute()
const router = useRouter()

const confirmar = async () => {
  errores.value = []
  mensajeError.value = ''

  if (!nueva.value || nueva.value.length < 3) {
    errores.value.push('La contraseña debe tener al menos 3 caracteres.')
    return
  }

  const token = route.params.token
  const res = await fetch('http://localhost:3333/confirmar-reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, nueva: nueva.value }),
  })

  const data = await res.json()

  if (res.ok) {
    router.push('/login')
  } else {
    mensajeError.value = data.message || 'Ocurrió un error'
  }
}
</script>
