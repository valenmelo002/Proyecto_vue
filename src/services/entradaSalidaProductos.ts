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

export async function crearRegistroOCR(registro: {
  categoria: string;
  text: string;
  uM: string;
  estado: string;
  imagen?: File;
}): Promise<any> {
  const formData = new FormData();
  formData.append('categoria', registro.categoria);
  formData.append('text', registro.text);
  formData.append('uM', registro.uM);
  formData.append('estado', registro.estado);
  
  if (registro.imagen) {
    formData.append('imagen', registro.imagen);
  }

  const response = await axios.post(
    `${API_BASE_URL}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  return response.data;
}

export async function obtenerRegistrosPesos(): Promise<any[]> {
  const response = await axios.get(`${API_BASE_URL}`);
  return response.data;
}

export async function obtenerRegistroPorId(id: number): Promise<any> {
  const response = await axios.get(`${API_BASE_URL}/${id}`);
  return response.data;
}

export async function obtenerImagenRegistro(id: number): Promise<string> {
  const response = await axios.get(`${API_BASE_URL}/${id}`, {
    responseType: 'blob'
  });
  return URL.createObjectURL(response.data);
}

export async function actualizarRegistroOCR(id: number, registro: {
  text: number;
  uM: string;
  categoria: string;
  estado: string;
  imagen?: File;
}): Promise<any> {
  const formData = new FormData();
  formData.append('text', registro.text.toString());
  formData.append('uM', registro.uM);
  formData.append('categoria', registro.categoria);
  formData.append('estado', registro.estado);
  
  if (registro.imagen) {
    formData.append('imagen', registro.imagen);
  }

  const response = await axios.put(
    `${API_BASE_URL}/${id}`,
    formData,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
}

export async function eliminarRegistroOCR(id: number): Promise<any> {
  const response = await axios.delete(`${API_BASE_URL}/${id}`);
  return response.data;
}
