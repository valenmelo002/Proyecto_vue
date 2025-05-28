import axios from 'axios'

const API_URL = 'http://localhost:3333/api/v1/facturasCompra'

export async function getFacturas() {
  const res = await axios.get(API_URL)
  return res.data
}

// Recibe un objeto con todos los campos necesarios
export async function createFactura(data: any) {
  const res = await axios.post(API_URL, data)
  return res.data
}

export async function updateFactura(id: number, data: any) {
  const res = await axios.put(`${API_URL}/${id}`, data)
  return res.data
}

export async function deleteFactura(id: number) {
  const res = await axios.delete(`${API_URL}/${id}`)
  return res.data
}