import axios from 'axios'

const API_URL = 'http://localhost:3333/api/v1/facturasCompra'

// Interceptor para agregar el token a cada petición
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token') // O donde guardes el token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Recibe un objeto con todos los campos necesarios
export async function getFacturas() {
  const res = await axios.get(API_URL)
  return res.data
}

export async function createFactura(data: Record<string, any>) {
  const res = await axios.post(API_URL, data)
  return res.data
}

export async function updateFactura(id: string, data: Record<string, any>) {
  const res = await axios.put(`${API_URL}/${id}`, data)
  return res.data
}

export async function deleteFactura(id: string) {
  const res = await axios.delete(`${API_URL}/${id}`)
  return res.data
}