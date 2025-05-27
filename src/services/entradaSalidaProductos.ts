import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/ocr';

export async function procesarImagenService(imagen: File): Promise<any> {
  const formData = new FormData();
  formData.append('image', imagen);
  const response = await axios.post(
    `${API_BASE_URL}/extract-text`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data;
}

export async function obtenerPesoService(
  id: number,
  valor: number,
  unidad: string,
  categoria: string,
  estado: string
): Promise<number> {
  const response = await axios.post(
    `${API_BASE_URL}/peso`,
    {
      text: valor.toString(),
      uM: unidad,
      categoria: categoria,
      estado: estado
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data.peso;
}

// src/services/pesoService.ts
export async function obtenerRegistrosPesos() {
  const response = await axios.get(`${API_BASE_URL}`);
  return response.data; 
}

export async function actualizarRegistroOCR(id: number, data: { text: number, uM: string, categoria: string, estado: string }) {
  const response = await axios.put(`${API_BASE_URL}/${id}`, data);
  return response.data;
}

export async function eliminarRegistroOCR(id: number) {
  await axios.delete(`${API_BASE_URL}/${id}`);
}
