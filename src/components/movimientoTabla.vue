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
import { ref, onMounted } from "vue";
import {
  obtenerRegistrosPesos,
  actualizarRegistroOCR,
  eliminarRegistroOCR,
  crearRegistroOCR,
} from "@/services/entradaSalidaProductos";

// AGREGAR emit para comunicar con el padre
const emit = defineEmits(['editar-en-formulario']);

const loading = ref(false);
const registros = ref<any[]>([]);
const nuevo = ref({ categoria: "", text: "", uM: "kg", estado: "entrada", id: null });
const editando = ref(false);

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
  registros.value = await obtenerRegistrosPesos();
  loading.value = false;
}

// ACTUALIZAR esta función para emitir al padre:
function editarRegistro(registro: any) {
  // Emitir al componente padre para que maneje la edición
  emit('editar-en-formulario', registro);
}

function cancelarEdicion() {
  nuevo.value = { categoria: "", text: "", uM: "kg", estado: "entrada", id: null };
  editando.value = false;
}

async function guardarRegistro() {
  if (!nuevo.value.categoria || !nuevo.value.text) return;
  if (editando.value && nuevo.value.id) {
    if (confirm("¿Confirmas la actualización de este registro?")) {
      await actualizarRegistroOCR(nuevo.value.id, {
        text: Number(nuevo.value.text),
        uM: nuevo.value.uM,
        categoria: nuevo.value.categoria,
        estado: nuevo.value.estado,
      });
    } else {
      return;
    }
  } else {
    await crearRegistroOCR({
      categoria: nuevo.value.categoria,
      text: nuevo.value.text.toString(),
      uM: nuevo.value.uM,
      estado: nuevo.value.estado,
    });
  }
  cancelarEdicion();
  await cargarRegistros();
}

async function eliminarRegistro(id: number) {
  if (confirm("¿Estás seguro de que deseas eliminar este registro?")) {
    await eliminarRegistroOCR(id);
    await cargarRegistros();
  }
}

defineExpose({
  cargarRegistros
});
</script>
