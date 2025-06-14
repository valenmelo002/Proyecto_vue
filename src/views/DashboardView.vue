<template>
  <v-container class="py-6">
    <!-- Título -->
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" class="text-center">
        <h1 class="text-h5 text-md-h4 font-weight-bold">Bienvenido a la Plataforma</h1>
        <p class="text-subtitle-2">Selecciona una opción del menú para continuar.</p>
      </v-col>
    </v-row>

    <!-- Dashboard cards -->
    <v-row class="mt-6 g-4" justify="center" align="stretch">
      <v-col
        v-for="card in dashboardCards"
        :key="card.title"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card
          class="dashboard-card pa-4 d-flex flex-column align-center justify-center text-center"
          elevation="10"
          rounded="xl"
        >
          <v-icon :icon="card.icon" size="36" color="#2e2e2e" class="mb-3 bounce-icon" />
          <h3 class="text-subtitle-1 font-weight-bold mb-1">{{ card.title }}</h3>

          <div class="mt-2">
            <v-progress-circular
              v-if="card.percentage !== undefined"
              :model-value="card.percentage"
              size="60"
              width="5"
              color="#2e2e2e"
            >
              {{ card.percentage }}%
            </v-progress-circular>
            <p v-else class="text-subtitle-2 font-weight-medium mt-2">{{ card.value }}</p>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Pedidos recientes como tabla (solo en md y mayores) -->
    <v-row class="mt-10 d-none d-md-flex">
      <v-col cols="12">
        <v-card elevation="8" class="pa-4">
          <v-card-title class="text-h6 font-weight-bold d-flex align-center">
            <v-icon icon="mdi-history" class="me-2" color="#2e2e2e" />
            Pedidos recientes
          </v-card-title>

          <div class="overflow-auto">
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
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Pedidos recientes como cards (solo en sm y menores) -->
    <v-row class="mt-10 d-flex d-md-none ga-4">
      <v-col
        v-for="pedido in pedidos"
        :key="pedido.id"
        cols="12"
      >
        <v-card elevation="6" rounded="xl" class="pa-4">
          <div class="d-flex align-center mb-2">
            <v-icon icon="mdi-receipt-text-outline" class="me-2" />
            <h3 class="text-subtitle-1 font-weight-bold">Pedido #{{ pedido.id }}</h3>
          </div>
          <div class="text-subtitle-2">
            <div><strong>Cliente:</strong> {{ pedido.cliente }}</div>
            <div><strong>Mesa:</strong> {{ pedido.mesa }}</div>
            <div><strong>Mesero:</strong> {{ pedido.mesero }}</div>
            <div><strong>Total:</strong> {{ pedido.total }}</div>
            <div><strong>Hora:</strong> {{ pedido.hora }}</div>
          </div>
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

let intervalDashboard: ReturnType<typeof setInterval>

onMounted(() => {
  intervalDashboard = setInterval(() => {
    dashboardCards.value[2].percentage = Math.floor(Math.random() * 100)
    dashboardCards.value[3].value = Math.floor(Math.random() * 20).toString()
  }, 10000)
})

onBeforeUnmount(() => {
  clearInterval(intervalDashboard)
})

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Cliente', key: 'cliente' },
  { title: 'Mesa', key: 'mesa' },
  { title: 'Mesero', key: 'mesero' },
  { title: 'Total', key: 'total' },
  { title: 'Hora', key: 'hora' }
]

const pedidos = [
  { id: 101, cliente: 'Ana Ruiz', mesa: 3, mesero: 'Laura', total: '$35.000', hora: '13:45' },
  { id: 102, cliente: 'Luis Gómez', mesa: 5, mesero: 'Carlos', total: '$52.000', hora: '14:10' },
  { id: 103, cliente: 'Carlos M.', mesa: 1, mesero: 'Pedro', total: '$28.000', hora: '14:30' },
  { id: 104, cliente: 'María P.', mesa: 4, mesero: 'Lucía', total: '$47.500', hora: '15:00' }
]
</script>

<style scoped>
h1 {
  color: #2e2e2e;
}

.dashboard-card {
  min-height: 220px;
  transition: transform 0.3s ease;
}
.dashboard-card:hover {
  transform: scale(1.02);
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

@media (max-width: 600px) {
  .dashboard-card {
    min-height: 180px;
  }

  .text-h4 {
    font-size: 1.5rem;
  }

  .text-subtitle-1 {
    font-size: 1rem;
  }
}
</style>
