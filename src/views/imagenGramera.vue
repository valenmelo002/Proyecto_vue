<template>
  <div class="peso">
    <h1>Reconocimiento de Texto en Imagen</h1>
    <input
      type="file"
      accept="image/png, image/jpeg, image/jpg"
      @change="handleImageUpload"
    />
    <button @click="procesarImagen" :disabled="!imagen || cargando">
      Procesar Imagen
    </button>
    <div v-if="imagen" style="margin: 1rem 0">
      <img :src="previewUrl" alt="Vista previa" style="max-width: 200px" />
    </div>
    <div v-if="cargando" style="margin: 1rem">Procesando imagen...</div>
    <div class="peso-inputs">
      <input
        v-model="textoReconocido"
        type="number"
        step="any"
        placeholder="Peso reconocido"
      />
      <select v-model="unidad">
        <option value="kg">kg</option>
        <option value="lb">lb</option>
        <option value="Ml">Ml</option>
        <option value="L">L</option>
      </select>
    </div>
    <select v-model="categoria">
      <option value="carnes">carnes</option>
      <option value="bebidas">bebidas</option>
      <option value="verduras">verduras</option>
    </select>
    <select v-model="estado">
      <option value="entrada">entrada</option>
      <option value="salida">salida</option>
    </select>
    <button @click="obtenerPeso" class="obtener-peso-btn">Obtener peso</button>
    <h2 v-if="peso !== null">Peso detectado: {{ peso }} {{ unidad }}</h2>
    <PesoTabla />
  </div>
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

function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0] || null;
  if (file) {
    imagen.value = file;
    textoReconocido.value = "";
    peso.value = null;
  }
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
    console.log("Respuesta del backend:", respuesta);

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

<style scoped>
.peso {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}
.peso-inputs {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}
input[type="number"] {
  width: 100px;
  text-align: center;
}
select {
  height: 32px;
}
button {
  padding: 0.75rem 1.5rem;
  background-color: #1e90ff;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1rem;
}
button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}
button:hover:enabled {
  background-color: #1c86ee;
}
h2 {
  margin-top: 1rem;
  color: #1e90ff;
}
</style>
