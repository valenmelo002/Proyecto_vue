<template>
  <v-container class="py-8" style="background: #fff; min-height: 100vh;">
    <v-card class="pa-6">
      <h1>Factura de Compra</h1>
      <v-btn
        class="btn-nueva"
        color="primary"
        prepend-icon="mdi-plus"
        @click="abrirFormulario"
      >
        Nueva Factura
      </v-btn>

      <v-sheet border rounded>
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
            <v-icon color="primary" icon="mdi-pencil" size="small" @click="editFactura(item)"></v-icon>
            <v-icon color="error" icon="mdi-delete" size="small" @click="deleteFactura(item.id)"></v-icon>
          </template>
          <template v-slot:no-data>
            <v-btn
              prepend-icon="mdi-backup-restore"
              rounded="lg"
              text="Recargar"
              variant="text"
              border
              @click="cargarFacturas"
            ></v-btn>
          </template>
        </v-data-table>
      </v-sheet>

      <!-- Diálogo para crear/editar factura -->
      <v-dialog v-model="showForm" max-width="600">
        <v-card>
          <v-card-title>
            {{ form.id ? 'Editar Factura' : 'Nueva Factura' }}
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="form.numeroFactura"
              :rules="[() => !!form.numeroFactura || 'El número de factura es requerido']"
              label="Número de factura"
              required
              type="number"
            ></v-text-field>
            <v-text-field
              v-model="form.nit"
              :rules="[() => !!form.nit || 'El NIT es requerido']"
              label="NIT"
              required
              type="number"
            ></v-text-field>
            <v-text-field
              v-model="form.nombreEmpresa"
              :rules="[() => !!form.nombreEmpresa || 'El nombre de la empresa es requerido']"
              label="Nombre de la empresa"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.direccionEmpresa"
              :rules="[() => !!form.direccionEmpresa || 'La dirección es requerida']"
              label="Dirección de la empresa"
              required
            ></v-text-field>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn variant="text" @click="cancelarFormulario">
              Cancelar
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" variant="text" @click="handleSubmit">
              {{ form.id ? "Actualizar" : "Crear" }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as facturaService from "@/services/facturaCompraService";

interface Detalle {
  id: number;
  proveedor: string;
  producto: string;
  cantidad: number | string;
  precio: number | string;
  subtotal: number | string;
}

interface Factura {
  id: number;
  numeroFactura: number | string;
  nit: number | string;
  nombreEmpresa: string;
  direccionEmpresa: string;
  detalles: Detalle[];
}

const facturas = ref<Factura[]>([]);
const form = ref<Partial<Factura>>({});
const showForm = ref(false);

const headers = [
  { title: 'Número Factura', key: 'numeroFactura' },
  { title: 'NIT', key: 'nit' },
  { title: 'Nombre Empresa', key: 'nombreEmpresa' },
  { title: 'Dirección Empresa', key: 'direccionEmpresa' },
  { title: 'Detalles', key: 'detalles', sortable: false },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' as const },
];

async function cargarFacturas() {
  facturas.value = await facturaService.getFacturas();
}

onMounted(cargarFacturas);

async function handleSubmit() {
  const payload = {
    numeroFactura: form.value.numeroFactura,
    nit: form.value.nit,
    nombreEmpresa: form.value.nombreEmpresa,
    direccionEmpresa: form.value.direccionEmpresa,
    detalles: form.value.detalles ?? [],
  };

  if (form.value.id) {
    await facturaService.updateFactura(String(form.value.id), payload);
  } else {
    await facturaService.createFactura(payload);
  }
  await cargarFacturas();
  resetForm();
  showForm.value = false;
}

function editFactura(factura: Factura) {
  form.value = { ...factura };
  showForm.value = true;
}

async function deleteFactura(id: number) {
  await facturaService.deleteFactura(String(id));
  await cargarFacturas();
}

function resetForm() {
  form.value = {};
}

function abrirFormulario() {
  resetForm();
  showForm.value = true;
}

function cancelarFormulario() {
  resetForm();
  showForm.value = false;
}
</script>

<style scoped>
.btn-nueva {
  margin-bottom: 1rem;
  background: #1a4fa3;
  color: #fff;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-left: 1%;
  margin-top: 1%;
}
.btn-nueva:hover {
  background: #163d7a;
}
</style>