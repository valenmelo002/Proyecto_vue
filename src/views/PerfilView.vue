<template>
  <div class="pa-4">
    <h1 class="text-h4 font-weight-bold text-center mb-6">Perfil de Usuario</h1>

    <v-card class="mx-auto pa-6" max-width="600" elevation="10" rounded="xl">
      <v-row justify="center" class="mb-4">
        <v-avatar size="100" class="position-relative">
          <v-img :src="avatarPreview" alt="Avatar" />
          <v-btn
            icon
            class="position-absolute bottom-0 right-0"
            size="small"
            @click="avatarInput?.value?.click()"
          >
            <v-icon>mdi-camera</v-icon>
          </v-btn>
        </v-avatar>

        <input
          ref="avatarInput"
          type="file"
          accept="image/*"
          class="d-none"
          @change="onAvatarChange"
        />
      </v-row>

      <v-form v-model="valid" ref="form">
        <v-text-field
          v-model="form.nombre"
          label="Nombre completo"
          :rules="[v => !!v || 'Campo requerido']"
          variant="outlined"
          class="mb-4"
        />

        <v-text-field
          v-model="form.email"
          label="Correo electrónico"
          :rules="[v => !!v || 'Campo requerido', v => /.+@.+\..+/.test(v) || 'Correo inválido']"
          variant="outlined"
          class="mb-4"
        />

        <v-text-field
          v-model="form.telefono"
          label="Teléfono"
          variant="outlined"
          class="mb-4"
        />

        <v-btn
          color="purple-darken-3"
          variant="flat"
          size="large"
          block
          @click="guardarPerfil"
        >
          Guardar Cambios
        </v-btn>
      </v-form>
    </v-card>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const valid = ref(false)
const avatarInput = ref<HTMLInputElement | null>(null)
const form = ref({
  nombre: 'Ana Ruiz',
  email: 'ana.ruiz@example.com',
  telefono: '3201234567',
})

const avatarPreview = ref('https://i.pravatar.cc/100?img=3')

const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
})

function guardarPerfil() {
  if (valid.value) {
    snackbar.value.text = 'Perfil actualizado con éxito'
    snackbar.value.color = 'success'
    snackbar.value.show = true
  } else {
    snackbar.value.text = 'Por favor completa los campos obligatorios'
    snackbar.value.color = 'error'
    snackbar.value.show = true
  }
}

function onAvatarChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = e => {
      avatarPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}
</script>
