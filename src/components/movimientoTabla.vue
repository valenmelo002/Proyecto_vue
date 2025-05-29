<template>
  <div>
    <v-card class="pa-4 mb-4">
      <v-row>
        <v-col cols="12" md="3">
          <v-text-field v-model="nuevo.categoria" label="Producto" dense />
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field v-model="nuevo.text" label="Peso" type="number" dense />
        </v-col>
        <v-col cols="12" md="2">
          <v-select
            v-model="nuevo.uM"
            :items="['kg', 'lb', 'Ml', 'L']"
            label="Unidad"
            dense
          />
        </v-col>
        <v-col cols="12" md="2">
          <v-select
            v-model="nuevo.estado"
            :items="['entrada', 'salida']"
            label="Estado"
            dense
          />
        </v-col>
        <v-col cols="12" md="3" class="d-flex align-center">
          <v-btn color="primary" @click="guardarRegistro" class="mr-2">
            {{ editando ? "Actualizar" : "Agregar" }}
          </v-btn>
          <v-btn v-if="editando" color="grey" @click="cancelarEdicion">
            Cancelar
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

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
} from "@/services/entradaSalidaProductos";
import axios from "axios";

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

function editarRegistro(registro: any) {
  nuevo.value = { ...registro };
  editando.value = true;
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
    await axios.post("http://localhost:8080/api/ocr", {
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
</script>
