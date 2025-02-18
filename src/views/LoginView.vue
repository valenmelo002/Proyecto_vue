<template>
  <div class="container">
    <div class="form-container">
      <h1>Ingresar</h1>
      <form>
        <input type="text" placeholder="Nombre" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Contraseña" />
        <button type="button">Iniciar sesion</button>

        <p><Router-link to="/Restore">¿Has olvidado tu contraseña?</Router-link></p>
        <p><Router-link to="/Register">Regístrate ahora</Router-link></p>
      </form>
    </div>
  </div>
</template>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-container {
  width: 400px;
  padding: 40px;
  background: #fafafa;
  border-radius: 10px;
}

h1 {
  text-align: center;
  color: black;
  margin-bottom: 10px;
}

form {
  display: flex;
  flex-direction: column;
}

input {
  background-color: #fafafa;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid black;
  border-radius: 4px;
  font-size: 12px;
}

button {
  background: #bb71e8;
  color: white;
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
}

p {
  text-align: center;
  font-size: 14px;
  margin-top: 20px;
}
</style>
