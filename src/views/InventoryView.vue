<template>
  <div class="pa-4">
    <!-- FORMULARIO -->
    <div class="mb-6" style="max-width: 600px;">
      <v-text-field label="Código" v-model="form.codigo" class="mb-2" />
      <v-text-field label="Nombre del Producto" v-model="form.nombre_producto" />
      <v-text-field label="Categoría" v-model="form.categoria" class="mb-2" />
      <v-text-field label="Stock" v-model.number="form.stock" type="number" class="mb-2" />
      <v-text-field label="Stock Mínimo" v-model.number="form.min_stock" type="number" />
      <v-text-field label="Unidad de Medida" v-model="form.unidad_medida" />

      <v-btn color="primary" @click="confirmDialog = true" :loading="loading" class="mr-2">
        {{ mode === 'create' ? 'Guardar' : 'Actualizar' }}
      </v-btn>
      <v-btn @click="resetForm">Cancelar</v-btn>

      <!-- Modal de confirmación para guardar/actualizar -->
      <ConfirmDialog
        v-model="confirmDialog"
        :title="mode === 'create' ? 'Confirmar creación' : 'Confirmar actualización'"
        :message="mode === 'create'
            ? '¿Desea guardar este producto en el inventario?'
            : '¿Desea actualizar la información de este producto?'"
        @confirm="submit"
        @cancel="confirmDialog = false"
      />
    </div>

    <!-- TABLA -->
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
      <template v-slot:item.acciones="{ item }">
        <div class="d-flex ga-1">
          <EditButtonComponent :item="item" @edit="editItem" />
          <DeleteInventoryButton :item="item" @deleted="loadItems(currentOptions)" />
        </div>
      </template>

      <template v-slot:tfoot>
        <tr>
          <td>
            <v-text-field v-model="name" class="ma-2" density="compact" placeholder="Buscar por nombre..." hide-details />
          </td>
        </tr>
      </template>
    </v-data-table-server>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import InventarioService from '@/services/InventarioService'
import ConfirmDialog from '@/components/ModalComponent.vue'
import EditButtonComponent from '@/components/button/EditComponent.vue'
import DeleteInventoryButton from '@/components/button/DeleteComponent.vue'

// Columnas de la tabla
const headers = ref([
  { title: 'Código', key: 'codigo' },
  { title: 'Nombre', key: 'nombreProducto' },
  { title: 'Categoría', key: 'categoria' },
  { title: 'Stock', key: 'stock' },
  { title: 'Stock Mínimo', key: 'minStock' },
  { title: 'Unidad', key: 'unidadMedida' },
  { title: 'Acciones', key: 'acciones', sortable: false }
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

// Formulario
const mode = ref<'create' | 'update'>('create')
const form = ref({
  id: null,
  codigo: '',
  nombre_producto: '',
  categoria: '',
  stock: '',
  min_stock: '',
  unidad_medida: '',
})
const confirmDialog = ref(false)

// Métodos
function resetForm() {
  form.value = {
    id: null,
    codigo: '',
    nombre_producto: '',
    categoria: '',
    stock: '',
    min_stock: '',
    unidad_medida: '',
  }
  mode.value = 'create'
}

async function submit() {
  confirmDialog.value = false
  loading.value = true

  try {
    if (mode.value === 'create') {
      await InventarioService.create(form.value)
    } else {
      await InventarioService.update(form.value.id, form.value)
    }
    resetForm()
    loadItems(currentOptions.value)
  } catch (e) {
    console.error('Error al guardar:', e)
  } finally {
    loading.value = false
  }
}

function editItem(item: any) {
  form.value = {
    id: item.id,
    codigo: item.codigo,
    nombre_producto: item.nombreProducto,
    categoria: item.categoria,
    stock: item.stock,
    min_stock: item.minStock,
    unidad_medida: item.unidadMedida,
  }
  mode.value = 'update'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function loadItems(options: any) {
  currentOptions.value = options
  loading.value = true

  InventarioService.getPaginated({
    page: options.page,
    itemsPerPage: options.itemsPerPage,
    sortBy: options.sortBy,
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

// Filtro por nombre reactivo
watch(name, () => {
  search.value = Date.now().toString()
})
</script>
