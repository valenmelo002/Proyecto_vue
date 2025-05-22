<template>
  <v-data-table-server
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items="serverItems"
    :items-length="totalItems"
    :loading="loading"
    :search="search"
    item-value="codigo"
    @update:options="loadItems"
  >
    <template v-slot:tfoot>
      <tr>
        <td>
          <v-text-field v-model="name" class="ma-2" density="compact" placeholder="Buscar por nombre..." hide-details></v-text-field>
        </td>
        <td>
          <v-text-field
            v-model="calories"
            class="ma-2"
            density="compact"
            placeholder="Otro filtro (opcional)"
            type="number"
            hide-details
          ></v-text-field>
        </td>
      </tr>
    </template>
  </v-data-table-server>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import InventarioService from '@/services/InventarioService' // ajusta la ruta si es diferente

const itemsPerPage = ref(5)
const headers = ref([
  { title: 'Código', key: 'codigo' },
  { title: 'Nombre', key: 'nombreProducto' },
  { title: 'Categoría', key: 'categoria' },
  { title: 'Stock', key: 'stock' },
  { title: 'Stock Mínimo', key: 'minStock' },
  { title: 'Unidad', key: 'unidadMedida' },
])

const serverItems = ref([])
const loading = ref(true)
const totalItems = ref(0)
const name = ref('')
const calories = ref('') // Puedes usarlo para otro filtro si deseas
const search = ref('') // trigger reactivo para recargar

type DataTableOptions = {
  page: number
  itemsPerPage: number
  sortBy: { key: string; order: 'asc' | 'desc' }[]
}

function loadItems(options: DataTableOptions) {
  const { page, itemsPerPage, sortBy } = options

  loading.value = true
  InventarioService.getPaginated({
    page,
    itemsPerPage,
    sortBy,
    search: { name: name.value },
  })
    .then(({ items, total }) => {
      serverItems.value = items
      totalItems.value = total
    })
    .catch((error) => {
      console.error('Error al cargar inventario:', error)
    })
    .finally(() => {
      loading.value = false
    })
}


// Refrescar automáticamente si cambian los filtros
watch(name, () => {
  search.value = Date.now().toString()
})
watch(calories, () => {
  search.value = Date.now().toString()
})
</script>
