<template>
  <div class="pa-4">
    <v-container class="d-flex justify-center" style="max-width: 1440px;">
      <div class="form-wrapper w-100">
        <v-form ref="formRef">
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field label="Código" v-model="form.codigo" :rules="[rules.required, rules.enteroPositivo]" variant="outlined" density="comfortable" class="w-100" />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field label="Nombre del Producto" v-model="form.nombre_producto" :rules="[rules.required, rules.nombreProducto]" variant="outlined" density="comfortable" class="w-100" />
            </v-col>

            <v-col cols="12" md="6">
              <v-select label="Categoría" v-model="form.categoria" :items="categorias" item-title="nombre" item-value="id" :rules="[rules.required]" variant="outlined" density="comfortable" class="w-100" />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field label="Stock" v-model="form.stock" type="number" :rules="[rules.required, rules.enteroPositivo]" variant="outlined" density="comfortable" class="w-100" />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field label="Stock Mínimo" v-model="form.min_stock" type="number" :rules="[rules.required, rules.enteroPositivo]" variant="outlined" density="comfortable" class="w-100" />
            </v-col>

            <v-col cols="12" md="6">
              <v-select label="Unidad de Medida" v-model="form.unidad_medida" :items="unidadesMedida" item-title="nombre" item-value="id" :rules="[rules.required]" variant="outlined" density="comfortable" class="w-100" />
            </v-col>
          </v-row>
        </v-form>

        <div class="d-flex justify-center ga-2 mt-4 mb-6">
          <v-btn color="primary" @click="checkFormBeforeSubmit" :loading="loading">
            {{ form.id ? 'Actualizar' : 'Guardar' }}
          </v-btn>
          <v-btn color="error" @click="resetForm" :disabled="loading">Cancelar</v-btn>
        </div>

        <ConfirmDialog
          v-model="confirmDialog"
          :title="form.id ? 'Confirmar actualización' : 'Confirmar creación'"
          :message="form.id ? '¿Desea actualizar este inventario?' : '¿Desea guardar este inventario?'"
          @confirm="submit"
          @cancel="confirmDialog = false"
        />
      </div>
    </v-container>

    <v-container class="mx-auto" style="max-width: 1440px;">
      <v-text-field v-model="search" label="Buscar por nombre" clearable density="comfortable" variant="outlined" hide-details class="mb-4" style="max-width: 500px;" />

      <v-data-table-server
        class="tabla-inventario elevation-1"
        v-model:page="pagination.page"
        v-model:items-per-page="pagination.itemsPerPage"
        :headers="headers"
        :items-length="filteredItems.length"
        :items="filteredItems"
        :loading="loading"
        item-value="id"
      >
        <template v-slot:item.categoria="{ item }">
          {{ item.categoria?.nombre }}
        </template>
        <template v-slot:item.unidadMedida="{ item }">
          {{ item.unidadMedida?.nombre }}
        </template>
        <template v-slot:item.acciones="{ item }">
          <div class="d-flex ga-1">
            <EditButtonComponent :item="item" @edit="editar" />
            <DeleteButtonComponent :item="item" resource="inventario" @confirm-delete="eliminar" />
          </div>
        </template>
      </v-data-table-server>

      <v-row class="cards-inventario" dense>
        <v-col cols="12" v-for="item in filteredItems" :key="item.id">
          <v-card class="mb-3" elevation="2">
            <v-card-text>
              <div><strong>Código:</strong> {{ item.codigo }}</div>
              <div><strong>Nombre:</strong> {{ item.nombre_producto ?? item.nombreProducto }}</div>
              <div><strong>Categoría:</strong> {{ item.categoria?.nombre }}</div>
              <div><strong>Stock:</strong> {{ item.stock }}</div>
              <div><strong>Stock Mínimo:</strong> {{ item.min_stock }}</div>
              <div><strong>Unidad de Medida:</strong> {{ item.unidadMedida?.nombre }}</div>
            </v-card-text>
            <v-card-actions class="d-flex justify-end">
              <EditButtonComponent :item="item" @edit="editar" />
              <DeleteButtonComponent :item="item" resource="inventario" @confirm-delete="eliminar" />
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import InventarioService from '@/services/InventarioService'
import CategoriaService from '@/services/CategoriaService'
import UnidadMedidaService from '@/services/UnidadMedidaService'
import EditButtonComponent from '@/components/button/EditComponent.vue'
import DeleteButtonComponent from '@/components/button/DeleteComponent.vue'
import ConfirmDialog from '@/components/ModalComponent.vue'

const formRef = ref()
const form = ref({
  id: null,
  codigo: '',
  nombre_producto: '',
  categoria: null,
  stock: '',
  min_stock: '',
  unidad_medida: null,
})

const rules = {
  required: (v: any) => !!v || 'Este campo es obligatorio',
  enteroPositivo: (v: any) => /^\d+$/.test(v) || 'Debe ser un número entero positivo',
  nombreProducto: (v: string) =>
    (!!v && v.length >= 3 && v.length <= 50) || 'Entre 3 y 50 caracteres',
}

const categorias = ref([])
const unidadesMedida = ref([])

interface InventarioItem {
  id: number
  codigo: string
  nombre_producto: string
  categoria?: { id: number; nombre: string }
  stock: number
  min_stock: number
  unidadMedida?: { id: number; nombre: string }
}

const items = ref<InventarioItem[]>([])
const totalItems = ref(0)
const loading = ref(false)

const pagination = ref({
  page: 1,
  itemsPerPage: 5,
})

const headers = [
  { title: 'Código', key: 'codigo' },
  { title: 'Nombre Producto', key: 'nombreProducto' },
  { title: 'Categoría', key: 'categoria' },
  { title: 'Stock', key: 'stock' },
  { title: 'Stock Mínimo', key: 'minStock' },
  { title: 'Unidad de Medida', key: 'unidadMedida' },
  { title: 'Acciones', key: 'acciones', sortable: false },
]

const search = ref('')
const confirmDialog = ref(false)
const mode = ref<'create' | 'update'>('create')

const filteredItems = computed(() => {
  if (!search.value) return items.value
  return items.value.filter(item => {
    const nombre = item.nombre_producto ?? item.nombreProducto ?? ''
    return nombre.toLowerCase().includes(search.value.toLowerCase())
  })
})

const checkFormBeforeSubmit = () => {
  formRef.value?.validate().then((isValid: boolean) => {
    if (isValid) confirmDialog.value = true
  })
}

const loadInventarios = async () => {
  loading.value = true
  try {
    const paginationParams = {
      page: 1,
      itemsPerPage: 10,
      sortBy: [],
      search: {},
    }

    const res = await InventarioService.getPaginated(paginationParams)
    items.value = res.items
    totalItems.value = res.total
  } catch (err) {
    console.error('Error cargando inventarios:', err)
  } finally {
    loading.value = false
  }
}

const submit = async () => {
  confirmDialog.value = false
  loading.value = true
  try {
    const data = {
      codigo: form.value.codigo,
      nombre_producto: form.value.nombre_producto,
      categoria_id: form.value.categoria,
      stock: form.value.stock,
      min_stock: form.value.min_stock,
      unidad_medida_id: form.value.unidad_medida,
    }

    if (form.value.id) {
      await InventarioService.update(form.value.id, data)
    } else {
      await InventarioService.create(data)
    }

    resetForm()
    loadInventarios()
  } catch (err) {
    console.error('Error al guardar:', err)
  } finally {
    loading.value = false
  }
}

const editar = (item: any) => {
  form.value = {
    id: item.id,
    codigo: item.codigo,
    nombre_producto: item.nombreProducto,
    categoria: item.categoria?.id,
    stock: item.stock,
    min_stock: item.minStock,
    unidad_medida: item.unidadMedida?.id,
  }
  mode.value = 'update'
}

const eliminar = async (item: { id: number }) => {
  try {
    await InventarioService.destroy(item.id)
    loadInventarios()
  } catch (err) {
    console.error('Error al eliminar:', err)
  }
}

const resetForm = () => {
  form.value = {
    id: null,
    codigo: '',
    nombre_producto: '',
    categoria: null,
    stock: '',
    min_stock: '',
    unidad_medida: null,
  }
  mode.value = 'create'
}

onMounted(async () => {
  loadInventarios()
  categorias.value = await CategoriaService.getAll()
  unidadesMedida.value = await UnidadMedidaService.getAll()
})
</script>

<style scoped>
.tabla-inventario {
  display: none;
}
.cards-inventario {
  display: block;
}

@media (min-width: 768px) {
  .tabla-inventario {
    display: block;
  }
  .cards-inventario {
    display: none;
  }
}
</style>
