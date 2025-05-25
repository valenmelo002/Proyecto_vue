<template>
  <div class="pa-4">
    <!-- FORMULARIO -->
    <div class="mb-6" style="max-width: 600px;">
      <v-text-field label="Nombre" v-model="form.nombre" class="mb-2" />
      <v-text-field label="Teléfono" v-model="form.telefono" class="mb-2" />
      <v-text-field label="Correo electrónico" v-model="form.correo" class="mb-2" />
      <v-textarea label="Dirección" v-model="form.direccion" />

      <v-btn color="primary" @click="confirmDialog = true" :loading="loading" class="mr-2">
        {{ mode === 'create' ? 'Guardar' : 'Actualizar' }}
      </v-btn>
      <v-btn @click="resetForm">Cancelar</v-btn>

      <ConfirmDialog
        v-model="confirmDialog"
        :title="mode === 'create' ? 'Confirmar creación' : 'Confirmar actualización'"
        :message="mode === 'create'
          ? '¿Desea guardar este proveedor?'
          : '¿Desea actualizar la información del proveedor?'"
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
          <DeleteButtonComponent :item="item" resource="proveedor" @confirm-delete="deleteItem" />
        </div>
      </template>

      <template v-slot:tfoot>
        <tr>
          <td colspan="5">
            <v-text-field v-model="name" class="ma-2" density="compact" placeholder="Buscar por nombre..." hide-details />
          </td>
        </tr>
      </template>
    </v-data-table-server>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import ProveedorService from '@/services/ProveedorService'
import ConfirmDialog from '@/components/ModalComponent.vue'
import EditButtonComponent from '@/components/button/EditComponent.vue'
import DeleteButtonComponent from '@/components/button/DeleteComponent.vue'

// Tabla
const headers = ref([
  { title: 'Nombre', key: 'nombre' },
  { title: 'Teléfono', key: 'telefono' },
  { title: 'Correo', key: 'correo' },
  { title: 'Dirección', key: 'direccion' },
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
  telefono: '',
  correo: '',
  direccion: '',
})
const confirmDialog = ref(false)

// Métodos
function resetForm() {
  form.value = {
    id: null,
    nombre: '',
    telefono: '',
    correo: '',
    direccion: '',
  }
  mode.value = 'create'
}

async function submit() {
  confirmDialog.value = false
  loading.value = true

  try {
    const data = { ...form.value }

    if (mode.value === 'create') {
      await ProveedorService.create(data)
    } else {
      await ProveedorService.update(form.value.id!, data)
    }

    resetForm()
    loadItems(currentOptions.value)
  } catch (e) {
    console.error('Error al guardar proveedor:', e)
  } finally {
    loading.value = false
  }
}

function editItem(item: any) {
  form.value = {
    id: item.id,
    nombre: item.nombre,
    telefono: item.telefono,
    correo: item.correo,
    direccion: item.direccion,
  }
  mode.value = 'update'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function deleteItem(item: { id: number }) {
  try {
    await ProveedorService.destroy(item.id)
    loadItems(currentOptions.value)
  } catch (error) {
    console.error('Error al eliminar proveedor:', error)
  }
}

function loadItems(options: any) {
  currentOptions.value = options
  loading.value = true

  ProveedorService.getPaginated({
    page: options.page,
    itemsPerPage: options.itemsPerPage,
    sortBy: options.sortBy,
    search: { nombre: name.value },
  })
    .then(({ items, total }) => {
      serverItems.value = items
      totalItems.value = total
    })
    .catch((error) => {
      console.error('Error al cargar proveedores:', error)
    })
    .finally(() => {
      loading.value = false
    })
}

// Buscar reactivo
watch(name, () => {
  search.value = Date.now().toString()
})

onMounted(() => {
  loadItems(currentOptions.value)
})
</script>
