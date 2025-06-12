<template>
  <v-container>
    <v-card class="pa-4" color="#d3d3d3">
      <h3 class="text-h6 font-weight-bold mb-4">Vista del Cajero</h3>

      <!-- Pedidos Pendientes -->
      <v-card class="mb-4 pa-4">
        <h4 class="text-subtitle-1 font-weight-bold mb-2">Pedidos Pendientes de Pago</h4>
        <div v-for="(order, index) in pendingPayments" :key="index" class="d-flex justify-space-between align-center mb-2">
          <div>
            <div class="font-weight-medium">{{ order.zone }}</div>
            <div>Mesa {{ order.table }}</div>
          </div>
          <div class="d-flex align-center">
            <div class="mr-4 font-weight-bold text-success">$
              {{ order.amount.toLocaleString() }}
            </div>
            <v-btn color="indigo-darken-4" dark>Registrador de pagos</v-btn>
          </div>
        </div>
      </v-card>

      <!-- Registrador Pago -->
      <v-card class="mb-4 pa-4">
        <h4 class="text-subtitle-1 font-weight-bold mb-2">Registrador Pago</h4>
        <div class="d-flex justify-space-between">
          <div>
            <div class="mb-1">Detalles del</div>
            <div class="font-italic">Selección: SOLO EFECTIVO</div>
          </div>
          <div class="font-weight-bold">Monto total: ${{ totalToPay.toLocaleString() }}</div>
        </div>
        <v-btn class="mt-3" color="indigo-darken-4" dark>
          Confirmar y generar recibo
        </v-btn>
      </v-card>

      <!-- Historial de Pagos -->
      <v-card class="pa-4">
        <h4 class="text-subtitle-1 font-weight-bold mb-2">Historial de Pagos</h4>
        <v-table dense>
          <thead>
            <tr>
              <th>Mesa</th>
              <th>Monto</th>
              <th>Hora</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(entry, index) in paymentHistory" :key="index">
              <td>{{ entry.table }}</td>
              <td>${{ entry.amount.toLocaleString() }}</td>
              <td>{{ entry.time }}</td>
              <td>{{ entry.date }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const pendingPayments = ref([
  { zone: 'Colina baja', table: 7, amount: 45000 },
  { zone: 'Colina baja', table: 4, amount: 30000 },
])

const totalToPay = ref(75000)

const paymentHistory = ref([
  { table: 1, amount: 60000, time: '12:00', date: '2023-10-12' },
  { table: 8, amount: 30000, time: '14:45', date: '2023-10-11' },
])
</script>

<style scoped>
.font-italic {
  font-style: italic;
}
</style>
