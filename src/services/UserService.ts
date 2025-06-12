export default class UserService {
  async cambiarPassword(correo: string, actual: string, nueva: string) {
    const response = await fetch('http://localhost:3333/cambiar-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ correo, actual, nueva }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al cambiar la contraseña');
    }

    return response.json();
  }
}
