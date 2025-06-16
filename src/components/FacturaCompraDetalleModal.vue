<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-card-title>Agregar Detalle</v-card-title>
      <v-card-text>
        <v-text-field v-model="detalle.proveedor_id" label="Proveedor" required />
        <v-text-field v-model="detalle.producto_id" label="Producto" required />
        <v-text-field v-model="detalle.cantidad" label="Cantidad" type="number" required />
        <v-text-field v-model="detalle.precio" label="Precio" type="number" required />
        <v-text-field v-model="detalle.subtotal" label="Subtotal" type="number" required />
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

async function guardarDetalle() {
  if (!props.facturaId) return;
  await facturaService.createDetalle({
    factura_compras_id: props.facturaId,
    ...detalle.value,
  });
  emit("detalle-agregado");
  close();
}
</script>
