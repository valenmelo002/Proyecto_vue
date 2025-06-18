<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-card-title>Agregar Detalle</v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col cols="12" sm="6">
            <v-text-field v-model="detalle.proveedor_id" label="Proveedor" required />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="detalle.producto_id" label="Producto" required />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="detalle.cantidad" label="Cantidad" type="number" required />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="detalle.precio" label="Precio" type="number" required />
          </v-col>
          <v-col cols="12" sm="12">
            <v-text-field v-model="detalle.subtotal" label="Subtotal" type="number" required />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="close">Cancelar</v-btn>
        <v-spacer />
        <v-btn color="primary" text @click="guardarDetalle">Guardar Detalle</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import * as facturaService from "@/services/facturaCompraService";
const props = defineProps({
  modelValue: Boolean,
  facturaId: [Number, String],
});
const emit = defineEmits(["update:modelValue", "detalle-agregado"]);

const detalle = ref({
  proveedor_id: "",
  producto_id: "",
  cantidad: "",
  precio: "",
  subtotal: "",
});

// Computed para el v-model del dialog
const dialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit("update:modelValue", val),
});

function close() {
  dialog.value = false;
}

function validarDetalle() {
  // proveedor_id (obligatorio)
  if (
    detalle.value.proveedor_id === "" ||
    isNaN(Number(detalle.value.proveedor_id)) ||
    Number(detalle.value.proveedor_id) <= 0 ||
    !Number.isInteger(Number(detalle.value.proveedor_id))
  ) {
    alert("El proveedor es obligatorio y debe ser un número entero positivo.");
    return false;
  }

  // producto_id (obligatorio)
  if (
    detalle.value.producto_id === "" ||
    isNaN(Number(detalle.value.producto_id)) ||
    Number(detalle.value.producto_id) <= 0 ||
    !Number.isInteger(Number(detalle.value.producto_id))
  ) {
    alert("El producto es obligatorio y debe ser un número entero positivo.");
    return false;
  }

  // cantidad (obligatorio)
  if (
    detalle.value.cantidad === "" ||
    isNaN(Number(detalle.value.cantidad)) ||
    Number(detalle.value.cantidad) <= 0 ||
    !Number.isInteger(Number(detalle.value.cantidad))
  ) {
    alert("La cantidad es obligatoria y debe ser un número entero positivo.");
    return false;
  }

  // precio (obligatorio)
  if (
    detalle.value.precio === "" ||
    isNaN(Number(detalle.value.precio)) ||
    Number(detalle.value.precio) <= 0 ||
    !Number.isInteger(Number(detalle.value.precio))
  ) {
    alert("El precio es obligatorio y debe ser un número entero positivo.");
    return false;
  }

  // subtotal (obligatorio)
  if (
    detalle.value.subtotal === "" ||
    isNaN(Number(detalle.value.subtotal)) ||
    Number(detalle.value.subtotal) <= 0 ||
    !Number.isInteger(Number(detalle.value.subtotal))
  ) {
    alert("El subtotal es obligatorio y debe ser un número entero positivo.");
    return false;
  }

  return true;
}

async function guardarDetalle() {
  if (!props.facturaId) return;
  if (!validarDetalle()) return;
  await facturaService.createDetalle({
    factura_compras_id: props.facturaId,
    ...detalle.value,
  });
  emit("detalle-agregado");
  close();
}
</script>

<style scoped>
@media (max-width: 600px) {
  .v-card-text {
    padding: 8px !important;
  }
}
</style>
