<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default defineComponent({
  name: 'LoginView',
  setup() {
    const username = ref('')
    const password = ref('')
    const router = useRouter()
    const authStore = useAuthStore()

    const login = () => {
      // Verificar si los campos están vacíos
      if (!username.value || !password.value) {
        alert('Por favor, ingresa usuario y contraseña') // Alerta si algún campo está vacío
        return
      }

      const fakeUsers = [
        { username: 'Adso', password: '123' },
        { username: 'Juan', password: '456' },
        { username: 'Maria', password: '789' },
      ]

      const user = fakeUsers.find(
        (u) => u.username === username.value && u.password === password.value,
      )

      if (user) {
        // Aquí puedes agregar la simulación de login
        const fakeToken = 'fake-jwt-token' // Token simulado
        const fakeUser = { user, fakeToken } // Datos del usuario simulado

        // Guardamos el token y el usuario en Pinia
        authStore.login(fakeUser, fakeToken)

        console.log('Inicio de sesión exitoso')
        router.push('/home') // Redirigir al home
      } else {
        alert('Usuario o contraseña incorrectos')
      }
    }

    return {
      username,
      password,
      login,
    }
  },
})
</script>

<template>
  <div class="container">
    <div class="form-container">
      <h1>Ingresar</h1>
      <form @submit.prevent="login">
        <input
          type="text"
          v-model="username"
          id="username"
          name="username"
          placeholder="Username"
        />
        <input type="password" v-model="password" placeholder="Contraseña" />
        <button type="submit">Iniciar sesion</button>

        <p><Router-link to="/Restore">¿Has olvidado tu contraseña?</Router-link></p>
        <p><Router-link to="/Register">Regístrate ahora</Router-link></p>
      </form>
    </div>
  </div>
</template>

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

h1 {
  text-align: center;
  color: black;
  margin-bottom: 10px;
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
  cursor: pointer;
}

p {
  text-align: center;
  font-size: 14px;
  margin-top: 20px;
}

button:hover {
  background-color: #a24edf;
}
</style>
