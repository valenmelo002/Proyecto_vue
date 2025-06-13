<template>
  <div class="pa-4">
    <h1 class="text-h4 font-weight-bold text-center mb-6">Perfil de Usuario</h1>

    <v-card class="mx-auto pa-6" max-width="600" elevation="10" rounded="xl">
      <!-- Avatar + Botón de edición -->
      <v-row justify="center" class="mb-4">
        <v-avatar size="100" class="position-relative">
          <v-img :src="avatarPreview" alt="Avatar" />
          <v-btn
            icon
            class="position-absolute bottom-0 right-0"
            size="small"
            @click="abrirSelectorAvatar"
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

      <!-- Formulario -->
      <v-form v-model="valid" ref="formRef">
        <v-text-field
          v-model="form.nombre"
          label="Nombre completo"
          :rules="[v => !!v || 'Campo requerido']"
          variant="outlined"
          class="mb-4"
        />

        <v-text-field
          v-model="form.correo"
          label="Correo electrónico"
          readonly
          variant="outlined"
          class="mb-4"
        />

        <v-btn
          color="#1867C0"
          variant="flat"
          size="large"
          block
          @click="guardarPerfil"
        >
          Guardar Cambios
        </v-btn>
      </v-form>
    </v-card>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>

    <!-- Modal cambiar contraseña -->
    <div class="text-center mt-4">
      <span
        class="text-#1867C0 font-weight-medium"
        style="cursor: pointer;"
        @click="abrirModal"
      >
        ¿Quieres cambiar contraseña?
      </span>
    </div>

    <v-dialog v-model="modalPassword" max-width="500">
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">Cambiar Contraseña</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="passwordForm.actual"
            label="Contraseña actual"
            type="password"
            :rules="[v => !!v || 'Campo obligatorio']"
            class="mb-4"
          />
          <v-text-field
            v-model="passwordForm.nueva"
            label="Nueva contraseña"
            type="password"
            :rules="[v => !!v || 'Campo obligatorio']"
            class="mb-4"
          />
          <v-text-field
            v-model="passwordForm.confirmacion"
            label="Confirmar contraseña"
            type="password"
            :rules="[v => !!v || 'Campo obligatorio']"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="cerrarModal">Cancelar</v-btn>
          <v-btn color="#1867C0" @click="cambiarPassword">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, inject } from 'vue'
import { authSetStore } from '@/stores/AuthStore'
import UserService from '@/services/UserService'

// Store + contexto global
const store = authSetStore()
const userData = inject('userData') as any

const valid = ref(false)
const formRef = ref()

const avatarInput = ref<HTMLInputElement | null>(null)
const avatarPreview = ref('https://i.pravatar.cc/100?img=3')

const form = ref({
  nombre: store.user?.nombre || '',
  correo: store.user?.correo || '',
})

watch(
  () => store.user,
  (user) => {
    if (user) {
      form.value.nombre = user.nombre
      form.value.correo = user.correo
      avatarPreview.value = user.avatar || avatarPreview.value
    }
  },
  { immediate: true }
)

const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
})

function abrirSelectorAvatar() {
  avatarInput.value?.click()
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

async function guardarPerfil() {
  const isValid = await formRef.value?.validate()

  if (isValid) {
    store.user.nombre = form.value.nombre
    store.user.avatar = avatarPreview.value
    localStorage.setItem('user', JSON.stringify(store.user))

    // Actualizar datos globales del layout
    if (userData) {
      userData.value.nombre = store.user.nombre
      userData.value.email = store.user.correo
      userData.value.avatar = store.user.avatar || avatarPreview.value
    }

    snackbar.value = {
      show: true,
      text: 'Perfil actualizado con éxito',
      color: 'success',
    }
  } else {
    snackbar.value = {
      show: true,
      text: 'Por favor completa los campos obligatorios',
      color: 'error',
    }
  }
}

// Modal para cambiar contraseña
const modalPassword = ref(false)

const passwordForm = ref({
  actual: '',
  nueva: '',
  confirmacion: '',
})

function abrirModal() {
  modalPassword.value = true
}

function cerrarModal() {
  modalPassword.value = false
  passwordForm.value = { actual: '', nueva: '', confirmacion: '' }
}

async function cambiarPassword() {
  const { actual, nueva, confirmacion } = passwordForm.value
  const correo = store.user?.correo

  if (!correo) {
    snackbar.value = {
      show: true,
      text: 'No se pudo obtener el correo del usuario',
      color: 'error',
    }
    return
  }

  if (!actual || !nueva || !confirmacion) {
    snackbar.value = {
      show: true,
      text: 'Todos los campos son obligatorios',
      color: 'error',
    }
    return
  }

  if (nueva !== confirmacion) {
    snackbar.value = {
      show: true,
      text: 'Las contraseñas no coinciden',
      color: 'error',
    }
    return
  }

  try {
    const service = new UserService()
    await service.cambiarPassword(correo, actual, nueva)

    snackbar.value = {
      show: true,
      text: 'Contraseña actualizada correctamente',
      color: 'success',
    }

    cerrarModal()
  } catch (error: any) {
    snackbar.value = {
      show: true,
      text: error.message || 'Error al cambiar la contraseña',
      color: 'error',
    }
  }
}
</script>
