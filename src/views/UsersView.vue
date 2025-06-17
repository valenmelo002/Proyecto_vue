<template>
  <v-container class="pa-4" style="max-width: 1400px;" fluid>
    <!-- FORMULARIO -->
    <div class="mb-6">
      <v-form ref="formRef">
        <v-row dense>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              label="Nombre"
              v-model="form.nombre"
              :rules="[rules.required, rules.minName, rules.maxName]"
            />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              label="Apellido"
              v-model="form.apellido"
              :rules="[rules.required, rules.minName, rules.maxName]"
            />
          </v-col>
          <v-col cols="12" sm="6" md="4">
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
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              label="Número de Documento"
              v-model="form.numero_documento"
              :rules="[rules.required, rules.minNumberDocument, rules.maxNumberDocument]"
            />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              label="Correo"
              v-model="form.correo"
              :rules="[rules.required, rules.email]"
            />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              label="Teléfono"
              v-model="form.numero_telefono"
              :rules="[rules.required, rules.minNumberTelefono, rules.maxNumberTelefono]"
            />
          </v-col>
          <v-col cols="12" sm="6" md="4" v-if="mode === 'create'">
            <v-text-field
              label="Contraseña"
              v-model="form.password"
              type="password"
              :rules="[rules.required, rules.password]"
            />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-select
              label="Roles"
              :items="roles"
              item-value="id"
              item-title="nombre"
              v-model="form.role_ids"
              variant="outlined"
              multiple
              chips
              :rules="[v => v?.length > 0 || 'Debe seleccionar al menos un rol']"
            />
          </v-col>
        </v-row>

        <!-- Botones -->
        <div class="mt-4">
          <v-btn color="primary" @click="checkFormBeforeConfirm" :loading="loading" class="mr-2">
            {{ mode === 'create' ? 'Guardar' : 'Actualizar' }}
          </v-btn>
          <v-btn @click="resetForm">Cancelar</v-btn>
        </div>

        <!-- Confirmación -->
        <ConfirmDialog
          v-model="confirmDialog"
          :title="mode === 'create' ? 'Confirmar creación' : 'Confirmar actualización'"
          :message="mode === 'create' ? '¿Desea guardar este usuario?' : '¿Desea actualizar la información de este usuario?'"
          @confirm="submit"
          @cancel="confirmDialog = false"
        />
      </v-form>
    </div>

<<<<<<< HEAD
    <!-- TABLA (visible desde iPad mini en adelante) -->
    <div class="d-none d-sm-flex">
      <v-data-table-server
        class="mt-8 w-100"
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

    <!-- TARJETAS (solo en móviles menores a 768px) -->
    <div class="d-flex d-sm-none flex-column gap-4 mt-6">
      <v-card
        v-for="item in serverItems"
        :key="item.id"
        class="pa-4"
        elevation="4"
        rounded="lg"
      >
        <div class="text-subtitle-1 font-weight-bold">{{ item.nombre }} {{ item.apellido }}</div>
        <div><strong>Correo:</strong> {{ item.correo }}</div>
        <div><strong>Rol:</strong> {{ item.rol.nombre }}</div>
        <div class="mt-2 d-flex justify-end">
=======
          <EditButtonComponent :item="item" @edit="editItem" />
          <DeleteButtonComponent :item="item" resource="usuario" @confirm-delete="deleteItem" />
        </div>
      </v-card>
    </div>
  </v-container>
</template>



<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import UserService from '@/services/UserService'
import RoleService from '@/services/RoleService'
import TipoDocumentoService from '@/services/TipoDocumentoService'
import ConfirmDialog from '@/components/ModalComponent.vue'
import EditButtonComponent from '@/components/button/EditComponent.vue'
import DeleteButtonComponent from '@/components/button/DeleteComponent.vue'

const headers = ref([
  { title: 'ID', key: 'id' },
  { title: 'Nombre', key: 'nombre' },
  { title: 'Apellido', key: 'apellido' },
  { title: 'Correo', key: 'correo' },
  { title: 'Roles', key: 'roles', sortable: false },
  { title: 'Acciones', key: 'acciones', sortable: false },
])

const itemsPerPage = ref(5)
const serverItems = ref([])
const totalItems = ref(0)
const search = ref('')
const currentOptions = ref({ page: 1, itemsPerPage: 5, sortBy: [] })
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
  role_ids: [] as number[],
})

const roles = ref([])
const tiposDocumento = ref([])

function getRoleColor(roleName: string): string {
  const colorMap: Record<string, string> = {
    Administrador: 'deep-purple',
    Cajero: 'indigo',
    Cocinero: 'green',
    Mesero: 'cyan',
    Estudiante: 'light-green',
    Profesor: 'blue',
    Recepcionista: 'orange',
    Administrativo: 'purple',
  }
  return colorMap[roleName] || 'grey'
}

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
    role_ids: [],
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
    const payload: any = { ...form.value }
    if (mode.value === 'update') delete payload.password
    if (mode.value === 'create') await UserService.create(payload)
    else await UserService.update(form.value.id!, payload)
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
    password: '',
    role_ids: item.role_ids ?? [],
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
      nombre: item.nombre,
      apellido: item.apellido,
      tipo_documento_id: item.tipo_documento_id,
      numero_documento: item.numero_documento,
      correo: item.correo,
      numero_telefono: item.numero_telefono,
      roles: item.userRoles?.map((ur: any) => ur.roles?.nombre).filter(Boolean) ?? [],
      role_ids: item.userRoles?.map((ur: any) => ur.roles?.id).filter(Boolean) ?? [],
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
