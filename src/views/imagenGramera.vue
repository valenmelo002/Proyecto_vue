<template>
  <v-container class="py-8" style="background-color: #fff; min-height: 100%;">
    <v-card class="mx-auto pa-4" max-width="1500">
      <v-card-title class="text-h5 mb-4"
        >Reconocimiento de Texto en Imagen</v-card-title
      >
      <v-file-input
        accept="image/png, image/jpeg, image/jpg"
        label="Selecciona una imagen"
        prepend-icon="mdi-camera"
        show-size
        :disabled="cargando"
        @change="handleVuetifyImageUpload"
        :rules="fileRules"
      />
      <v-btn
        class="mt-4"
        color="primary"
        :disabled="!imagen || cargando"
        @click="procesarImagen"
        block
      >
        Procesar Imagen
      </v-btn>
      <v-progress-linear
        v-if="cargando"
        indeterminate
        color="primary"
        class="my-4"
      />
      <v-img
        v-if="imagen"
        :src="previewUrl"
        max-width="350"
        class="my-4 mx-auto"
        aspect-ratio="0"
        contain
      />
      <v-row class="my-2" align="center">
        <v-col cols="6">
          <v-text-field
            v-model="textoReconocido"
            label="Peso reconocido"
            type="number"
            dense
          />
        </v-col>
        <v-col cols="6">
          <v-select
            v-model="unidad"
            :items="['kg', 'lb', 'Ml', 'L']"
            label="Unidad"
            dense
          />
        </v-col>
      </v-row>
      <v-row class="my-2" align="center">
        <v-col cols="6">
          <v-select
            v-model="categoria"
            :items="['carnes', 'bebidas', 'verduras']"
            label="Categoría"
            dense
          />
        </v-col>
        <v-col cols="6">
          <v-select
            v-model="estado"
            :items="['entrada', 'salida']"
            label="Estado"
            dense
          />
        </v-col>
      </v-row>
      <v-btn
        color="success"
        class="my-2"
        block
        @click="obtenerPeso"
      >
        Obtener peso
      </v-btn>
      <v-alert
        v-if="peso !== null"
        type="info"
        class="mt-4"
        border="start"
        color="primary"
        variant="tonal"
      >
        Peso detectado: {{ peso }} {{ unidad }}
      </v-alert>
    </v-card>
    <PesoTabla class="mt-8" />
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import {
  procesarImagenService,
  obtenerPesoService,
} from "@/services/entradaSalidaProductos";
import PesoTabla from "@/components/movimientoTabla.vue";

const peso = ref<number | null>(null);
const imagen = ref<File | null>(null);
const previewUrl = computed(() =>
  imagen.value ? URL.createObjectURL(imagen.value) : ""
);
const textoReconocido = ref<string>("");
const unidad = ref<"kg" | "lb" | "Ml" | "L">("kg");
const categoria = ref<"carnes" | "bebidas" | "verduras">("carnes");
const estado = ref<"entrada" | "salida">("entrada");

const cargando = ref(false);

const fileRules = [
  (v: File[] | File | null) => {
    if (!v || (Array.isArray(v) && v.length === 0))
      return "Debes seleccionar una imagen";
    return true;
  },
];

function handleVuetifyImageUpload(filesOrEvent: File[] | File | Event | null) {
  let file: File | null = null;

  if (filesOrEvent && (filesOrEvent as Event).target) {
    const target = (filesOrEvent as Event).target as HTMLInputElement;
    file = target.files?.[0] || null;
  } else if (Array.isArray(filesOrEvent)) {
    file = filesOrEvent[0] || null;
  } else {
    file = filesOrEvent as File | null;
  }

  imagen.value = file;
  textoReconocido.value = "";
  peso.value = null;
}

async function procesarImagen() {
  if (!imagen.value) {
    alert("Por favor, sube una imagen antes de continuar.");
    return;
  }
  cargando.value = true;
  try {
    type RespuestaImagen = { number?: number; numero?: number };
    const respuesta = (await procesarImagenService(imagen.value)) as
      | RespuestaImagen
      | string;
    if (typeof respuesta === "object" && respuesta !== null) {
      const obj = respuesta as RespuestaImagen;
      if ("number" in obj) {
        textoReconocido.value = obj.number?.toString() || "";
      } else if ("numero" in obj) {
        textoReconocido.value = obj.numero?.toString() || "";
      } else {
        textoReconocido.value = "";
      }
    } else if (typeof respuesta === "string") {
      textoReconocido.value = respuesta;
    } else {
      textoReconocido.value = "";
    }
  } catch (e) {
    alert("Ocurrió un error al procesar la imagen.");
    console.error(e);
  } finally {
    cargando.value = false;
  }
}

async function obtenerPeso() {
  if (!textoReconocido.value || isNaN(Number(textoReconocido.value))) {
    alert("Por favor, ingresa o procesa un peso válido.");
    return;
  }
  try {
    const valorNumerico = Number(textoReconocido.value);
    peso.value = await obtenerPesoService(
      0,
      valorNumerico,
      unidad.value,
      categoria.value,
      estado.value
    );
    alert(`Peso detectado: ${peso.value} ${unidad.value}`);
    window.location.reload();
  } catch {
    alert("peso detectado correctamente.");
    window.location.reload();
  }
}
</script>
