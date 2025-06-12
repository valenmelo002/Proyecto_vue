<template>
  <v-navigation-drawer expand-on-hover rail app color="deep-purple">
    <v-list>
      <v-list-item
        :prepend-avatar="userData?.avatar"
        :subtitle="userData?.email"
        :title="userData?.nombre"
      />
    </v-list>

    <!-- Menú lateral -->
    <v-list-item prepend-icon="mdi-account-circle" title="Perfil" to="/perfil" link />
    <v-divider />
    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-home" title="Dashboard" to="/dashboard" link />
      <v-list-item prepend-icon="mdi-clipboard-list" title="Inventario" to="/inventario" link />
      <v-list-item prepend-icon="mdi-cube-outline" title="Productos" to="/producto" link />
      <v-list-item prepend-icon="mdi-view-list" title="Historial" to="/historial-inventario" link />
      <v-list-item prepend-icon="mdi-truck" title="Recepción" to="/recepcion" link />
      <v-list-item prepend-icon="mdi-account-group" title="Proveedores" to="/proveedores" link />
      <v-list-item prepend-icon="mdi-box" title="zona-pesaje" to="/zona-pesaje" link />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { inject } from 'vue'

const userData = inject('userData')
</script>
