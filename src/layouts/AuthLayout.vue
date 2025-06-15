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
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 40px;
  gap: 80px;
  flex-wrap: wrap;
  margin-bottom: 100px; /* para que no lo tape el footer fijo */
}

.logo-container {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
}

.form-container {
  width: 100%;
  max-width: 420px;
}

@media (max-width: 600px) {
  .auth-layout {
    flex-direction: column;
    padding: 24px 16px;
    gap: 32px;
  }

  .form-container {
    max-width: 100%;
  }
}
</style>
