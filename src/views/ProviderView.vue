<template>
  <div class="pa-4">
    <!-- FORMULARIO RESPONSIVO -->
    <v-container class="d-flex justify-center px-2" style="max-width: 1440px;">
      <div class="form-wrapper w-100" style="max-width: 960px;">
        <v-row dense>
          <v-col cols="12" md="6">
            <v-text-field
              label="Nombre"
              v-model="form.nombre"
              variant="outlined"
              density="comfortable"
              hide-details
              class="w-100"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              label="Teléfono"
              v-model="form.telefono"
              variant="outlined"
              density="comfortable"
              hide-details
              class="w-100"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="Correo electrónico"
              v-model="form.correo"
              variant="outlined"
              density="comfortable"
              hide-details
              class="w-100"
            />
          </v-col>
          <v-col cols="12">
            <v-textarea
              label="Dirección"
              v-model="form.direccion"
              variant="outlined"
              density="comfortable"
              hide-details
              class="w-100"
              rows="2"
            />
          </v-col>
        </v-row>

        <div class="d-flex justify-center ga-2 mt-4 mb-6 flex-wrap">
          <v-btn color="primary" @click="validarFormulario" :loading="loading">
            {{ mode === 'create' ? 'Guardar' : 'Actualizar' }}
          </v-btn>
          <v-btn color="error" @click="resetForm" class="ml-3">Cancelar</v-btn>
        </div>

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
    </v-container>

    <!-- TABLA EN CARD RESPONSIVA -->
    <v-container class="mx-auto px-2" style="max-width: 1440px;">
      <v-text-field
        v-model="name"
        label="Buscar por nombre"
        clearable
        density="comfortable"
        variant="outlined"
        hide-details
        class="mb-4"
        style="max-width: 500px;"
      />

      <!-- Versión de tabla para pantallas grandes -->
      <div class="d-none d-md-block">
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
              <DeleteButtonComponent :item="item" resource="proveedor" @confirm-delete="deleteItem" />
            </div>
          </template>
        </v-data-table-server>
      </div>

      <!-- Versión de tarjetas para pantallas pequeñas -->
      <div class="d-md-none d-flex flex-column ga-3">
        <v-card
          v-for="item in serverItems"
          :key="item.id"
          class="pa-4"
          elevation="2"
          rounded="xl"
        >
          <div><strong>Nombre:</strong> {{ item.nombre }}</div>
          <div><strong>Teléfono:</strong> {{ item.telefono }}</div>
          <div><strong>Correo:</strong> {{ item.correo }}</div>
          <div><strong>Dirección:</strong> {{ item.direccion }}</div>
          <div class="d-flex mt-2 ga-1">
            <EditButtonComponent :item="item" @edit="editItem" />
            <DeleteButtonComponent :item="item" resource="proveedor" @confirm-delete="deleteItem" />
          </div>
        </v-card>
      </div>
    </v-container>

    <v-snackbar v-model="snackbar.show" :timeout="3000" :color="snackbar.color" top right>
      {{ snackbar.message }}
      <template #actions>
        <v-btn text @click="snackbar.show = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>


<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import ProveedorService from '@/services/ProveedorService'
import ConfirmDialog from '@/components/ModalComponent.vue'
import EditButtonComponent from '@/components/button/EditComponent.vue'
import DeleteButtonComponent from '@/components/button/DeleteComponent.vue'


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


const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
})

const showMessage = (msg: string) => {
  snackbar.value.message = msg
  snackbar.value.color = 'success'
  snackbar.value.show = true
}

const showError = (msg: string) => {
  snackbar.value.message = msg
  snackbar.value.color = 'error'
  snackbar.value.show = true
}

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


function validarFormulario() {
  const campos = [form.value.nombre, form.value.telefono, form.value.correo, form.value.direccion]
  const hayVacios = campos.some(campo => campo === '' || campo === null)

  if (hayVacios) {
    showError('Por favor completa todos los campos obligatorios')
    return
  }

  confirmDialog.value = true
}

async function submit() {
  confirmDialog.value = false
  loading.value = true

  try {
    const data = { ...form.value }

    if (mode.value === 'create') {
      await ProveedorService.create(data)
      showMessage('Proveedor guardado exitosamente')
    } else {
      await ProveedorService.update(form.value.id!, data)
      showMessage('Proveedor actualizado exitosamente')
    }

    resetForm()
    loadItems(currentOptions.value)
  } catch (e) {
    console.error('Error al guardar proveedor:', e)
    showError('Error al guardar proveedor')
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
    showMessage('Proveedor eliminado')
    loadItems(currentOptions.value)
  } catch (error) {
    console.error('Error al eliminar proveedor:', error)
    showError('Error al eliminar proveedor')
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
      showError('Error al cargar proveedores')
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
