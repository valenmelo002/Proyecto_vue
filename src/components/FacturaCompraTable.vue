<template>
  <v-data-table
    :headers="headers"
    :items="facturas"
    :hide-default-footer="facturas.length < 11"
    item-value="id"
  >
    <template v-slot:item.detalles="{ item }">
      <div v-if="item.detalles && item.detalles.length">
        <v-list density="compact">
          <v-list-item
            v-for="detalle in item.detalles"
            :key="detalle.id"
            :title="`${detalle.proveedor} - ${detalle.producto}`"
            :subtitle="`Cantidad: ${detalle.cantidad}, Precio: ${detalle.precio}, Subtotal: ${detalle.subtotal}`"
          />
        </v-list>
      </div>
      <div v-else>Sin detalles</div>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon color="primary" icon="mdi-pencil" size="small" @click="$emit('edit', item)"></v-icon>
      <v-icon color="error" icon="mdi-delete" size="small" @click="$emit('delete', item.id)"></v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn prepend-icon="mdi-backup-restore" rounded="lg" text="Recargar" variant="text" border @click="$emit('reload')"></v-btn>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
defineProps({
  facturas: Array,
  headers: Array,
});
defineEmits(["edit", "delete", "reload"]);
</script>
