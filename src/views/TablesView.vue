<template>
  <v-container fluid>
    <!-- Panel de Mesas -->
    <v-card class="pa-4 mb-4" color="#f5f5f5">
      <h4 class="text-subtitle-1 font-weight-bold mb-3">Panel de Mesas</h4>
      <v-row>
        <v-col v-for="mesa in mesas" :key="mesa.id" cols="auto">
          <v-card :color="mesa.estado === 'Asignada' ? 'indigo-lighten-5' : 'green-lighten-5'" class="pa-2" width="160">
            <div class="font-weight-medium">Mesa {{ mesa.numero }}</div>
            <div class="text-caption">Pedido {{ mesa.pedido }}</div>
            <div class="text-caption">Demora: {{ mesa.demora }}</div>
            <v-btn class="mt-2" :color="mesa.estado === 'Asignada' ? 'indigo' : 'green'" size="small">
              {{ mesa.estado === 'Asignada' ? 'Asignada' : 'Asignar' }}
            </v-btn>
          </v-card>
        </v-col>
        <!-- Botones -->
        <v-col cols="auto" class="d-flex align-center">
          <v-btn icon color="primary"><v-icon>mdi-plus</v-icon></v-btn>
          <v-btn class="mx-1" color="blue-darken-2">crear mesa</v-btn>
          <v-btn color="orange-darken-2">modificar mesa</v-btn>
          <v-btn color="red-darken-2" class="ml-1">eliminar mesa</v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- Sección Tomar Pedido y Resumen -->
    <v-row>
      <!-- Categorías -->
      <v-col cols="2">
        <v-card class="pa-2">
          <v-list dense>
            <v-list-item v-for="(cat, i) in categorias" :key="i">
              <v-btn block color="blue-darken-2" class="my-1" dark>{{ cat }}</v-btn>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Platos -->
      <v-col cols="6">
        <v-card class="pa-2">
          <v-row>
            <v-col v-for="plato in platos" :key="plato.id" cols="12">
              <v-card class="pa-2 mb-2">
                <v-row>
                  <v-col cols="3">
                    <v-img :src="plato.imagen" height="130" cover></v-img>
                  </v-col>
                  <v-col cols="6">
                    <div class="font-weight-bold">{{ plato.nombre }}</div>
                    <div class="text-caption">{{ plato.descripcion }}</div>
                  </v-col>
                  <v-col cols="3" class="d-flex align-end flex-column">
                    <div class="d-flex mb-1">
                      <v-chip color="green" label small>{{ plato.etiqueta }}</v-chip>
                    </div>
                    <v-btn icon><v-icon>mdi-minus</v-icon></v-btn>
                    <v-btn icon><v-icon>mdi-plus</v-icon></v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <!-- Resumen -->
      <v-col cols="4">
        <v-card class="pa-3">
          <h4 class="text-subtitle-1 font-weight-bold">Resumen del Pedido</h4>
          <div class="mb-2 text-caption">pedido 001 - mesa 2</div>
          <ul>
            <li v-for="(item, index) in resumen.items" :key="index">
              {{ item.nombre }} x {{ item.cantidad }} - Total: ${{ item.total.toLocaleString() }}
            </li>
          </ul>
          <div class="text-caption mt-2">Nota: {{ resumen.nota }}</div>
          <v-divider class="my-2"></v-divider>
          <v-btn color="blue-darken-2" dark class="mb-1">agregar al pedido</v-btn>
          <v-btn color="orange-darken-2" dark class="mb-1">modificar pedido</v-btn>
          <v-btn color="red-darken-2" dark>eliminar pedido</v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Botón enviar a cocina -->
  <v-card class="pa-4 my-4 d-flex justify-center">
    <v-btn color="green-darken-3" size="small">Enviar pedido a cocina</v-btn>
  </v-card>

    <!-- Historial de pedidos -->
    <v-card class="pa-4">
      <h4 class="text-subtitle-1 font-weight-bold mb-2">Historico de pedidos</h4>
      <v-data-table :headers="tablaHeaders" :items="historial" items-per-page="5" class="elevation-1">
        <template #item.estado="{ item }">
          <v-chip :color="estadoColor(item.estado)" dark>{{ item.estado }}</v-chip>
        </template>
        <template #bottom>
          <v-btn-toggle class="mt-4" multiple>
            <v-btn color="blue">todos</v-btn>
            <v-btn color="green">entregados</v-btn>
            <v-btn color="amber">en proceso</v-btn>
            <v-btn color="red">cancelados</v-btn>
          </v-btn-toggle>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const mesas = ref([
  { id: 1, numero: 1, pedido: '001', demora: '15:00 min', estado: 'Libre' },
  { id: 2, numero: 2, pedido: '001', demora: '02:34 min', estado: 'Asignada' },
  { id: 3, numero: 3, pedido: '001', demora: '12:50 min', estado: 'Asignada' },
  { id: 4, numero: 4, pedido: '001', demora: '15:00 min', estado: 'Asignada' },
  { id: 5, numero: 5, pedido: '001', demora: '00:00 min', estado: 'Asignada' },
])

const categorias = ['Entrada', 'platos a la carta', 'bebidas', 'postres', 'cumpleaños']

const platos = ref([
  {
    id: 1,
  nombre: 'Carne a la parrilla',
    descripcion: 'Una sinfonía de carnes a la parrilla, cuidadosamente seleccionadas y asadas al fuego vivo. Jugosos cortes de res, costillas tiernas, salchichas artesanales y brochetas con vegetales frescos se fusionan en una danza de aromas ahumados y sabores intensos. Todo acompañado de champiñones, chiles y tomates que realzan cada mordida con toques terrosos y picantes.',
    etiqueta: '🍖',
    imagen: '/src/assets/img/parrilla.jpg',
  },
  {
    id: 2,
    nombre: 'Chuletones De Cerdo',
    descripcion: 'Una jugosa costilla de cerdo, marcada a la perfección con intensas líneas de la parrilla que sellan su sabor ahumado y suculento. Servida sobre un lecho de pimientos tricolores y cebolla caramelizada, salteados al punto para conservar su frescura y dulzura natural',
    etiqueta: '🥩',
    imagen: '/src/assets/img/chuletas.jpg',
  },
  {
    id: 3,
    nombre: 'Picada Mixta',
    descripcion: 'Una deliciosa combinación de carnes, quesos y embutidos, acompañada de aceitunas y pan artesanal. Perfecta para compartir con amigos o disfrutar en una reunión especial.',
    etiqueta: '🍽️',
    imagen: '/src/assets/img/picada.jpg',
  },
])

const resumen = ref({
  items: [
    { nombre: 'Picada Mixta', cantidad: 3, total: 56590 },
    { nombre: 'Coca-cola 2 litros', cantidad: 2, total: 11000 },
  ],
  nota: 'Sin cebolla, sin tomate',
})

const tablaHeaders = [
  { text: 'Pedido ID', value: 'pedido' },
  { text: 'Mesa', value: 'mesa' },
  { text: 'Ítems', value: 'items' },
  { text: 'Precio', value: 'precio' },
  { text: 'Estado', value: 'estado' },
  { text: 'Hora', value: 'hora' },
  { text: 'Demora', value: 'demora' },
]

const historial = ref([
  { pedido: '001', mesa: 1, items: 'coca-cola 2 litros x4', precio: 20000, estado: 'pagado', hora: '00:00', demora: '00:00' },
  { pedido: '001', mesa: 2, items: 'Picada Mixta x3', precio: 266000, estado: 'en proceso', hora: '00:00', demora: '00:00' },
])

const estadoColor = (estado) => {
  switch (estado) {
    case 'pagado':
      return 'green'
    case 'en proceso':
      return 'orange'
    case 'cancelado':
      return 'red'
    default:
      return 'grey'
  }
}
</script>
