<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <img alt="fuego" class="logo" src="@/assets/fuego.jpeg" width="300px" height="190px" />
  </header>
  <div class="wrapper">
    <nav>
      <RouterLink to="/login">Login</RouterLink>
      <RouterLink to="/register">Register</RouterLink>
      <RouterLink to="/restore">Restore</RouterLink>
    </nav>
  </div>
  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  display: flex;

  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 14px;
  text-align: center;
  margin-top: 2rem;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  text-decoration: none;
  color: #333;
  font-weight: bold;
}

nav a:hover {
  color: #42b983;
}
</style>
