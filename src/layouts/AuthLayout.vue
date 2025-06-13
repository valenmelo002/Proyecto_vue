<template>
  <div class="auth-layout">
    <div class="logo-container">
      <HeaderComponent />
    </div>

    <div class="form-container">
      <RouterView />
    </div>
  </div>

  <FooterComponent />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import HeaderComponent from '@/components/HeaderComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'
</script>

<style scoped>
.auth-layout {
  display: flex;
  align-items: center; /* ✅ centra verticalmente logo y formulario */
  justify-content: center;
  gap:140px;
  min-height: 80vh;
  padding: 40px;
}

/* Logo no se estira ni empuja */
.logo-container {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Formulario con ancho fijo */
.form-container {
  width:600px;
}
</style>
