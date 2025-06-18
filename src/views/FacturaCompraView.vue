<template>
  <v-container class="py-8 main-container-responsive" style="background: #fff; min-height: 100vh;">
    <v-card class="pa-6 main-card-responsive">
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
          :facturas="filteredFacturas"
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

      <ModalComponent
        v-model="showUpdateDialog"
        title="Confirmar actualización"
        message="¿Está seguro que desea actualizar este registro?"
        @confirm="confirmUpdate"
      />
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import * as facturaCompraService from "@/services/facturaCompraService";
import FacturaCompraForm from "@/components/FacturaCompraForm.vue";
import FacturaCompraTable from "@/components/FacturaCompraTable.vue";
import FacturaCompraDetalleModal from "@/components/FacturaCompraDetalleModal.vue";
import ModalComponent from "@/components/ModalComponent.vue";

const facturas = ref([]);
const search = ref("");
const form = ref({});
const showDetalleModal = ref(false);
const facturaSeleccionada = ref(null);
const showConfirmDialog = ref(false);
const facturaIdToDelete = ref<string | number | null>(null);
const showUpdateDialog = ref(false)
const pendingUpdatePayload = ref<any>(null)

const headers = [
  { title: 'Número Factura', key: 'numeroFactura' },
  { title: 'NIT', key: 'nit' },
  { title: 'Nombre Empresa', key: 'nombreEmpresa' },
  { title: 'Dirección Empresa', key: 'direccionEmpresa' },
  { title: 'Detalles', key: 'detalles', sortable: false },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' },
];

async function cargarFacturas() {
  facturas.value = await facturaCompraService.getFacturas();
}
onMounted(cargarFacturas);

async function handleSubmit(payload) {
  // Validación: NIT
  if (
    payload.nit === undefined ||
    payload.nit === null ||
    payload.nit === "" ||
    isNaN(Number(payload.nit)) ||
    Number(payload.nit) <= 0 ||
    !Number.isInteger(Number(payload.nit))
  ) {
    alert("El NIT es obligatorio, debe ser un número entero positivo.");
    return;
  }

  // Validación: Número de factura (obligatorio)
  if (
    payload.numeroFactura === undefined ||
    payload.numeroFactura === null ||
    payload.numeroFactura === "" ||
    isNaN(Number(payload.numeroFactura)) ||
    Number(payload.numeroFactura) <= 0 ||
    !Number.isInteger(Number(payload.numeroFactura))
  ) {
    alert("El número de factura es obligatorio y debe ser un número entero positivo.");
    return;
  }

  // Validación: Nombre empresa
  if (
    !payload.nombreEmpresa ||
    typeof payload.nombreEmpresa !== "string" ||
    payload.nombreEmpresa.trim().length < 3 ||
    payload.nombreEmpresa.trim().length > 255
  ) {
    alert("El nombre de la empresa es obligatorio, mínimo 3 y máximo 255 caracteres.");
    return;
  }

  // Validación: Dirección empresa
  if (
    !payload.direccionEmpresa ||
    typeof payload.direccionEmpresa !== "string" ||
    payload.direccionEmpresa.trim().length < 3 ||
    payload.direccionEmpresa.trim().length > 255
  ) {
    alert("La dirección de la empresa es obligatoria, mínimo 3 y máximo 255 caracteres.");
    return;
  }

  // Si pasa las validaciones, continúa con el flujo normal
  if (form.value.id) {
    // Guardar el payload pendiente y mostrar el modal
    pendingUpdatePayload.value = payload
    showUpdateDialog.value = true
  } else {
    const res = await facturaCompraService.createFactura(payload);
    form.value.id = res.id;
    await cargarFacturas();
    resetForm();
    alert("La factura ha sido creada exitosamente");
  }
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
  if (!confirm) return;
  facturaIdToDelete.value = id;
  showConfirmDialog.value = true;
}

async function deleteFacturaConfirmed() {
  if (facturaIdToDelete.value) {
    await facturaCompraService.deleteFactura(String(facturaIdToDelete.value));
    await cargarFacturas();
    facturaIdToDelete.value = null;
  }
}

async function confirmUpdate() {
  if (form.value.id && pendingUpdatePayload.value) {
    await facturaCompraService.updateFactura(String(form.value.id), pendingUpdatePayload.value);
    await cargarFacturas();
    resetForm();
    pendingUpdatePayload.value = null;
    alert("La factura ha sido editada exitosamente");
  }
}
</script>

<style scoped>
.main-container-responsive {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
.main-card-responsive {
  max-width: 1100px;
  margin: auto;
}
@media (max-width: 900px) {
  .main-container-responsive {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
  .main-card-responsive {
    padding: 16px;
  }
}
</style>
