<template>
  <div class="pa-4">
    <!-- TABLA -->
    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="serverItems"
      :items-length="totalItems"
      :loading="loading"
      :search="search"
      item-value="id"
      @update:options="loadItems"
    >
      <template v-slot:item.producto="{ item }: { item: { producto?: { nombre?: string } } }">
        {{ item.producto?.nombre ?? 'Sin nombre' }}
      </template>

      <template v-slot:item.fecha="{ item }">
        {{ new Date(item.fecha).toISOString().slice(0, 10) }}
      </template>

      <template v-slot:tfoot>
        <tr>
          <td colspan="6">
            <v-text-field
              v-model="name"
              class="ma-2"
              density="compact"
              placeholder="Buscar por producto..."
              hide-details
            />
          </td>
        </tr>
      </template>
    </v-data-table-server>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
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

// Métodos
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

watch(name, () => {
  search.value = Date.now().toString()
})

onMounted(() => {
  loadItems(currentOptions.value)
})
</script>
