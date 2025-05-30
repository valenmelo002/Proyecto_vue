<template>
  <v-container class="py-6">
    <!-- Encabezado -->
    <v-row justify="center">
      <v-col cols="12" md="8" class="text-center">
        <h1 class="text-h4 font-weight-bold">Bienvenido a la Plataforma</h1>
        <p class="text-subtitle-1">Selecciona una opción del menú para continuar.</p>
      </v-col>
    </v-row>

    <!-- Tarjetas dinámicas 2x2 -->
    <v-row class="mt-6" justify="center" align="stretch" dense>
      <v-col cols="12" md="6" v-for="card in dashboardCards" :key="card.title">
        <v-card class="pa-6 text-center" elevation="10" rounded="xl">
          <v-icon :icon="card.icon" size="48" color="deep-purple-darken-2" class="mb-3 bounce-icon" />
          <h3 class="text-h5 font-weight-bold mb-1">{{ card.title }}</h3>

          <div v-if="card.percentage !== undefined">
            <v-progress-circular
              :model-value="card.percentage"
              size="70"
              width="7"
              color="deep-purple-accent-4"
              class="mt-2"
            >
              {{ card.percentage }}%
            </v-progress-circular>
          </div>
          <p v-else class="text-h6 font-weight-medium">{{ card.value }}</p>
        </v-card>
      </v-col>
    </v-row>

    <!-- Sección de pedidos recientes -->
    <v-row class="mt-10">
      <v-col cols="12">
        <v-card elevation="8" class="pa-4">
          <v-card-title class="text-h6 font-weight-bold d-flex align-center">
            <v-icon icon="mdi-history" class="me-2" color="deep-purple-darken-2" />
            Pedidos recientes
          </v-card-title>

          <v-data-table
            :items="pedidos"
            :headers="headers"
            class="mt-4"
            dense
            height="300"
          >
            <template #bottom>
              <v-btn variant="text" color="deep-purple-darken-2" class="mt-2">
                Ver más pedidos
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const dashboardCards = ref([
  { title: 'Ventas Hoy', value: '$850.000', icon: 'mdi-cash-register' },
  { title: 'Productos Activos', value: '124', icon: 'mdi-food' },
  { title: 'Mesas Ocupadas', percentage: 50, icon: 'mdi-table-chair' },
  { title: 'Pedidos en Proceso', value: '14', icon: 'mdi-silverware-fork-knife' },
])

let intervalId: ReturnType<typeof setInterval>

onMounted(() => {
  intervalId = setInterval(() => {
    dashboardCards.value[2].percentage = Math.floor(Math.random() * 100)
    dashboardCards.value[3].value = Math.floor(Math.random() * 20).toString()
  }, 3000)
})

onBeforeUnmount(() => {
  clearInterval(intervalId)
})

// Pedidos recientes simulados
const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Cliente', key: 'cliente' },
  { title: 'Mesa', key: 'mesa' },
  { title: 'Total', key: 'total' },
  { title: 'Hora', key: 'hora' }
]

const pedidos = [
  { id: 101, cliente: 'Ana Ruiz', mesa: 3, total: '$35.000', hora: '13:45' },
  { id: 102, cliente: 'Luis Gómez', mesa: 5, total: '$52.000', hora: '14:10' },
  { id: 103, cliente: 'Carlos M.', mesa: 1, total: '$28.000', hora: '14:30' },
  { id: 104, cliente: 'María P.', mesa: 4, total: '$47.500', hora: '15:00' }
]
</script>

<style scoped>
h1 {
  color: #5e35b1;
}

.bounce-icon {
  animation: bounce 1.5s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
}
</style>
