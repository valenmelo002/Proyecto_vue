const URL = 'http://147.93.114.138:8091/tipo_documentos'

export default class TipoDocumentoService {
  static async getAll() {
    const token = localStorage.getItem('token')
    const response = await fetch(URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) throw new Error('Error al cargar los tipos de documento')

    return await response.json()
  }
}