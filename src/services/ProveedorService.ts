const API_URL = 'http://localhost:3333/proveedores'

export default class ProveedoresService {
  static async getToken() {
    return localStorage.getItem('token')
  }

  static async list() {
    const token = await this.getToken()
    const response = await fetch(API_URL, {
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
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    return response.json()
  }

  static async update(id: number, data: Record<string, any>) {
    const token = await this.getToken()
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    return response.json()
  }

  static async destroy(id: number) {
    const token = await this.getToken()
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.status === 204
  }

  static async getPaginated({
    page = 1,
    itemsPerPage = 10,
    sortBy = [] as { key: string; order: 'asc' | 'desc' }[],
    search = {} as { nombre?: string }
  }) {
    const token = await this.getToken()
    const sortKey = sortBy[0]?.key ?? 'nombre'
    const order = sortBy[0]?.order ?? 'asc'

    const params = new URLSearchParams({
      page: page.toString(),
      limit: itemsPerPage.toString(),
      sortBy: sortKey,
      order,
    })

    if (search.nombre) {
      params.append('nombre', search.nombre)
    }

    const response = await fetch(`${API_URL}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Error al obtener los proveedores')
    }

    const result = await response.json()
    return {
      items: result.data,
      total: result.total,
    }
  }
}
