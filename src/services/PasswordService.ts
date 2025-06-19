export default class PasswordService {
  async cambiarPassword(correo: string, actual: string, nueva: string) {
    const response = await fetch('http://147.93.114.138:8091/cambiar-password', {
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
