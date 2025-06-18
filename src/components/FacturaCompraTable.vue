<template>
  <div class="table-responsive">
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
            max-width="350"
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
            <div style="min-width: 250px;">
              <div
                v-for="detalle in item.detalles"
                :key="detalle.id"
                style="margin-bottom: 12px; border-bottom: 1px solid #eee; padding-bottom: 8px;"
              >
                <div><strong>Proveedor:</strong> {{ detalle.proveedor }}</div>
                <div><strong>Producto:</strong> {{ detalle.producto }}</div>
                <div><strong>Cantidad:</strong> {{ detalle.cantidad }}</div>
                <div><strong>Precio:</strong> {{ detalle.precio }}</div>
                <div><strong>Subtotal:</strong> {{ detalle.subtotal }}</div>
                <!-- Agrega aquí más campos si tu detalle tiene más información -->
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
        <v-btn prepend-icon="mdi-backup-restore" rounded="lg" text="Recargar" variant="text" border @click="$emit('reload')"></v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script setup lang="ts">
import * as facturaCompraService from "@/services/facturaCompraService";
import EditComponent from "@/components/button/EditComponent.vue";
import DeleteComponent from "@/components/button/DeleteComponent.vue";

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

function confirmarYEliminar(id: number | string) {
  if (!confirm) return;
  facturaCompraService.deleteFactura(String(id)).then(() => {
    alert("La factura ha sido eliminada exitosamente");
    window.location.reload();
  });
}
</script>

<style scoped>
.table-responsive {
  width: 100%;
  overflow-x: auto;
  max-width: 100vw;
}

.v-data-table {
  min-width: 600px;
}

@media (max-width: 900px) {
  .v-data-table {
    min-width: 500px;
    font-size: 0.95rem;
  }
}

@media (max-width: 600px) {
  .v-data-table {
    min-width: 400px;
    font-size: 0.85rem;
  }
  .table-responsive {
    padding: 0 2px;
  }
}
</style>
