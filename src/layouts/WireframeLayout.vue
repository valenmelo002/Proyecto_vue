<script setup lang="ts">
import SidebarWireframeComponent from '../components/SiderbarWireframeComponent.vue'
import HeaderWireframeComponent from '../components/HeaderWireframeComponent.vue'
</script>

<template>
  <div class="wireframe-container">
    <SidebarWireframeComponent />
    <div class="main-content">
      <HeaderWireframeComponent />
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
.wireframe-container {
  display: flex;
  height: 100vh;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  padding: 20px;
  background: #f4f4f4;
}
</style>
