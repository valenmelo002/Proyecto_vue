<template>
  <div>
    <v-btn icon size="small" color="error" @click="openDialog">
      <v-icon size="small">mdi-delete</v-icon>
    </v-btn>

    <ConfirmDialog
      v-model="showDialog"
      title="¿Eliminar producto?"
      :message="`¿Estás seguro de que deseas eliminar el producto?`"
      @confirm="confirmDelete"
      @cancel="showDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ConfirmDialog from '@/components/ModalComponent.vue'
import InventarioService from '@/services/InventarioService'

const props = defineProps<{
  item: {
    id: number
    nombre_producto: string
  }
}>()

const emit = defineEmits<{
  (e: 'deleted'): void
}>()

const showDialog = ref(false)

function openDialog() {
  showDialog.value = true
}

async function confirmDelete() {
  try {
    await InventarioService.destroy(props.item.id)
    emit('deleted')
  } catch (error) {
    console.error('Error al eliminar producto:', error)
  } finally {
    showDialog.value = false
  }
}
</script>
