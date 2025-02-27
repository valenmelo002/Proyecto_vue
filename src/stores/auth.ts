import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token') || '', // Se guarda en el localStorage para persistencia
    isAuthenticated: !!localStorage.getItem('token'), // Verifica si hay token almacenado
  }),

  actions: {
    // Método para iniciar sesión
    login(userData: { username: string }, token: string) {
      this.user = userData
      this.token = token
      this.isAuthenticated = true
      localStorage.setItem('token', token) // Guardar token
      localStorage.setItem('user', JSON.stringify(userData)) // Guardar usuario
    },

    // Método para cerrar sesión
    logout() {
      this.user = null
      this.token = ''
      this.isAuthenticated = false
      localStorage.removeItem('token') // Eliminar token del almacenamiento
      localStorage.removeItem('user') // Eliminar usuario del almacenamiento
    },
  },
})
