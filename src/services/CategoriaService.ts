const URL = 'http://localhost:3333/categoria'

export default class CategoriaService {
  static async getAll() {
    const token = localStorage.getItem('token')
    const response = await fetch(URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`,
      },
    })
    if (!response.ok) throw new Error('Error al cargar la categoria')
      return await response.json()
  }
}
