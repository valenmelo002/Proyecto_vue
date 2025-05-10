<template>
    <div class="container">
      <h1>Inventario</h1>
  
      <div v-if="loading">Cargando inventario...</div>
      <div v-else>
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Min. Stock</th>
              <th>Unidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in inventario" :key="item.id">
              <td>{{ item.codigo }}</td>
              <td>{{ item.nombre_producto }}</td>
              <td>{{ item.categoria }}</td>
              <td>{{ item.stock }}</td>
              <td>{{ item.min_stock }}</td>
              <td>{{ item.unidad_medida }}</td>
              <td>
                <button @click="eliminarItem(item.id)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import InventarioService from '@/services/InventarioService'
  
  const inventario = ref<any[]>([])
  const loading = ref(true)
  
  const cargarInventario = async () => {
    loading.value = true
    try {
      inventario.value = await InventarioService.index()
    } catch (error) {
      console.error("Error cargando inventario:", error)
      alert("Hubo un error al cargar el inventario.")
    } finally {
      loading.value = false
    }
  }
  
  const eliminarItem = async (id: number) => {
    const confirmado = confirm("¿Estás seguro de eliminar este ítem?")
    if (!confirmado) return
  
    const exito = await InventarioService.destroy(id)
    if (exito) {
      inventario.value = inventario.value.filter(item => item.id !== id)
      alert("Elemento eliminado.")
    } else {
      alert("Error al eliminar el elemento.")
    }
  }
  
  onMounted(() => {
    cargarInventario()
  })
  </script>
  
  <style scoped>
  .container {
    padding: 1rem;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  thead {
    background-color: #f0f0f0;
  }
  
  td, th {
    padding: 0.5rem;
    border: 1px solid #ccc;
  }
  
  button {
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 0.4rem 0.6rem;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #c0392b;
  }
  </style>