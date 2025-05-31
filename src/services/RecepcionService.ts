// src/services/RecepcionService.ts
const API_URL = "http://localhost:3333/recepcion"

export default class RecepcionService {
  static async getToken() {
    return localStorage.getItem("token")
  }

  static async list() {
    const token = await this.getToken()
    const response = await fetch(`${API_URL}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    return response.json()
  }

  static async get(id: number) {
    const token = await this.getToken()
    const response = await fetch(`${API_URL}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    return response.json()
  }

  static async create(data: Record<string, any>) {
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

  static async put(id: number, data: Record<string, any>) {
    const token = await this.getToken()
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
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
    return response.status === 204
  }

  static async getPaginated({
    page = 1,
    itemsPerPage = 10,
    sortBy = [] as { key: string; order: 'asc' | 'desc'}[],
    search = {} as { folio?: string }
  }) {
    const token = localStorage.getItem("token")
    const sortKey = sortBy[0]?.key ?? 'fecha'
    const order = sortBy[0]?.order ?? 'asc'

    const params = new URLSearchParams({
      page: page.toString(),
      limit: itemsPerPage.toString(),
      sortBy: sortKey,
      order,
    })

    if (search.folio) {
      params.append('folio', search.folio)
    }

    const response = await fetch(`${API_URL}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Error al obtener las recepciones')
    }

    const result = await response.json()
    return {
      items: result.data,
      total: result.total
    }
  }
}
