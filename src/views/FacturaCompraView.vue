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

      <v-sheet border rounded>
        <FacturaCompraTable
          :facturas="facturas"
          :headers="headers"
          @edit="editFactura"
          @delete="deleteFactura"
        />
      </v-sheet>

      <FacturaCompraDetalleModal
        v-model="showDetalleModal"
        :factura-id="form.id"
        @detalle-agregado="cargarFacturas"
      />
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as facturaService from "@/services/facturaCompraService";
import FacturaCompraForm from "@/components/FacturaCompraForm.vue";
import FacturaCompraTable from "@/components/FacturaCompraTable.vue";
import FacturaCompraDetalleModal from "@/components/FacturaCompraDetalleModal.vue";

const facturas = ref([]);
const form = ref({});
const showDetalleModal = ref(false);

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

function editFactura(factura) {
  form.value = { ...factura };
}

async function deleteFactura(id) {
  await facturaService.deleteFactura(String(id));
  await cargarFacturas();
}

function resetForm() {
  form.value = {};
}

function abrirModalDetalle() {
  showDetalleModal.value = true;
}
</script>
