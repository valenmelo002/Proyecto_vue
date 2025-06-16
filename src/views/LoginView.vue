<script setup lang="ts">
import { authSetStore } from '../stores/AuthStore'
import { ref } from 'vue'

const authStore = authSetStore()
const email = ref('')
const password = ref('')

const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('red')

const handlerLogin = async () => {
  if (!email.value || !password.value) {
    snackbarText.value = 'Todos los campos son obligatorios.'
    snackbarColor.value = 'red'
    snackbar.value = true
    return
  }

  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    })
  } catch (err) {
    snackbarText.value = 'Credenciales incorrectas.'
    snackbarColor.value = 'red'
    snackbar.value = true
  }
}
</script>

<template>
  <v-card
    class="pa-6"
    style="
      width: 100%;
      max-width: 420px;
      background-color: #fafafa;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    "
  >
    <h1 class="text-h5 text-center mb-6" style="font-weight: 700">Ingresar</h1>

    <v-form @submit.prevent="handlerLogin">
      <v-text-field
        v-model="email"
        label="Email"
        type="text"
        variant="outlined"
        density="comfortable"
        class="mb-4"
      />
      <v-text-field
        v-model="password"
        label="Contraseña"
        type="password"
        variant="outlined"
        density="comfortable"
        class="mb-6"
      />

      <v-btn
        type="submit"
        block
        style="background-color: #1842ff; color: white; font-size: 16px; padding: 14px 0; border-radius: 12px;"
      >
        Iniciar sesión
      </v-btn>

      <div class="text-center mt-6" style="font-size: 14px">
        <p class="mb-2">
          <RouterLink to="/Restore" class="text-decoration-underline" style="color: #555">
            ¿Has olvidado tu contraseña?
          </RouterLink>
        </p>
      </div>
    </v-form>
  </v-card>

  <v-snackbar
    v-model="snackbar"
    :color="snackbarColor"
    location="top center"
    timeout="3000"
    multi-line
    elevation="10"
  >
    {{ snackbarText }}
  </v-snackbar>
</template>
