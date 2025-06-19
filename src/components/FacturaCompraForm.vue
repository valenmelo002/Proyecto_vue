<template>
  <v-form ref="formRef" @submit.prevent="submit">
    <v-row dense>
      <v-col cols="12" md="6">
        <v-text-field
          label="Número Factura"
          v-model="form.numeroFactura"
          :rules="[rules.required, rules.integer]"
          type="number"
          clearable
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          label="NIT"
          v-model="form.nit"
          :rules="[rules.required, rules.integer]"
          type="number"
          clearable
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          label="Nombre Empresa"
          v-model="form.nombreEmpresa"
          :rules="[rules.required, rules.nombreEmpresa]"
          clearable
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          label="Dirección Empresa"
          v-model="form.direccionEmpresa"
          :rules="[rules.required, rules.direccionEmpresa]"
          clearable
        />
      </v-col>

      <!-- Botones con separación hacia abajo -->
      <v-col cols="12" class="d-flex justify-center mb-10">
        <v-btn
          type="submit"
          color="primary"
          class="me-4 px-6 py-2"
        >
          {{ isEditing ? 'Actualizar' : 'Guardar' }}
        </v-btn>

        <v-btn
          type="button"
          class="ms-4 px-6 py-2"
          @click="$emit('reset')"
        >
          Cancelar
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  form: any
  isEditing: boolean
}>()

const emit = defineEmits(['submit', 'reset'])

const formRef = ref()

const rules = {
  required: (v: any) => !!v || 'Este campo es obligatorio',
  integer: (v: any) =>
    Number.isInteger(Number(v)) && Number(v) > 0 || 'Debe ser un número entero positivo',
  nombreEmpresa: (v: string) =>
    (v && v.trim().length >= 3 && v.trim().length <= 255) || 'Debe tener entre 3 y 255 caracteres',
  direccionEmpresa: (v: string) =>
    (v && v.trim().length >= 3 && v.trim().length <= 255) || 'Debe tener entre 3 y 255 caracteres',
}

function submit() {
  formRef.value?.validate().then((valid: boolean) => {
    if (valid) {
      emit('submit', props.form)
    }
  })
}
</script>
