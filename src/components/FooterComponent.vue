<template>
  <footer>
    <div class="links">
      <a href="#">Términos</a>
      <a href="#">Privacidad</a>
      <a href="#">Contacto con soporte</a>
      <a href="#">Manage cookies</a>
    </div>
  </footer>
</template>

<style scoped>
footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.1);
  margin-top: 40px;
  position: static; /* por defecto fluido */
}

.links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px 20px;
  text-align: center;
}

.links a {
  font-size: 14px;
  color: #333;
  text-decoration: none;
  font-weight: bold;
}

.links a:hover {
  color: #000;
}

/* ✅ Solo en pantallas grandes, vuelve a ser fijo */
@media (min-width: 768px) {
  footer {
    position: fixed;
    bottom: 0;
    left: 0;
    margin-top: 0;
  }
}
</style>
