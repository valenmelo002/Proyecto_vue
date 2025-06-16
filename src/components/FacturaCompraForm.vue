<template>
  <v-form @submit.prevent="emitSubmit">
    <v-text-field v-model="localForm.numeroFactura" label="Número de factura" type="number" required />
    <v-text-field v-model="localForm.nit" label="NIT" type="number" required />
    <v-text-field v-model="localForm.nombreEmpresa" label="Nombre de la empresa" required />
    <v-text-field v-model="localForm.direccionEmpresa" label="Dirección de la empresa" required />
    <v-btn color="primary" type="submit">
      {{ isEditing ? "Actualizar" : "Guardar" }}
    </v-btn>
    <v-btn color="secondary" class="ml-4" :disabled="!localForm.id" @click="$emit('open-detalle')">
      Agregar Detalle
    </v-btn>
    <v-btn variant="text" @click="emitReset">Limpiar</v-btn>
  </v-form>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
const props = defineProps({
  form: { type: Object, default: () => ({}) },
  isEditing: Boolean,
});
const emit = defineEmits(["submit", "reset", "open-detalle"]);

const localForm = ref({ ...props.form });

// Sincroniza localForm con form del padre
watch(
  () => props.form,
  (val) => {
    Object.assign(localForm.value, val || {});
    // Si quieres limpiar completamente los campos, puedes hacer:
    // localForm.value = { ...val };
  },
  { deep: true }
);

function emitSubmit() {
  emit("submit", { ...localForm.value });
}

function emitReset() {
  // Limpia el formulario local y notifica al padre
  localForm.value = {};
  emit("reset");
}
</script>
