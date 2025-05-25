<!-- src/views/ProductoView.vue -->
<template>
  <div class="pa-4">
    <!-- FORMULARIO -->
    <div class="mb-6">
      <v-text-field label="Nombre del producto" v-model="form.nombre" class="mb-2" />
      <v-textarea label="Descripción" v-model="form.descripcion" class="mb-2" />
      <v-text-field label="Precio" v-model.number="form.precio" type="number" class="mb-2" />

      <v-select
        label="Categoría"
        :items="categorias"
        item-value="id"
        item-title="nombre"
        v-model="form.categoria_id"
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

      <v-switch label="Disponible" v-model="form.disponible" class="mb-4" />

      <v-btn color="primary" @click="confirmDialog = true" :loading="loading" class="mr-2">
        {{ mode === 'create' ? 'Guardar' : 'Actualizar' }}
      </v-btn>
      <v-btn @click="resetForm">Cancelar</v-btn>

      <ConfirmDialog
        v-model="confirmDialog"
        :title="mode === 'create' ? 'Confirmar creación' : 'Confirmar actualización'"
        :message="mode === 'create'
          ? '¿Desea guardar este producto?'
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
      item-value="id"
      @update:options="loadItems"
    >
      <template v-slot:item.acciones="{ item }">
        <div class="d-flex ga-1">
          <EditButtonComponent :item="item" @edit="editItem" />
          <DeleteButtonComponent
            :item="item"
            resource="producto"
            @confirm-delete="deleteItem"
          />
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
import { ref, watch, onMounted } from 'vue'
import ProductoService from '@/services/ProductoService'
import CategoriaService from '@/services/CategoriaService'
import UnidadMedidaService from '@/services/UnidadMedidaService'
import ConfirmDialog from '@/components/ModalComponent.vue'
import EditButtonComponent from '@/components/button/EditComponent.vue'
import DeleteButtonComponent from '@/components/button/DeleteComponent.vue'

// Tabla
const headers = ref([
  { title: 'Nombre', key: 'nombre' },
  { title: 'Descripción', key: 'descripcion' },
  { title: 'Precio', key: 'precio' },
  { title: 'Categoría', key: 'categoria.nombre' },
  { title: 'Unidad', key: 'unidadMedida.nombre' },
  { title: 'Disponible', key: 'disponible' },
  { title: 'Acciones', key: 'acciones', sortable: false }
])

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
  nombre: '',
  descripcion: '',
  precio: '',
  categoria_id: null,
  unidad_medida_id: null,
  disponible: true,
})
const confirmDialog = ref(false)

// Selects
const categorias = ref([])
const unidades = ref([])

async function loadSelects() {
  try {
    categorias.value = await CategoriaService.getAll()
    unidades.value = await UnidadMedidaService.getAll()
  } catch (e) {
    console.error('Error cargando selects:', e)
  }
}

function resetForm() {
  form.value = {
    id: null,
    nombre: '',
    descripcion: '',
    precio: '',
    categoria_id: null,
    unidad_medida_id: null,
    disponible: true,
  }
  mode.value = 'create'
}

async function submit() {
  confirmDialog.value = false
  loading.value = true
  try {
    const data = {
      nombre: form.value.nombre,
      descripcion: form.value.descripcion,
      precio: form.value.precio,
      categoria_id: form.value.categoria_id,
      unidad_medida_id: form.value.unidad_medida_id,
      disponible: form.value.disponible,
    }

    if (mode.value === 'create') {
      await ProductoService.create(data)
    } else {
      await ProductoService.update(form.value.id!, data)
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
    nombre: item.nombre,
    descripcion: item.descripcion,
    precio: item.precio,
    categoria_id: item.categoria?.id ?? null,
    unidad_medida_id: item.unidadMedida?.id ?? null,
    disponible: item.disponible,
  }
  mode.value = 'update'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function deleteItem(item: { id: number }) {
  try {
    await ProductoService.destroy(item.id)
    loadItems(currentOptions.value)
  } catch (error) {
    console.error('Error al eliminar el producto:', error)
  }
}

function loadItems(options: any) {
  currentOptions.value = options
  loading.value = true

  ProductoService.getPaginated({
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
      console.error('Error al cargar productos:', error)
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
  loadSelects()
})
</script>
