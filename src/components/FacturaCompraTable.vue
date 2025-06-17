<template>
  <v-data-table
    :headers="headers"
    :items="facturas"
    :hide-default-footer="facturas.length < 11"
    item-value="id"
  >
    <template #item.detalles="{ item }">
      <div>
        <v-btn
          v-if="!item.detalles || !item.detalles.length"
          color="secondary"
          size="small"
          class="mb-2"
          @click="$emit('agregar-detalle', item)"
        >
          Agregar detalle
        </v-btn>
        <v-tooltip
          v-else
          location="top"
        >
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              color="primary"
              size="small"
              class="mb-2"
            >
              <v-icon>mdi-eye</v-icon>
            </v-btn>
          </template>
          <div style="min-width: 220px;">
            <div v-for="detalle in item.detalles" :key="detalle.id" style="margin-bottom: 8px;">
              <strong>{{ detalle.proveedor }} - {{ detalle.producto }}</strong><br>
              Cantidad: {{ detalle.cantidad }}<br>
              Precio: {{ detalle.precio }}<br>
              Subtotal: {{ detalle.subtotal }}
            </div>
          </div>
        </v-tooltip>
      </div>
    </template>
    <template #item.actions="{ item }">
      <v-icon
        color="primary"
        icon="mdi-pencil"
        size="small"
        @click="$emit('edit', item)"
      ></v-icon>
      <v-icon
        color="error"
        icon="mdi-delete"
        size="small"
        @click="eliminarFactura(item.id)"
      ></v-icon>
    </template>
    <template #no-data>
      <v-btn prepend-icon="mdi-backup-restore" rounded="lg" text="Recargar" variant="text" border @click="$emit('reload')"></v-btn>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import * as facturaService from "@/services/facturaCompraService";

interface Detalle {
  id: number | string;
  proveedor: string;
  producto: string;
  cantidad: number;
  precio: number;
  subtotal: number;
}

interface Factura {
  id: number | string;
  detalles?: Detalle[];
  // otras propiedades...
}

const props = defineProps<{
  facturas: Factura[];
  headers: any[];
}>();

function eliminarFactura(id: number | string) {
  facturaService.deleteFactura(String(id)).then(() => {
    // Opcional: puedes emitir un evento para recargar la tabla en el padre
    // $emit('reload')
    window.location.reload(); // O recarga la tabla de otra forma
  });
}
</script>
