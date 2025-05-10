<template>
  <header class="header">
    <h1>Dashboard</h1>
    <div class="user-info">
      <span>👤 Usuario</span>
      <button @click="logout">🚪 Cerrar sesión</button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { authSetStore } from '@/stores/AuthStore';
import { useRouter } from 'vue-router'

const authStore = authSetStore();
const router = useRouter()

const logout = () => {
  console.log('Cerrando sesión...')
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #b8b9b9d0;
  color: white;
  padding: 15px 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

button {
  background: #e73c3c;
  border: none;
  padding: 8px 12px;
  color: white;
  cursor: pointer;
  border-radius: 5px;
}

button:hover {
  background: #c0392b;
}
</style>
