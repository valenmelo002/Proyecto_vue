<template>
  <v-form @submit.prevent="emitSubmit" class="pa-4" style="max-width: 500px; margin: auto;">
    <v-row dense>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="localForm.numeroFactura"
          label="Número de factura"
          type="number"
          dense
          outlined
          hide-details
          required
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="localForm.nit"
          label="NIT"
          type="number"
          dense
          outlined
          hide-details
          required
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="localForm.nombreEmpresa"
          label="Nombre de la empresa"
          dense
          outlined
          hide-details
          required
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="localForm.direccionEmpresa"
          label="Dirección de la empresa"
          dense
          outlined
          hide-details
          required
        />
      </v-col>
    </v-row>
    <v-row dense class="mt-2" justify="end">
      <v-btn
        color="primary"
        type="submit"
        size="small"
        class="mr-2"
        elevation="1"
      >
        {{ isEditing ? "Actualizar" : "Guardar" }}
      </v-btn>
      <v-btn
        variant="text"
        size="small"
        color="secondary"
        @click="emitReset"
        elevation="0"
      >
        Limpiar
      </v-btn>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
const props = defineProps({
  form: { type: Object, default: () => ({}) },
  isEditing: Boolean,
});
const emit = defineEmits(["submit", "reset"]);

const localForm = ref({ ...props.form });

// Sincroniza localForm con form del padre
watch(
  () => props.form,
  (val) => {
    Object.assign(localForm.value, val || {});
  },
  { deep: true }
);

function emitSubmit() {
  emit("submit", { ...localForm.value });
}

function emitReset() {
  localForm.value = {};
  emit("reset");
}
</script>
