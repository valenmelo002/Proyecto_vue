<template>
  <v-container class="py-10" max-width="500">
<h2 class="text-h5 text-center mb-4 text-black">Restablecer Contraseña</h2>

    <FormularioResetPassword :token="token" @exito="handleExito" />

    <ModalComponent
      v-model="modalVisible"
      title="Éxito"
      :message="mensaje"
      @confirm="modalVisible = false"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import FormularioResetPassword from '@/components/FormularioResetPassword.vue'
import ModalComponent from '@/components/ModalComponent.vue'

const route = useRoute()
const token = route.params.token as string

const mensaje = ref('')
const modalVisible = ref(false)

function handleExito(msg: string) {
  mensaje.value = msg
  modalVisible.value = true
}
</script>
