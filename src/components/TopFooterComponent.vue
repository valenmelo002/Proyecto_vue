<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const viewName = computed(() => route.name?.toString() || 'Vista')
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
  background-color: #2e2e2e; /* opcional: fondo púrpura como el layout */
  text-align: center;
  width: 100%;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-name {
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  font-family: Roboto, sans-serif;
  text-transform: capitalize;
  word-break: break-word;
}

/* RESPONSIVE: Ajusta el tamaño de letra en pantallas pequeñas */
@media (max-width: 768px) {
  .view-name {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .view-name {
    font-size: 0.80rem;
    text-align: center;
    margin: 0 auto;
    overflow-wrap: normal;
    word-break: normal;
    white-space: normal;
  }
}

</style>
