<template>
  <div>
    <v-form v-if="mostrarFormulario" @submit.prevent="confirmar">
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  token: string
}>()

const nueva = ref('')
const errores = ref<string[]>([])
const mensajeError = ref('')
const mostrarFormulario = ref(true)
const router = useRouter()

const emit = defineEmits<{
  (e: 'exito', msg: string): void
}>()

// 🔍 Verificación automática del token al montar
onMounted(async () => {
  const res = await fetch(`http://localhost:3333/verificar-token/${props.token}`)
  const data = await res.json()

  if (!res.ok) {
    mensajeError.value = data.message || 'Token inválido o expirado'
    mostrarFormulario.value = false
    setTimeout(() => router.push('/login'), 2500)
  }
})

const confirmar = async () => {
  errores.value = []
  mensajeError.value = ''

  if (!nueva.value || nueva.value.length < 3) {
    errores.value.push('La contraseña debe tener al menos 3 caracteres.')
    return
  }

  const res = await fetch('http://localhost:3333/confirmar-reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: props.token, nueva: nueva.value }),
  })

  const data = await res.json()

  if (res.ok) {
    emit('exito', 'Contraseña restablecida correctamente. Serás redirigido al login...')
    setTimeout(() => router.push('/login'), 3500)
  } else {
    const msg = data.message || 'Ocurrió un error'
    mensajeError.value = msg

    if (msg.includes('utilizado') || msg.includes('expirado')) {
      setTimeout(() => router.push('/login'), 3500)
    }
  }
}
</script>
