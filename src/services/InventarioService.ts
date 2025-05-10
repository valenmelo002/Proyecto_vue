const API_URL = "http://localhost:3333/inventario"

export default class InventarioService {
  static async getToken() {
    // Reemplaza esto con tu sistema de almacenamiento real del token
    return localStorage.getItem("token")
  }

  static async index() {
    const token = await this.getToken()
    const response = await fetch(`${API_URL}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.json()
  }

  static async show(id: number) {
    const token = await this.getToken()
    const response = await fetch(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.json()
  }

  static async store(data: Record<string, any>) {
    const token = await this.getToken()
    const response = await fetch(`${API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    return response.json()
  }

  static async update(id: number, data: Record<string, any>) {
    const token = await this.getToken()
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    return response.json()
  }

  static async destroy(id: number) {
    const token = await this.getToken()
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.status === 204 // Devuelve true si se eliminó con éxito
  }
}