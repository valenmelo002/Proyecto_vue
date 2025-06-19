<template>
  <div>
    <!-- Vista tipo tarjetas (para móviles) -->
    <div class="d-md-none">
      <v-row dense>
        <v-col cols="12" v-for="factura in facturas" :key="factura.id">
          <v-card class="pa-3" elevation="2">
            <div><strong>Número:</strong> {{ factura.id }}</div>
            <div><strong>Detalles:</strong></div>
            <div v-if="!factura.detalles || !factura.detalles.length">
              <v-btn
                color="secondary"
                size="x-small"
                @click="$emit('agregar-detalle', factura)"
              >
                Agregar detalle
              </v-btn>
            </div>
            <div v-else>
              <div
                v-for="detalle in factura.detalles"
                :key="detalle.id"
                class="mb-2"
              >
                <div><strong>Proveedor:</strong> {{ detalle.proveedor }}</div>
                <div><strong>Producto:</strong> {{ detalle.producto }}</div>
                <div><strong>Cantidad:</strong> {{ detalle.cantidad }}</div>
                <div><strong>Precio:</strong> {{ detalle.precio }}</div>
                <div><strong>Subtotal:</strong> {{ detalle.subtotal }}</div>
              </div>
            </div>
            <div class="d-flex justify-end gap-2 mt-2">
              <EditComponent :item="factura" @edit="$emit('edit', $event)" />
              <DeleteComponent
                :item="{ ...factura, id: Number(factura.id) }"
                resource="factura"
                @confirm-delete="confirmarYEliminar(factura.id)"
              />
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Vista tipo tabla (pantallas medianas en adelante) -->
    <div class="d-none d-md-block">
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
              size="x-small"
              @click="$emit('agregar-detalle', item)"
            >
              Detalle
            </v-btn>
            <v-tooltip v-else location="top" max-width="300">
              <template #activator="{ props }">
                <v-btn v-bind="props" icon color="primary" size="x-small">
                  <v-icon size="18">mdi-eye</v-icon>
                </v-btn>
              </template>
              <div style="min-width: 250px; font-size: 0.85rem">
                <div v-for="detalle in item.detalles" :key="detalle.id">
                  <div><strong>Proveedor:</strong> {{ detalle.proveedor }}</div>
                  <div><strong>Producto:</strong> {{ detalle.producto }}</div>
                  <div><strong>Cantidad:</strong> {{ detalle.cantidad }}</div>
                  <div><strong>Precio:</strong> {{ detalle.precio }}</div>
                  <div><strong>Subtotal:</strong> {{ detalle.subtotal }}</div>
                </div>
              </div>
            </v-tooltip>
          </div>
        </template>

        <template #item.actions="{ item }">
          <EditComponent :item="item" @edit="$emit('edit', $event)" />
          <DeleteComponent
            :item="{ ...item, id: Number(item.id) }"
            resource="factura"
            @confirm-delete="confirmarYEliminar(item.id)"
          />
        </template>

        <template #no-data>
          <v-btn
            prepend-icon="mdi-backup-restore"
            rounded="lg"
            text="Recargar"
            variant="text"
            border
            @click="$emit('reload')"
          />
        </template>
      </v-data-table>
    </div>

    <!-- Snackbar de éxito -->
    <v-snackbar v-model="snackbar" :timeout="3000" color="success">
      {{ snackbarText }}
      <template #actions>
        <v-btn color="white" variant="text" @click="snackbar = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import * as facturaCompraService from "@/services/facturaCompraService";
import EditComponent from "@/components/button/EditComponent.vue";
import DeleteComponent from "@/components/button/DeleteComponent.vue";

// Interfaces
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
}

// Props y emit
const props = defineProps<{
  facturas: Factura[];
  headers: any[];
}>();

const emit = defineEmits(["edit", "reload", "agregar-detalle"]);

// Snackbar control
const snackbar = ref(false);
const snackbarText = ref("");

// Función para confirmar y eliminar factura
function confirmarYEliminar(id: number | string) {
  facturaCompraService.deleteFactura(String(id))
    .then(() => {
      snackbarText.value = "La factura ha sido eliminada exitosamente";
      snackbar.value = true;

      // ✅ Opción 1: Emitir evento al padre (preferido si el padre tiene lógica para recargar)
      emit("reload");

      // ❌ Opción 2: Recargar la página directamente (descomenta si no usas `emit`)
      // setTimeout(() => window.location.reload(), 1000);
    })
    .catch((error) => {
      console.error(error);
      snackbarText.value = "Error al eliminar la factura";
      snackbar.value = true;
    });
}
</script>

<style scoped>
@media (max-width: 600px) {
  .v-card {
    font-size: 0.85rem;
  }

  .v-btn {
    font-size: 0.75rem !important;
    padding: 4px 8px !important;
  }

  .v-icon {
    font-size: 16px !important;
  }
}
</style>
