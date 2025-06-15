<template>
  <v-container fluid class="pa-4">
    <!-- FILTRO -->
    <v-row justify="end" class="mb-4">
      <v-col cols="12" sm="6" md="4">
        <v-text-field
          v-model="name"
          density="compact"
          placeholder="Buscar por producto..."
          prepend-inner-icon="mdi-magnify"
          hide-details
          variant="outlined"
        />
      </v-col>
    </v-row>

    <!-- RESPONSIVE -->
    <div v-if="isMobile">
      <v-row dense>
        <v-col
          v-for="item in serverItems"
          :key="item.id"
          cols="12"
        >
          <v-card class="pa-3 mb-2" elevation="2">
            <div><strong>Producto:</strong> {{ item.producto?.nombre ?? 'Sin nombre' }}</div>
            <div><strong>Movimiento:</strong> {{ item.tipoMovimiento }}</div>
            <div><strong>Cantidad:</strong> {{ item.cantidad }}</div>
            <div><strong>Fecha:</strong> {{ formatDate(item.fecha) }}</div>
            <div><strong>Descripción:</strong> {{ item.descripcion }}</div>
          </v-card>
        </v-col>
      </v-row>

      <!-- PAGINACIÓN MANUAL -->
      <v-pagination
        v-model="currentOptions.page"
        :length="Math.ceil(totalItems / currentOptions.itemsPerPage)"
        total-visible="5"
        class="mt-4"
        @update:modelValue="loadItems(currentOptions)"
      />
    </div>

    <!-- TABLA EN iPAD MINI O MÁS GRANDE -->
    <v-data-table-server
      v-else
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="serverItems"
      :items-length="totalItems"
      :loading="loading"
      :search="search"
      item-value="id"
      class="elevation-1"
      @update:options="loadItems"
    >
      <template #item.producto="{ item }">
        {{ item.producto?.nombre ?? 'Sin nombre' }}
      </template>

      <template #item.fecha="{ item }">
        {{ formatDate(item.fecha) }}
      </template>
    </v-data-table-server>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import HistorialInventarioService from '@/services/HistorialInventarioService'

// Columnas de la tabla
const headers = ref([
  { title: 'Producto', key: 'producto' },
  { title: 'Movimiento', key: 'tipoMovimiento' },
  { title: 'Cantidad', key: 'cantidad' },
  { title: 'Fecha', key: 'fecha' },
  { title: 'Descripción', key: 'descripcion' },
])

// Estados
const itemsPerPage = ref(5)
const serverItems = ref([])
const totalItems = ref(0)
const loading = ref(false)
const name = ref('')
const search = ref('')
const currentOptions = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [],
})

// Mobile detection (menor a 768px)
const isMobile = ref(false)

const checkWidth = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkWidth()
  window.addEventListener('resize', checkWidth)
  loadItems(currentOptions.value)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkWidth)
})

// Watch para búsquedas
watch(name, () => {
  search.value = Date.now().toString()
})

// Formato de fecha
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toISOString().slice(0, 10)
}

// Cargar datos desde API
function loadItems(options: any) {
  currentOptions.value = options
  loading.value = true

  HistorialInventarioService.getPaginated({
    page: options.page,
    itemsPerPage: options.itemsPerPage,
    sortBy: options.sortBy,
    search: { producto: name.value },
  })
    .then(({ items, total }) => {
      serverItems.value = items
      totalItems.value = total
    })
    .catch((error) => {
      console.error('Error al cargar historial:', error)
    })
    .finally(() => {
      loading.value = false
    })
}
</script>
