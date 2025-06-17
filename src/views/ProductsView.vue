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
              :rules="[rules.required, rules.nombre]"
              variant="outlined"
              density="comfortable"
              class="w-100"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-textarea
              label="Descripción"
              v-model="form.descripcion"
              :rules="[rules.descripcion]"
              variant="outlined"
              density="comfortable"
              class="w-100"
              rows="2"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              label="Precio"
              v-model.number="form.precio"
              :rules="[rules.required, rules.precio]"
              type="number"
              variant="outlined"
              density="comfortable"
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
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
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
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
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

    <!-- TABLA -->
    <v-container class="table-view px-2" style="max-width: 1440px;">
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

    <!-- TARJETAS -->
    <v-container class="cards-view px-2">
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

const rules = {
  required: (v: any) => !!v || 'Este campo es obligatorio',
  nombre: (v: string) => v.length >= 3 || 'Debe tener mínimo 3 caracteres',
  descripcion: (v: string) => !v || v.length <= 40 || 'Máximo 40 caracteres',
  precio: (v: number) => v > 0 && Number.isInteger(v) || 'Debe ser un número entero positivo',
}

const form = ref({
  id: null,
  nombre: '',
  descripcion: '',
  precio: '',
  categoria_id: null,
  unidad_medida_id: null,
  disponible: true
})

const mode = ref<'create' | 'update'>('create')
const loading = ref(false)
const confirmDialog = ref(false)
const name = ref('')
const search = ref('')
const itemsPerPage = ref(5)
const headers = ref([
  { title: 'Nombre', key: 'nombre' },
  { title: 'Descripción', key: 'descripcion' },
  { title: 'Precio', key: 'precio' },
  { title: 'Categoría', key: 'categoria.nombre' },
  { title: 'Unidad', key: 'unidadMedida.nombre' },
  { title: 'Disponible', key: 'disponible' },
  { title: 'Acciones', key: 'acciones', sortable: false }
])
const serverItems = ref([])
const totalItems = ref(0)
const categorias = ref([])
const unidades = ref([])

function handleClickGuardar() {
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
      disponible: form.value.disponible
    }

    if (mode.value === 'create') {
      await ProductoService.create(data)
    } else {
      await ProductoService.update(form.value.id!, data)
    }

    resetForm()
    loadItems(currentOptions.value)
  } catch (error) {
    console.error('Error al guardar:', error)
  } finally {
    loading.value = false
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
    disponible: true
  }
  mode.value = 'create'
}

function editItem(item: any) {
  form.value = {
    id: item.id,
    nombre: item.nombre,
    descripcion: item.descripcion,
    precio: item.precio,
    categoria_id: item.categoria?.id ?? null,
    unidad_medida_id: item.unidadMedida?.id ?? null,
    disponible: item.disponible
  }
  mode.value = 'update'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function deleteItem(item: any) {
  try {
    await ProductoService.destroy(item.id)
    loadItems(currentOptions.value)
  } catch (error) {
    console.error('Error al eliminar producto:', error)
  }
}

const currentOptions = ref({ page: 1, itemsPerPage: 5, sortBy: [] })

async function loadItems(options: any) {
  currentOptions.value = options
  loading.value = true
  try {
    const { items, total } = await ProductoService.getPaginated({
      page: options.page,
      itemsPerPage: options.itemsPerPage,
      sortBy: options.sortBy,
      search: { name: name.value }
    })
    serverItems.value = items
    totalItems.value = total
  } catch (error) {
    console.error('Error al cargar productos:', error)
  } finally {
    loading.value = false
  }
}

async function loadSelects() {
  try {
    categorias.value = await CategoriaService.getAll()
    unidades.value = await UnidadMedidaService.getAll()
  } catch (error) {
    console.error('Error al cargar selects:', error)
  }
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
.table-view {
  display: none;
}

.cards-view {
  display: block;
}

@media (min-width: 812px) {
  .table-view {
    display: block !important;
  }
  .cards-view {
    display: none !important;
  }
}
</style>
