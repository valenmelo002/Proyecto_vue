<template>
  <div>
    <v-data-table-server
      :headers="headers"
      :items="registros"
      :items-length="registros.length"
      :items-per-page="5"
      class="elevation-1"
      :loading="loading"
    >
      <template #item.acciones="{ item }">
        <v-btn icon color="primary" @click="editarRegistro(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon color="red" @click="eliminarRegistro(item.id)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table-server>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineExpose, defineEmits } from "vue";
import {
  obtenerRegistrosPesos,
  eliminarRegistroOCR,
} from "@/services/entradaSalidaProductos";

// Definir emisores de eventos
const emit = defineEmits<{
  editarEnFormulario: [registro: any]
}>();

const loading = ref(false);
const registros = ref<any[]>([]);

const headers = [
  { title: "Producto", key: "categoria" },
  { title: "Peso", key: "text" },
  { title: "Unidad", key: "uM" },
  { title: "Estado", key: "estado" },
  { title: "Acciones", key: "acciones", sortable: false },
];

onMounted(async () => {
  await cargarRegistros();
});

async function cargarRegistros() {
  loading.value = true;
  try {
    registros.value = await obtenerRegistrosPesos();
  } catch (error) {
    console.error('Error al cargar registros:', error);
  } finally {
    loading.value = false;
  }
}

function editarRegistro(registro: any) {
  // Solo emitir evento al componente padre para actualizar el formulario
  emit('editarEnFormulario', registro);
}

async function eliminarRegistro(id: number) {
  if (confirm("¿Estás seguro de que deseas eliminar este registro?")) {
    try {
      await eliminarRegistroOCR(id);
      await cargarRegistros();
    } catch (error) {
      console.error('Error al eliminar registro:', error);
      alert('Error al eliminar el registro');
    }
  }
}

defineExpose({
  cargarRegistros
});
</script>
