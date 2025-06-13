<script setup lang="ts">
import { authSetStore } from '../stores/AuthStore'
import { ref } from 'vue'

const authStore = authSetStore()
const email = ref('')
const password = ref('')

const handlerLogin = () => {
  if (!email.value || !password.value) {
    alert('todos los campos son necesarios.')
    return
  } else {
    authStore.login({
      email: email.value,
      password: password.value,
    })
  }
}
</script>

<template>
  <div
    style="
      max-width:500px;
      margin: 60px auto 0 auto;
      display: flex;
      justify-content: flex-end;
    "
  >
    <v-card
      class="pa-6"
      style="
        width:550px;
        background-color: #fafafa;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      "
    >
      <h1 class="text-h4 text-center mb-6" style="font-weight: 700">Ingresar</h1>

      <v-form @submit.prevent="handlerLogin">
        <v-text-field
          v-model="email"
          label="Email"
          type="text"
          variant="outlined"
          density="comfortable"
          class="mb-4"
          style="font-size: 24px; width: 100%"
          input-style="font-size: 24px; height: 64px;"
        />
        <v-text-field
          v-model="password"
          label="Contraseña"
          type="password"
          variant="outlined"
          density="comfortable"
          class="mb-6"
          style="font-size: 24px; width: 100%"
          input-style="font-size: 24px; height: 64px;"
        />
        <v-btn
          type="submit"
          block
          style="background-color: #bb71e8; color: white; font-size: 20px; padding: 18px 0; border-radius: 12px;"
        >
          Iniciar sesión
        </v-btn>

        <div class="text-center mt-8" style="font-size: 16px">
          <p class="mb-3">
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
  </div>
</template>

<style scoped>
</style>
