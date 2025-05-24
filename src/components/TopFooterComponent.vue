<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

// Extraemos el último segmento de la ruta como nombre de vista
const viewName = route.name?.toString() || 'Vista'
</script>

<template>
  <footer class="top-footer">
    <div class="view-name">
      {{ viewName }}
    </div>
  </footer>
</template>

<style scoped>
.top-footer {
  color: white;
  text-align: center;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-name {
  font-size: 2.1rem;
  text-align: center;
  font-family: Roboto, sans-serif;
  text-transform: capitalize;
}
</style>
