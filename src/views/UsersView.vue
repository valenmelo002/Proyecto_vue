<template>
  <div class="pa-4">
    <div class="mb-6">
      <v-form ref="formRef">
        <v-row dense>
          <v-col cols="4">
            <v-text-field label="Nombre" v-model="form.nombre" :rules="[rules.required, rules.minName, rules.maxName]" />
          </v-col>
          <v-col cols="4">
            <v-text-field label="Apellido" v-model="form.apellido" :rules="[rules.required, rules.minName, rules.maxName]" />
          </v-col>
          <v-col cols="4">
            <v-select
              label="Tipo de Documento"
              :items="tiposDocumento"
              item-value="id"
              item-title="nombre"
              v-model="form.tipo_documento_id"
              variant="outlined"
              :rules="[rules.selectTipoDocumento]"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field label="Número de Documento" v-model="form.numero_documento" :rules="[rules.required, rules.minNumberDocument, rules.maxNumberDocument]" />
          </v-col>
          <v-col cols="4">
            <v-text-field label="Correo" v-model="form.correo" :rules="[rules.required, rules.email]" />
          </v-col>
          <v-col cols="4">
            <v-text-field label="Teléfono" v-model="form.numero_telefono" :rules="[rules.required, rules.minNumberTelefono, rules.maxNumberTelefono]" />
          </v-col>
          <v-col cols="4">
            <v-text-field label="Contraseña" v-model="form.password" type="password" :rules="[rules.required, rules.password]" />
          </v-col>
          <v-col cols="4">
            <v-select
              label="Rol"
              :items="roles"
              item-value="id"
              item-title="nombre"
              v-model="form.rol_id"
              variant="outlined"
              :rules="[rules.selectRole]"
            />
          </v-col>
        </v-row>
        <div>
        <v-btn color="primary" @click="checkFormBeforeConfirm" :loading="loading" class="mr-2">
          {{ mode === 'create' ? 'Guardar' : 'Actualizar' }}
        </v-btn>
        <v-btn @click="resetForm">Cancelar</v-btn>
        </div>
        <ConfirmDialog
          v-model="confirmDialog"
          :title="mode === 'create' ? 'Confirmar creación' : 'Confirmar actualización'"
          :message="mode === 'create' ? '¿Desea guardar este usuario?' : '¿Desea actualizar la información de este usuario?'"
          @confirm="submit"
          @cancel="confirmDialog = false"
        />
      </v-form>
    </div>

    <!-- Tabla -->
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
          <DeleteButtonComponent :item="item" resource="usuario" @confirm-delete="deleteItem" />
        </div>
      </template>
    </v-data-table-server>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import UserService from '@/services/UserService'
import RoleService from '@/services/RoleService'
import TipoDocumentoService from '@/services/TipoDocumentoService'
import ConfirmDialog from '@/components/ModalComponent.vue'
import EditButtonComponent from '@/components/button/EditComponent.vue'
import DeleteButtonComponent from '@/components/button/DeleteComponent.vue'

// Tabla
const headers = ref([
  { title: 'ID', key: 'id' },
  { title: 'Nombre', key: 'nombre' },
  { title: 'Apellido', key: 'apellido' },
  { title: 'Correo', key: 'correo' },
  { title: 'Rol', key: 'rol.nombre' },
  { title: 'Acciones', key: 'acciones', sortable: false },
])

const itemsPerPage = ref(5)
const serverItems = ref([])
const totalItems = ref(0)
const search = ref('')
const currentOptions = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [],
})
const loading = ref(false)
const formRef = ref()

const rules = {
  required: (v: any) => !!v || 'Este campo es obligatorio',
  minName: (v: string) => v.length >= 2 || 'Mínimo 2 caracteres',
  maxName: (v: string) => v.length <= 20 || 'Máximo 20 caracteres',
  minNumberDocument: (v: string) => v.length >= 6 || 'Mínimo 6 caracteres',
  maxNumberDocument: (v: string) => v.length <= 10 || 'Máximo 10 caracteres',
  minNumberTelefono: (v: string) => v.length >= 7 || 'Mínimo 7 caracteres',
  maxNumberTelefono: (v: string) => v.length <= 10 || 'Máximo 10 caracteres',
  email: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Correo inválido',
  password: (v: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(v) || 'Debe tener mayúscula, minúscula, número y símbolo',
  selectTipoDocumento: (v: any) => v !== null || 'Debe seleccionar un tipo de documento',
  selectRole: (v: any) => v !== null || 'Debe seleccionar un rol',
}

const mode = ref<'create' | 'update'>('create')
const confirmDialog = ref(false)
const form = ref({
  id: null,
  nombre: '',
  apellido: '',
  tipo_documento_id: null,
  numero_documento: '',
  correo: '',
  password: '',
  numero_telefono: '',
  rol_id: null,
})

const roles = ref([])
const tiposDocumento = ref([])

async function loadSelects() {
  roles.value = await RoleService.getAll()
  tiposDocumento.value = await TipoDocumentoService.getAll()
}

function resetForm() {
  form.value = {
    id: null,
    nombre: '',
    apellido: '',
    tipo_documento_id: null,
    numero_documento: '',
    correo: '',
    password: '',
    numero_telefono: '',
    rol_id: null,
  }
  mode.value = 'create'
}

function checkFormBeforeConfirm() {
  formRef.value?.validate().then((valid: boolean) => {
    if (valid) confirmDialog.value = true
  })
}

async function submit() {
  confirmDialog.value = false
  loading.value = true
  try {
    if (mode.value === 'create') {
      await UserService.create(form.value)
    } else {
      await UserService.update(form.value.id!, form.value)
    }
    resetForm()
    loadItems(currentOptions.value)
  } catch (e) {
    console.error('Error al guardar usuario:', e)
  } finally {
    loading.value = false
  }
}

function editItem(item: any) {
  form.value = {
    id: item.id,
    nombre: item.nombre ?? '',
    apellido: item.apellido ?? '',
    tipo_documento_id: item.tipo_documento_id ?? null,
    numero_documento: item.numero_documento ?? '',
    correo: item.correo ?? '',
    numero_telefono: item.numero_telefono ?? '',
    rol_id: item.rol?.id ?? null,
    password: '',
  }
  mode.value = 'update'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function deleteItem(item: { id: number }) {
  try {
    await UserService.delete(item.id)
    loadItems(currentOptions.value)
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
  }
}

async function loadItems(options: any) {
  loading.value = true
  currentOptions.value = options
  try {
    const { data, total } = await UserService.getAll({
      page: options.page,
      limit: options.itemsPerPage,
    })

    serverItems.value = data.map((item: any) => ({
      id: item.id,
      nombre: item.user?.nombre ?? '',
      apellido: item.user?.apellido ?? '',
      tipo_documento_id: item.user?.tipo_documento_id ?? null,
      numero_documento: item.user?.numero_documento ?? '',
      correo: item.user?.correo ?? '',
      numero_telefono: item.user?.numero_telefono ?? '',
      rol: {
        id: item.roles?.id ?? null,
        nombre: item.roles?.nombre ?? ''
      }
    }))

    totalItems.value = total
  } catch (e) {
    console.error('Error al cargar usuarios:', e)
  } finally {
    loading.value = false
  }
}

watch(search, () => loadItems(currentOptions.value))
onMounted(() => {
  loadItems(currentOptions.value)
  loadSelects()
})
</script>
