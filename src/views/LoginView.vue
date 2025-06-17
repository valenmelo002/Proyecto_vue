<script setup lang="ts">
import { authSetStore } from '../stores/AuthStore'
import { ref } from 'vue'

const authStore = authSetStore()
const email = ref('')
const password = ref('')

const handlerLogin = () => {
  if (!email.value || !password.value) {
    alert('Todos los campos son necesarios.')
    return
  }

  authStore.login({
    email: email.value,
    password: password.value,
  })
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
        style="background-color: #bb71e8; color: white; font-size: 16px; padding: 14px 0; border-radius: 12px;"
      >
        Iniciar sesión
      </v-btn>

      <div class="text-center mt-6" style="font-size: 14px">
        <p class="mb-2">
          <RouterLink to="/Restore" class="text-decoration-underline" style="color: #555">
            ¿Has olvidado tu contraseña?
          </RouterLink>
        </p>
        <p>
          <RouterLink to="/Register" class="text-decoration-underline" style="color: #555">
            Regístrate ahora
          </RouterLink>
        </p>
      </div>
    </v-form>
  </v-card>
</template>
