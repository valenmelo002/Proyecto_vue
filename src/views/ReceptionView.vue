<template>
  <div class="pa-4">
    <div class="mb-6">
      <v-select
        label="Producto"
        :items="productos"
        item-value="id"
        item-title="nombre"
        v-model="form.producto_id"
        class="mb-2"
        variant="outlined"
      />

      <v-select
        label="Unidad de medida"
        :items="unidades"
        item-value="id"
        item-title="nombre"
        v-model="form.unidad_medida_id"
        class="mb-2"
        variant="outlined"
      />

      <v-text-field label="Cantidad" v-model.number="form.cantidad" type="number" class="mb-2" />
      <v-textarea label="Observación" v-model="form.observacion" class="mb-4" />

      <v-btn color="primary" @click="confirmDialog = true" :loading="loading" class="mr-2">
        {{ mode === 'create' ? 'Guardar' : 'Actualizar' }}
      </v-btn>
      <v-btn @click="resetForm">Cancelar</v-btn>

      <ConfirmDialog
        v-model="confirmDialog"
        :title="mode === 'create' ? 'Confirmar creación' : 'Confirmar actualización'"
        :message="mode === 'create'
          ? '¿Desea registrar esta recepción?'
          : '¿Desea actualizar esta recepción?'"
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
      item-value="id"
      @update:options="loadItems"
    >
      <template v-slot:item.createdAt="{ item }">
        {{ formatDate(item.createdAt) }}
      </template>

      <template v-slot:item.acciones="{ item }">
        <div class="d-flex ga-1">
          <EditButtonComponent :item="item" @edit="editItem" />
          <DeleteButtonComponent :item="item" resource="recepcion" @confirm-delete="deleteItem" />
        </div>
      </template>

      <template v-slot:tfoot>
        <tr>
          <td>
            <v-text-field v-model="folioSearch" class="ma-2" density="compact" placeholder="Buscar por folio..." hide-details />
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
import RecepcionService from '@/services/RecepcionService'
import ProductoService from '@/services/ProductoService'
import UnidadMedidaService from '@/services/UnidadMedidaService'
import ConfirmDialog from '@/components/ModalComponent.vue'
import EditButtonComponent from '@/components/button/EditComponent.vue'
import DeleteButtonComponent from '@/components/button/DeleteComponent.vue'

const headers = ref([
  { title: 'Producto', key: 'producto.nombre' },
  { title: 'Unidad', key: 'unidadMedida.nombre' },
  { title: 'Cantidad', key: 'cantidad' },
  { title: 'Observación', key: 'observacion' },
  { title: 'Fecha', key: 'createdAt' },
  { title: 'Acciones', key: 'acciones', sortable: false }
])

const itemsPerPage = ref(5)
const serverItems = ref([])
const totalItems = ref(0)
const loading = ref(false)
const search = ref('')
const folioSearch = ref('')
const currentOptions = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [],
})

const mode = ref<'create' | 'update'>('create')
const form = ref({
  id: null,
  producto_id: null,
  unidad_medida_id: null,
  cantidad: null,
  observacion: '',
})
const confirmDialog = ref(false)

const productos = ref([])
const unidades = ref([])

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
})

async function loadSelects() {
  try {
    const productosResponse = await ProductoService.list()
    productos.value = productosResponse.data ?? productosResponse

    const unidadesResponse = await UnidadMedidaService.getAll()
    unidades.value = unidadesResponse.data ?? unidadesResponse
  } catch (e) {
    snackbar.value = {
      show: true,
      message: 'Error cargando productos o unidades',
      color: 'error',
    }
  }
}

function resetForm() {
  form.value = {
    id: null,
    producto_id: null,
    unidad_medida_id: null,
    cantidad: null,
    observacion: '',
  }
  mode.value = 'create'
}

async function submit() {
  if (
    !form.value.producto_id ||
    !form.value.unidad_medida_id ||
    form.value.cantidad === null ||
    form.value.cantidad <= 0
  ) {
    snackbar.value = {
      show: true,
      message: 'Por favor completa todos los campos obligatorios con datos válidos.',
      color: 'error',
    }
    confirmDialog.value = false
    return
  }

  confirmDialog.value = false
  loading.value = true
  try {
    const data = {
      producto_id: form.value.producto_id,
      unidad_medida_id: form.value.unidad_medida_id,
      cantidad: form.value.cantidad,
      observacion: form.value.observacion,
    }

    if (mode.value === 'create') {
      await RecepcionService.create(data)
      snackbar.value = {
        show: true,
        message: 'Recepción creada con éxito',
        color: 'success',
      }
    } else {
      await RecepcionService.update(form.value.id!, data)
      snackbar.value = {
        show: true,
        message: 'Recepción actualizada con éxito',
        color: 'success',
      }
    }

    resetForm()
    await loadItems(currentOptions.value)
  } catch (e) {
    snackbar.value = {
      show: true,
      message: 'Error al guardar la recepción',
      color: 'error',
    }
  } finally {
    loading.value = false
  }
}

function editItem(item: any) {
  form.value = {
    id: item.id,
    producto_id: item.producto?.id ?? null,
    unidad_medida_id: item.unidadMedida?.id ?? null,
    cantidad: item.cantidad,
    observacion: item.observacion,
  }
  mode.value = 'update'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function deleteItem(item: { id: number }) {
  try {
    await RecepcionService.destroy(item.id)
    snackbar.value = {
      show: true,
      message: 'Recepción eliminada',
      color: 'success',
    }
    await loadItems(currentOptions.value)
  } catch (error) {
    snackbar.value = {
      show: true,
      message: 'Error al eliminar la recepción',
      color: 'error',
    }
  }
}

function loadItems(options: any) {
  currentOptions.value = options
  loading.value = true

  RecepcionService.getPaginated({
    page: options.page,
    itemsPerPage: options.itemsPerPage,
    sortBy: options.sortBy,
    search: { folio: folioSearch.value },
  })
    .then(({ items, total }) => {
      serverItems.value = items
      totalItems.value = total
    })
    .catch((error) => {
      snackbar.value = {
        show: true,
        message: 'Error al cargar recepciones',
        color: 'error',
      }
    })
    .finally(() => {
      loading.value = false
    })
}

watch(folioSearch, () => {
  search.value = Date.now().toString()
})

onMounted(() => {
  loadItems(currentOptions.value)
  loadSelects()
})

function formatDate(dateString: string) {
  if (!dateString) return ''
  return dateString.split('T')[0]
}
</script>

<style scoped></style>
