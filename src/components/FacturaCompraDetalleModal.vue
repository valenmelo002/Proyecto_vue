<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-card-title class="text-h6 font-weight-bold">Agregar Detalle</v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="detalle.proveedor_id"
              label="Proveedor"
              type="number"
              required
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="detalle.producto_id"
              label="Producto"
              type="number"
              required
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="detalle.cantidad"
              label="Cantidad"
              type="number"
              required
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="detalle.precio"
              label="Precio"
              type="number"
              required
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="detalle.subtotal"
              label="Subtotal"
              type="number"
              required
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="px-4 pb-4">
        <v-btn variant="text" color="secondary" @click="close">Cancelar</v-btn>
        <v-spacer />
        <v-btn color="primary" variant="flat" @click="guardarDetalle">Guardar Detalle</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import * as facturaService from '@/services/facturaCompraService'

const props = defineProps({
  modelValue: Boolean,
  facturaId: [Number, String],
})

const emit = defineEmits(['update:modelValue', 'detalle-agregado'])

const detalle = ref({
  proveedor_id: '',
  producto_id: '',
  cantidad: '',
  precio: '',
  subtotal: '',
})

const dialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
})

function close() {
  dialog.value = false
}

function validarDetalle() {
  const campos = [
    { campo: 'proveedor_id', nombre: 'Proveedor' },
    { campo: 'producto_id', nombre: 'Producto' },
    { campo: 'cantidad', nombre: 'Cantidad' },
    { campo: 'precio', nombre: 'Precio' },
    { campo: 'subtotal', nombre: 'Subtotal' },
  ]

  for (const { campo, nombre } of campos) {
    const valor = detalle.value[campo]
    if (
      valor === '' ||
      isNaN(Number(valor)) ||
      Number(valor) <= 0 ||
      !Number.isInteger(Number(valor))
    ) {
      alert(`${nombre} es obligatorio y debe ser un número entero positivo.`)
      return false
    }
  }

  return true
}

async function guardarDetalle() {
  if (!props.facturaId || !validarDetalle()) return

  await facturaService.createDetalle({
    factura_compras_id: props.facturaId,
    ...detalle.value,
  })

  emit('detalle-agregado')
  close()
}
</script>

<style scoped>
@media (max-width: 600px) {
  .v-card-text {
    padding: 8px !important;
  }
}
</style>
