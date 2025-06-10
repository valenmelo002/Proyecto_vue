<template>
  <v-container class="py-8" style="background-color: #fff; min-height: 100%;">
    <v-card class="mx-auto pa-4" max-width="1500">
      <v-card-title class="text-h5 mb-4">
        {{ modoEdicion ? 'Editar Registro' : 'Reconocimiento de Peso por Imagen' }}
      </v-card-title>
      
      <!-- Mostrar información del registro en edición -->
      <v-alert
        v-if="modoEdicion"
        type="info"
        class="mb-4"
        border="start"
        variant="tonal"
      >
        Editando registro ID: {{ registroEditando?.id }}
        <v-btn 
          size="small" 
          color="primary" 
          variant="text" 
          @click="cancelarEdicion"
          class="ml-2"
        >
          Cancelar Edición
        </v-btn>
      </v-alert>
      
      <v-file-input
        accept="image/png, image/jpeg, image/jpg"
        label="Selecciona una imagen"
        prepend-icon="mdi-camera"
        show-size
        :disabled="cargando"
        @change="handleVuetifyImageUpload"
        :rules="fileRules"
      />
      
      <v-progress-linear
        v-if="cargando"
        indeterminate
        color="primary"
        class="my-4"
      />
      
      <v-img
        v-if="previewUrl"
        :src="previewUrl"
        max-width="350"
        max-height="200"
        class="my-4 mx-auto d-block"
        aspect-ratio="2"
        contain
        style="display: block; margin-left: auto; margin-right: auto;"
      />
      
      <v-row class="my-2" align="center">
        <v-col cols="6">
          <v-text-field
            v-model="textoReconocido"
            label="Peso reconocido"
            type="number"
            dense
            :disabled="cargando"
          />
        </v-col>
        <v-col cols="6">
          <v-select
            v-model="unidad"
            :items="['kg', 'lb', 'Ml', 'L']"
            label="Unidad"
            dense
            :disabled="cargando"
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
            :disabled="cargando"
          />
        </v-col>
        <v-col cols="6">
          <v-select
            v-model="estado"
            :items="['entrada', 'salida']"
            label="Estado"
            dense
            :disabled="cargando"
          />
        </v-col>
      </v-row>
      
      <v-btn
        :color="modoEdicion ? 'warning' : 'success'"
        class="my-2"
        block
        @click="modoEdicion ? actualizarRegistro() : guardarPeso()"
        :disabled="cargando || !textoReconocido"
        :loading="guardando"
      >
        {{ modoEdicion ? 'Actualizar Registro' : 'Guardar Peso' }}
      </v-btn>
      
      <v-alert
        v-if="mensaje"
        :type="tipoMensaje"
        class="mt-4"
        border="start"
        variant="tonal"
        dismissible
        @click:close="mensaje = ''"
      >
        {{ mensaje }}
      </v-alert>
    </v-card>
    
    <PesoTabla 
      ref="tablaRef" 
      class="mt-8" 
      @editar-en-formulario="manejarEdicionDesdeTabla"
    />
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onUnmounted } from "vue";
import {
  procesarImagenService,
  crearRegistroOCR,
  actualizarRegistroOCR,
  obtenerImagenRegistro,
} from "@/services/entradaSalidaProductos";
import PesoTabla from "@/components/movimientoTabla.vue";

const imagen = ref<File | null>(null);
const imagenUrl = ref<string>("");

const previewUrl = computed(() => {
  if (imagen.value) {
    return URL.createObjectURL(imagen.value);
  }
  return imagenUrl.value;
});

const textoReconocido = ref<string>("");
const unidad = ref<"kg" | "lb" | "Ml" | "L">("kg");
const categoria = ref<"carnes" | "bebidas" | "verduras">("carnes");
const estado = ref<"entrada" | "salida">("entrada");

const cargando = ref(false);
const guardando = ref(false);
const mensaje = ref("");
const tipoMensaje = ref<"success" | "error" | "info">("info");
const tablaRef = ref();

// Variables para el modo edición
const modoEdicion = ref(false);
const registroEditando = ref<any>(null);

const fileRules = [
  (v: File[] | File | null) => {
    if (!v || (Array.isArray(v) && v.length === 0))
      return "Debes seleccionar una imagen";
    return true;
  },
];

// Limpiar URLs temporales al desmontar el componente
onUnmounted(() => {
  if (imagenUrl.value && imagenUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(imagenUrl.value);
  }
});

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

  // Limpiar URL anterior si existe
  if (imagenUrl.value && imagenUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(imagenUrl.value);
  }

  imagen.value = file;
  imagenUrl.value = "";
  textoReconocido.value = "";
  mensaje.value = "";

  if (imagen.value) {
    procesarImagen();   
  }
}

async function procesarImagen() {
  if (!imagen.value) {
    mostrarMensaje("Por favor, sube una imagen antes de continuar.", "error");
    return;
  }
  
  cargando.value = true;
  try {
    const respuesta = await procesarImagenService(imagen.value);
    
    if (typeof respuesta === "object" && respuesta !== null) {
      textoReconocido.value =
        respuesta.number?.toString() ||
        respuesta.numero?.toString() ||
        respuesta.text?.toString() ||
        "";
    } else if (typeof respuesta === "string") {
      textoReconocido.value = respuesta;
    } else {
      textoReconocido.value = "";
    }
    
    if (textoReconocido.value) {
      mostrarMensaje(`Peso detectado: ${textoReconocido.value}`, "success");
    } else {
      mostrarMensaje("No se pudo detectar ningún peso en la imagen", "error");
    }
  } catch (error) {
    mostrarMensaje("Ocurrió un error al procesar la imagen.", "error");
    console.error(error);
  } finally {
    cargando.value = false;
  }
}

async function guardarPeso() {
  if (!textoReconocido.value || isNaN(Number(textoReconocido.value))) {
    mostrarMensaje("Por favor, ingresa o procesa un peso válido.", "error");
    return;
  }
  
  guardando.value = true;
  try {
    await crearRegistroOCR({
      categoria: categoria.value,
      text: textoReconocido.value,
      uM: unidad.value,
      estado: estado.value,
      imagen: imagen.value || undefined,
    });
    
    mostrarMensaje("Registro guardado correctamente.", "success");
    
    // Limpiar formulario
    limpiarFormulario();
    
    // Recargar tabla
    if (tablaRef.value) {
      await tablaRef.value.cargarRegistros();
    }
  } catch (error) {
    mostrarMensaje("Error al guardar el registro.", "error");
    console.error(error);
  } finally {
    guardando.value = false;
  }
}

async function actualizarRegistro() {
  if (!textoReconocido.value || isNaN(Number(textoReconocido.value))) {
    mostrarMensaje("Por favor, ingresa un peso válido.", "error");
    return;
  }
  
  if (!registroEditando.value?.id) {
    mostrarMensaje("Error: No se encontró el ID del registro.", "error");
    return;
  }
  
  guardando.value = true;
  try {
    await actualizarRegistroOCR(registroEditando.value.id, {
      text: Number(textoReconocido.value),
      uM: unidad.value,
      categoria: categoria.value,
      estado: estado.value,
      imagen: imagen.value || undefined,
    });
    
    mostrarMensaje("Registro actualizado correctamente.", "success");
    
    // Cancelar modo edición y limpiar formulario
    cancelarEdicion();
    
    // Recargar tabla
    if (tablaRef.value) {
      await tablaRef.value.cargarRegistros();
    }
  } catch (error) {
    mostrarMensaje("Error al actualizar el registro.", "error");
    console.error(error);
  } finally {
    guardando.value = false;
  }
}

async function manejarEdicionDesdeTabla(registro: any) {
  try {
    // Activar modo edición
    modoEdicion.value = true;
    registroEditando.value = registro;
    
    // Cargar datos del registro en el formulario
    textoReconocido.value = registro.text?.toString() || "";
    unidad.value = registro.uM || "kg";
    categoria.value = registro.categoria || "carnes";
    estado.value = registro.estado || "entrada";
    
    // Limpiar imagen anterior
    imagen.value = null;
    if (imagenUrl.value && imagenUrl.value.startsWith('blob:')) {
      URL.revokeObjectURL(imagenUrl.value);
    }
    
    // Intentar cargar la imagen del registro
    if (registro.id) {
      cargando.value = true;
      try {
        const urlImagen = await obtenerImagenRegistro(registro.id);
        imagenUrl.value = urlImagen;
      } catch (error) {
        console.log("No se pudo cargar la imagen del registro:", error);
        imagenUrl.value = "";
      } finally {
        cargando.value = false;
      }
    }
    
    mostrarMensaje(`Editando registro ID: ${registro.id}`, "info");
    
    // Hacer scroll hacia arriba para mostrar el formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
  } catch (error) {
    mostrarMensaje("Error al cargar el registro para edición.", "error");
    console.error(error);
  }
}

function cancelarEdicion() {
  modoEdicion.value = false;
  registroEditando.value = null;
  limpiarFormulario();
  mostrarMensaje("Edición cancelada.", "info");
}

function limpiarFormulario() {
  imagen.value = null;
  if (imagenUrl.value && imagenUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(imagenUrl.value);
  }
  imagenUrl.value = "";
  textoReconocido.value = "";
  unidad.value = "kg";
  categoria.value = "carnes";
  estado.value = "entrada";
}

function mostrarMensaje(texto: string, tipo: "success" | "error" | "info") {
  mensaje.value = texto;
  tipoMensaje.value = tipo;
}
</script>
