<template>
  <v-navigation-drawer
    expand-on-hover
    rail
    app
    color="deep-purple"
  >
    <v-list>
      <v-list-item
        prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
        subtitle="sandra_a88@gmailcom"
        title="Sandra Adams"
      ></v-list-item>
    </v-list>
    <v-list-item
      prepend-icon="mdi-account-circle"
      title="Perfil"
      to="/perfil"
      link
    />

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item
        prepend-icon="mdi-home"
        title="Dashboard"
        to="/dashboard"
        exact
        link
      />
      <v-list-item
        prepend-icon="mdi-clipboard-list"
        title="Inventario"
        to="/inventario"
        exact
        link
      />
      <v-list-item
        prepend-icon="mdi-cube-outline"
        title="Productos"
        to="/producto"
        link
      />
      <v-list-item
        prepend-icon="mdi-view-list"
        title="Historial"
        to="/historial"
        link
      />
      <v-list-item
        prepend-icon="mdi-truck"
        title="Pedidos"
        to="/pedidos"
        link
      />
      <v-list-item
        prepend-icon="mdi-account-group"
        title="Proveedores"
        to="/proveedores"
        link
      />
      <v-list-item
        prepend-icon="mdi-file-document-outline"
        title="Factura Compra"
        to="/facturaCompra"
        link
      />
      <v-list-item
        prepend-icon="mdi-phone"
        title="Contacto"
        to="/contacto"
        link
      />
  
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts"></script>
