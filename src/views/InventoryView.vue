<template>
  <div class="pa-4">
    <div class="mb-6">
      <v-text-field
        label="Código"
        v-model.number="form.codigo"
        type="number"
        class="mb-2"
        variant="outlined"
      />

      <v-text-field
        label="Nombre Producto"
        v-model="form.nombreProducto"
        class="mb-2"
        variant="outlined"
      />

      <v-text-field
        label="Categoría"
        v-model="form.categoria"
        class="mb-2"
        variant="outlined"
      />

      <v-text-field
        label="Stock"
        v-model.number="form.stock"
        type="number"
        class="mb-2"
        variant="outlined"
      />

      <v-text-field
        label="Stock Mínimo"
        v-model.number="form.minStock"
        type="number"
        class="mb-2"
        variant="outlined"
      />

      <v-select
        label="Unidad de medida"
        :items="unidades"
        item-value="id"
        item-title="nombre"
        v-model="form.unidadMedida"
        class="mb-4"
        variant="outlined"
      />

      <v-btn color="primary" @click="handleBeforeSubmit" :loading="loading" class="mr-2">
        {{ mode === 'create' ? 'Guardar' : 'Actualizar' }}
      </v-btn>
      <v-btn @click="resetForm">Cancelar</v-btn>

      <ConfirmDialog
        v-model="confirmDialog"
        :title="mode === 'create' ? 'Confirmar creación' : 'Confirmar actualización'"
        :message="mode === 'create'
          ? '¿Desea registrar este inventario?'
          : '¿Desea actualizar este inventario?'"
        @confirm="submit"
        @cancel="confirmDialog = false"
      />
    </div>

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
      <template v-slot:item.unidadMedida="{ item }">
        {{ getUnidadNombre(item.unidadMedida) }}
      </template>

      <template v-slot:item.acciones="{ item }">
        <div class="d-flex ga-1">
          <EditButtonComponent :item="item" @edit="editItem" />
          <DeleteButtonComponent :item="item" resource="inventarios" @confirm-delete="deleteItem" />
        </div>
      </template>

      <template v-slot:tfoot>
        <tr>
          <td colspan="7">
            <v-text-field
              v-model="nombreSearch"
              class="ma-2"
              density="compact"
              placeholder="Buscar por nombre producto..."
              hide-details
            />
          </td>
        </tr>
      </template>
    </v-data-table-server>

    <v-snackbar
      v-model="snackbar.show"
      :timeout="3000"
      :color="snackbar.color"
      elevation="2"
      top
      right
    >
      {{ snackbar.message }}
      <template #actions>
        <v-btn text @click="snackbar.show = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import InventarioService from '@/services/InventarioService'
import UnidadMedidaService from '@/services/UnidadMedidaService'
import ConfirmDialog from '@/components/ModalComponent.vue'
import EditButtonComponent from '@/components/button/EditComponent.vue'
import DeleteButtonComponent from '@/components/button/DeleteComponent.vue'

const headers = ref([
  { title: 'Código', key: 'codigo' },
  { title: 'Nombre Producto', key: 'nombreProducto' },
  { title: 'Categoría', key: 'categoria' },
  { title: 'Stock', key: 'stock' },
  { title: 'Stock Mínimo', key: 'minStock' },
  { title: 'Unidad de medida', key: 'unidadMedida' },
  { title: 'Acciones', key: 'acciones', sortable: false },
])

const itemsPerPage = ref(5)
const serverItems = ref<any[]>([])
const totalItems = ref(0)
const loading = ref(false)
const search = ref('')
const nombreSearch = ref('')
const currentOptions = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [],
})

const mode = ref<'create' | 'update'>('create')
const form = ref({
  id: null as number | null,
  codigo: null as number | null,
  nombreProducto: '',
  categoria: '',
  stock: null as number | null,
  minStock: null as number | null,
  unidadMedida: null as number | null,
})

const confirmDialog = ref(false)
const unidades = ref<any[]>([])

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
})

// --- Conversiones camelCase <-> snake_case ---
function camelToSnake(obj: Record<string, any>): Record<string, any> {
  const newObj: Record<string, any> = {}
  for (const key in obj) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
    newObj[snakeKey] = obj[key]
  }
  return newObj
}

function snakeToCamel(obj: Record<string, any>): Record<string, any> {
  const newObj: Record<string, any> = {}
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    newObj[camelKey] = obj[key]
  }
  return newObj
}

async function loadSelects() {
  try {
    const unidadesResponse = await UnidadMedidaService.getAll()
    unidades.value = unidadesResponse.data ?? unidadesResponse
  } catch (e) {
    snackbar.value = {
      show: true,
      message: 'Error cargando unidades de medida',
      color: 'error',
    }
  }
}

function resetForm() {
  form.value = {
    id: null,
    codigo: null,
    nombreProducto: '',
    categoria: '',
    stock: null,
    minStock: null,
    unidadMedida: null,
  }
  mode.value = 'create'
}

function handleBeforeSubmit() {
  if (
    !form.value.codigo ||
    !form.value.nombreProducto ||
    !form.value.categoria ||
    form.value.stock === null ||
    form.value.stock < 0 ||
    form.value.minStock === null ||
    form.value.minStock < 0 ||
    !form.value.unidadMedida
  ) {
    snackbar.value = {
      show: true,
      message: 'Por favor complete todos los campos obligatorios correctamente.',
      color: 'error',
    }
    return
  }
  confirmDialog.value = true
}

async function submit() {
  confirmDialog.value = false
  loading.value = true

  // Convertimos camelCase a snake_case para enviar al backend
  const data = camelToSnake({
    codigo: form.value.codigo,
    nombreProducto: form.value.nombreProducto,
    categoria: form.value.categoria,
    stock: form.value.stock,
    minStock: form.value.minStock,
    unidadMedida: form.value.unidadMedida,
  })

  try {
    if (mode.value === 'create') {
      await InventarioService.create(data)
      snackbar.value = {
        show: true,
        message: 'Inventario creado con éxito',
        color: 'success',
      }
    } else {
      await InventarioService.update(form.value.id!, data)
      snackbar.value = {
        show: true,
        message: 'Inventario actualizado con éxito',
        color: 'success',
      }
    }

    resetForm()
    await loadItems(currentOptions.value)
  } catch (e: any) {
    snackbar.value = {
      show: true,
      message: e.message || 'Error al guardar el inventario',
      color: 'error',
    }
  } finally {
    loading.value = false
  }
}

function editItem(item: any) {
  // Convertimos snake_case a camelCase para mostrar en el formulario
  const camelItem = snakeToCamel(item)
  form.value = {
    id: camelItem.id,
    codigo: camelItem.codigo,
    nombreProducto: camelItem.nombreProducto,
    categoria: camelItem.categoria,
    stock: camelItem.stock,
    minStock: camelItem.minStock,
    unidadMedida: camelItem.unidadMedida,
  }
  mode.value = 'update'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function deleteItem(item: { id: number }) {
  try {
    await InventarioService.destroy(item.id)
    snackbar.value = {
      show: true,
      message: 'Inventario eliminado',
      color: 'success',
    }
    await loadItems(currentOptions.value)
  } catch (error) {
    snackbar.value = {
      show: true,
      message: 'Error al eliminar el inventario',
      color: 'error',
    }
  }
}

async function loadItems(options: any) {
  currentOptions.value = options
  loading.value = true

  try {
    const { items, total } = await InventarioService.getPaginated({
      page: options.page,
      itemsPerPage: options.itemsPerPage,
      sortBy: options.sortBy,
      search: { nombre: nombreSearch.value },
    })
    // Convertir cada item de snake_case a camelCase para frontend
    serverItems.value = items.map((item: any) => snakeToCamel(item))
    totalItems.value = total
  } catch (e) {
    snackbar.value = {
      show: true,
      message: 'Error al cargar inventarios',
      color: 'error',
    }
  } finally {
    loading.value = false
  }
}

function getUnidadNombre(id: number | null) {
  const unidad = unidades.value.find((u) => u.id === id)
  return unidad ? unidad.nombre : ''
}

onMounted(async () => {
  await loadSelects()
  await loadItems(currentOptions.value)
})

// Recargar tabla cuando cambie el filtro de búsqueda
watch(nombreSearch, (val) => {
  loadItems(currentOptions.value)
})

</script>
