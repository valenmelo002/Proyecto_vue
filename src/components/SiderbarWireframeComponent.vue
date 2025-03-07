<template>
  <aside class="sidebar">
    <div class="logo-container">
      <img src="@/assets/fuego.jpeg" alt="Logo" class="logo" />
    </div>
    <nav>
      <ul>
        <li><router-link to="/home">Inicio</router-link></li>
        <li><router-link to="/products">Productos</router-link></li>
        <li><router-link to="/categories">Categorías</router-link></li>
        <li><router-link to="/orders">Pedidos</router-link></li>
        <li><router-link to="/clients">Clientes</router-link></li>
        <li><router-link to="/contact">Contacto</router-link></li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts"></script>

<style scoped>
.sidebar {
  width: 260px;
  height: 100vh;
  background-color: #1e1e2f;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.logo {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 3px solid white;
}

nav ul {
  list-style: none;
  padding: 0;
}

nav ul li {
  margin-bottom: 15px;
}

nav ul li a {
  text-decoration: none;
  color: white;
  background: none;
  border: none;
  font-size: 16px;
  width: 100%;
  text-align: left;
  padding: 10px;
  display: block;
  cursor: pointer;
  transition: background 0.3s;
}

nav ul li a:hover {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
}
</style>
