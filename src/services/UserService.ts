const URL = 'http://localhost:3333/user_roles'

export default class UserService {
  static async getAll({ page = 1, limit = 10, nombre = '' }) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${URL}?page=${page}&limit=${limit}&nombre=${nombre}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) throw new Error('Error al cargar los usuarios')
    return await response.json()
  }

  static async getById(id: number) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${URL}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) throw new Error('Error al cargar el usuario')
    return await response.json()
  }

 static async create(data: any) {
  const token = localStorage.getItem('token')
  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  const json = await response.json()

  if (!response.ok) {
    console.error('❌ Error del backend:', json) // <--- Esto nos mostrará el detalle
    throw new Error('Error al crear el usuario')
  }

  return json
}

  static async update(id: number, data: any) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) throw new Error('Error al actualizar el usuario')
    return await response.json()
  }

  static async delete(id: number) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('❌ Error del backend al eliminar:', error)
      throw new Error('Error al eliminar el usuario')
    }
  }
}
