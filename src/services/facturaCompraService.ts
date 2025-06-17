import axios from 'axios'

const API_URL = 'http://localhost:3333/api/v1/facturasCompra'

// Interceptor para agregar el token a cada petición
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Servicios para facturas de compra
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
  console.log('Enviando DELETE a:', `${API_URL}/${id}`);
  const res = await axios.delete(`${API_URL}/${id}`)
  return res.data
}

// Servicios para detalles de factura de compra
const DETALLES_URL = `${API_URL}/detalles`

export async function getDetalles() {
  const res = await axios.get(DETALLES_URL)
  return res.data
}

export async function getDetalle(id: string) {
  const res = await axios.get(`${DETALLES_URL}/${id}`)
  return res.data
}

export async function createDetalle(data: Record<string, any>) {
  const res = await axios.post(DETALLES_URL, data)
  return res.data
}

export async function updateDetalle(id: string, data: Record<string, any>) {
  const res = await axios.put(`${DETALLES_URL}/${id}`, data)
  return res.data
}

export async function deleteDetalle(id: string) {
  const res = await axios.delete(`${DETALLES_URL}/${id}`)
  return res.data
}
