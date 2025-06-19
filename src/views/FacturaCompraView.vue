<template>
  <v-container fluid class="py-8 main-container-responsive" style="background: #fff; min-height: 100vh;">
    <v-card class="pa-6 main-card-responsive">
      <FacturaCompraForm
        :form="form"
        :is-editing="!!form.id"
        @submit="handleSubmit"
        @reset="resetForm"
        @open-detalle="abrirModalDetalle"
      />

      <v-row class="mb-6" justify="center">
        <v-col cols="12" sm="10" md="8" lg="6">
          <v-text-field
            v-model="search"
            label="Buscar facturas"
            dense
            clearable
            prepend-inner-icon="mdi-magnify"
            class="search-spacing"
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

      <!-- Snackbar de mensajes -->
      <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        timeout="4000"
        location="bottom center"
        rounded="pill"
      >
        {{ snackbar.message }}
      </v-snackbar>
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
const showUpdateDialog = ref(false);
const pendingUpdatePayload = ref<any>(null);

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
});

function mostrarMensaje(mensaje: string, color: string = 'success') {
  snackbar.value.show = false; // reset para forzar re-render
  snackbar.value.message = mensaje;
  snackbar.value.color = color;
  setTimeout(() => {
    snackbar.value.show = true;
  }, 10);
}

const headers = [
  { title: 'Número Factura', key: 'numeroFactura' },
  { title: 'NIT', key: 'nit' },
  { title: 'Nombre Empresa', key: 'nombreEmpresa' },
  { title: 'Dirección Empresa', key: 'direccionEmpresa' },
  { title: 'Detalles', key: 'detalles', sortable: false },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' },
];

async function cargarFacturas() {
  try {
    facturas.value = await facturaCompraService.getFacturas();
  } catch (error) {
    mostrarMensaje('Error al cargar las facturas.', 'error');
  }
}
onMounted(cargarFacturas);

async function handleSubmit(payload: any) {
  if (form.value.id) {
    pendingUpdatePayload.value = payload;
    showUpdateDialog.value = true;
  } else {
    try {
      const res = await facturaCompraService.createFactura(payload);
      form.value.id = res.id;
      await cargarFacturas();
      resetForm();
      mostrarMensaje("La factura ha sido creada exitosamente", 'success');
    } catch (e) {
      mostrarMensaje("Error al crear la factura", 'error');
    }
  }
}

const filteredFacturas = computed(() => {
  if (!search.value) return facturas.value;
  const term = search.value.toLowerCase();
  return facturas.value.filter((f: any) =>
    Object.values(f).join(" ").toLowerCase().includes(term)
  );
});

function editFactura(factura: any) {
  form.value = { ...factura };
}

function resetForm() {
  form.value = {};
}

function abrirModalDetalle(factura: any) {
  facturaSeleccionada.value = factura;
  showDetalleModal.value = true;
}

function confirmDeleteFactura(id: string | number) {
  facturaIdToDelete.value = id;
  showConfirmDialog.value = true;
}

async function deleteFacturaConfirmed() {
  if (facturaIdToDelete.value) {
    try {
      await facturaCompraService.deleteFactura(String(facturaIdToDelete.value));
      await cargarFacturas();
      facturaIdToDelete.value = null;
      mostrarMensaje("La factura ha sido eliminada exitosamente", 'success');
    } catch (e) {
      mostrarMensaje("Error al eliminar la factura", 'error');
    }
  }
}

async function confirmUpdate() {
  if (form.value.id && pendingUpdatePayload.value) {
    try {
      await facturaCompraService.updateFactura(String(form.value.id), pendingUpdatePayload.value);
      await cargarFacturas();
      resetForm();
      pendingUpdatePayload.value = null;
      mostrarMensaje("La factura ha sido editada exitosamente", 'success');
    } catch (e) {
      mostrarMensaje("Error al actualizar la factura", 'error');
    }
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
  width: 100%;
  margin: auto;
  box-sizing: border-box;
}

.search-spacing {
  margin-bottom: 16px;
}

@media (max-width: 1024px) {
  .main-container-responsive {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
  .main-card-responsive {
    padding: 24px !important;
  }
}

@media (max-width: 600px) {
  .main-card-responsive {
    padding: 16px !important;
  }
}
</style>
