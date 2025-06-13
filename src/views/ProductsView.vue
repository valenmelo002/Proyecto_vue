<template>
  <div class="pa-4">
    <!-- FORMULARIO -->
    <v-container class="d-flex justify-center" style="max-width: 1440px;">
      <div class="form-wrapper w-100">
        <v-row dense>
          <v-col cols="12" md="6">
            <v-text-field
              label="Nombre del producto"
              v-model="form.nombre"
              variant="outlined"
              density="comfortable"
              hide-details
              class="w-100"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-textarea
              label="Descripción"
              v-model="form.descripcion"
              variant="outlined"
              density="comfortable"
              hide-details
              class="w-100"
              rows="2"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              label="Precio"
              v-model.number="form.precio"
              type="number"
              variant="outlined"
              density="comfortable"
              hide-details
              class="w-100"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              label="Categoría"
              :items="categorias"
              item-value="id"
              item-title="nombre"
              v-model="form.categoria_id"
              variant="outlined"
              density="comfortable"
              hide-details
              class="w-100"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              label="Unidad de medida"
              :items="unidades"
              item-value="id"
              item-title="nombre"
              v-model="form.unidad_medida_id"
              variant="outlined"
              density="comfortable"
              hide-details
              class="w-100"
            />
          </v-col>
        </v-row>

        <v-row justify="center" class="mt-4">
          <v-col cols="auto">
            <v-switch
              label="Disponible"
              v-model="form.disponible"
              inset
            />
          </v-col>
        </v-row>

        <div class="d-flex justify-center ga-2 mt-4 mb-6">
          <v-btn color="primary" @click="handleClickGuardar" :loading="loading">
            {{ mode === 'create' ? 'Guardar' : 'Actualizar' }}
          </v-btn>
            <v-btn color="error" @click="resetForm" class="ml-2">Cancelar</v-btn>
        </div>

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
    </v-container>

    <!-- BUSCADOR -->
    <v-container class="mx-auto" style="max-width: 1440px;">
      <v-text-field
        v-model="name"
        placeholder="Buscar por nombre..."
        clearable
        density="comfortable"
        variant="outlined"
        hide-details
        class="mb-4 mx-auto"
        style="max-width: 500px;"
      />
    </v-container>

    <!-- TABLA (DESKTOP) -->
    <v-container class="d-none d-md-block" style="max-width: 1440px;">
      <v-data-table-server
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
      </v-data-table-server>
    </v-container>

    <!-- TARJETAS (MÓVIL) -->
    <v-container class="d-md-none px-2">
      <v-row dense>
        <v-col cols="12" v-for="item in serverItems" :key="item.id">
          <v-card class="mb-2">
            <v-card-title class="text-h6">{{ item.nombre }}</v-card-title>
            <v-card-subtitle class="text-caption">{{ item.descripcion }}</v-card-subtitle>
            <v-card-text>
              <div><strong>Precio:</strong> ${{ item.precio }}</div>
              <div><strong>Categoría:</strong> {{ item.categoria?.nombre }}</div>
              <div><strong>Unidad:</strong> {{ item.unidadMedida?.nombre }}</div>
              <div><strong>Disponible:</strong> {{ item.disponible ? 'Sí' : 'No' }}</div>
            </v-card-text>
            <v-card-actions>
              <EditButtonComponent :item="item" @edit="editItem" />
              <DeleteButtonComponent
                :item="item"
                resource="producto"
                @confirm-delete="deleteItem"
              />
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- SNACKBAR -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarMessage }}
    </v-snackbar>
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

const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

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

function handleClickGuardar() {
  if (
    !form.value.nombre ||
    !form.value.descripcion ||
    !form.value.precio ||
    !form.value.categoria_id ||
    !form.value.unidad_medida_id
  ) {
    snackbarMessage.value = 'Por favor completa todos los campos obligatorios.'
    snackbarColor.value = 'error'
    snackbar.value = true
    return
  }

  confirmDialog.value = true
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
      snackbarMessage.value = 'Producto creado con éxito.'
    } else {
      await ProductoService.update(form.value.id!, data)
      snackbarMessage.value = 'Producto actualizado con éxito.'
    }

    snackbarColor.value = 'success'
    snackbar.value = true

    resetForm()
    loadItems(currentOptions.value)
  } catch (e) {
    console.error('Error al guardar:', e)
    snackbarMessage.value = 'Ocurrió un error al guardar.'
    snackbarColor.value = 'error'
    snackbar.value = true
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
    snackbarMessage.value = 'Producto eliminado con éxito.'
    snackbarColor.value = 'success'
    snackbar.value = true
    loadItems(currentOptions.value)
  } catch (error) {
    console.error('Error al eliminar el producto:', error)
    snackbarMessage.value = 'Ocurrió un error al eliminar.'
    snackbarColor.value = 'error'
    snackbar.value = true
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

<style scoped>
.form-wrapper > .v-row > .v-col {
  max-width: 300px;
  margin: 0 auto;
}

.form-wrapper .w-100 {
  max-width: 100%;
}
</style>
