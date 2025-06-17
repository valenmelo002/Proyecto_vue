<template>
  <v-form @submit.prevent="enviar">
    <v-text-field
      v-model="correo"
      label="Correo"
      type="email"
      required
      class="text-black"
    />

    <v-btn color="primary" type="submit" block>
      Enviar enlace
    </v-btn>

    <div class="text-center mt-4">
      <a @click="router.push('/login')" class="text-primary text-decoration-underline" style="cursor: pointer;">
        ¿Recordaste tu contraseña? Inicia sesión
      </a>
    </div>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const correo = ref('')
const mensajeError = ref('')
const mensajeExito = ref('')
const router = useRouter()

const emit = defineEmits<{
  (e: 'exito', msg: string): void
}>()

const enviar = async () => {
  mensajeExito.value = ''
  mensajeError.value = ''

  const res = await fetch('http://localhost:3333/solicitar-reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo: correo.value }),
  })

  const data = await res.json()

  if (res.ok) {
    mensajeExito.value = 'Correo enviado exitosamente. Revisa tu bandeja de entrada.'
    emit('exito', mensajeExito.value)
  } else {
    mensajeError.value = data.message || 'Error al enviar el correo.'
  }
}
</script>
