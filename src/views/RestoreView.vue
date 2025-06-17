<template>
  <v-container class="py-10" max-width="500">
    <h2 class="text-h5 text-center mb-4 text-black">Recuperar Contraseña</h2>
      <FormularioResetCorreo @exito="handleExito" />
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
import FormularioResetCorreo from '@/components/FormularioResetCorreo.vue'
import ModalComponent from '@/components/ModalComponent.vue'

const mensaje = ref('')
const modalVisible = ref(false)

function handleExito(msg: string) {
  mensaje.value = msg || 'Revisa tu correo. Te hemos enviado un enlace para restablecer tu contraseña.'
  modalVisible.value = true
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-container {
  width: 400px;
  padding: 40px;
  background: #fafafa;
  border-radius: 10px;
}

form {
  display: flex;
  flex-direction: column;
}

input {
  background-color: #fafafa;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid black;
  border-radius: 4px;
  font-size: 12px;
}

button {
  background: #bb71e8;
  color: white;
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
}
</style>
