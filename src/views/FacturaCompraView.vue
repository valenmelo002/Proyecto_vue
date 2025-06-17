<template>
  <v-container class="py-8" style="background: #fff; min-height: 100vh;">
    <v-card class="pa-6">
      <FacturaCompraForm
        :form="form"
        :is-editing="!!form.id"
        @submit="handleSubmit"
        @reset="resetForm"
        @open-detalle="abrirModalDetalle"
      />

        <!-- Buscador antes de la tabla -->
      <v-row class="mb-4" justify="center">
        <v-col cols="12" md="6">
          <v-text-field
            v-model="search"
            label="Buscar facturas"
            dense
            clearable
            prepend-inner-icon="mdi-magnify"
          />
        </v-col>
      </v-row>

      <v-sheet border rounded>
        <FacturaCompraTable
          :facturas="facturas"
          :headers="headers"
          @edit="editFactura"
          @delete="confirmDeleteFactura"
          @agregar-detalle="abrirModalDetalle"
        />

      <ConfirmDialog
        v-model="showConfirmDialog"
        @confirm="deleteFacturaConfirmed"
      />
      </v-sheet>

      <FacturaCompraDetalleModal
        v-model="showDetalleModal"
        :factura-id="facturaSeleccionada?.id"
        @detalle-agregado="cargarFacturas"
      />
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import * as facturaService from "@/services/facturaCompraService";
import FacturaCompraForm from "@/components/FacturaCompraForm.vue";
import FacturaCompraTable from "@/components/FacturaCompraTable.vue";
import FacturaCompraDetalleModal from "@/components/FacturaCompraDetalleModal.vue";

const facturas = ref([]);
const search = ref("");
const form = ref({});
const showDetalleModal = ref(false);
const facturaSeleccionada = ref(null);
const showConfirmDialog = ref(false);
const facturaIdToDelete = ref<string | number | null>(null);

const headers = [
  { title: 'Número Factura', key: 'numeroFactura' },
  { title: 'NIT', key: 'nit' },
  { title: 'Nombre Empresa', key: 'nombreEmpresa' },
  { title: 'Dirección Empresa', key: 'direccionEmpresa' },
  { title: 'Detalles', key: 'detalles', sortable: false },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' },
];

async function cargarFacturas() {
  facturas.value = await facturaService.getFacturas();
}
onMounted(cargarFacturas);

async function handleSubmit(payload) {
  if (form.value.id) {
    await facturaService.updateFactura(String(form.value.id), payload);
  } else {
    const res = await facturaService.createFactura(payload);
    form.value.id = res.id;
  }
  await cargarFacturas();
  resetForm();
}

const filteredFacturas = computed(() => {
  if (!search.value) return facturas.value;
  const term = search.value.toLowerCase();
  return facturas.value.filter(f =>
    Object.values(f)
      .join(" ")
      .toLowerCase()
      .includes(term)
  );
});

function editFactura(factura) {
  form.value = { ...factura };
}

function resetForm() {
  form.value = {};
}

function abrirModalDetalle(factura) {
  facturaSeleccionada.value = factura;
  showDetalleModal.value = true;
}

function confirmDeleteFactura(id) {
  facturaIdToDelete.value = id;
  showConfirmDialog.value = true;
}

async function deleteFacturaConfirmed() {
  if (facturaIdToDelete.value) {
    await facturaService.deleteFactura(String(facturaIdToDelete.value));
    await cargarFacturas();
    facturaIdToDelete.value = null;
  }
}
</script>
