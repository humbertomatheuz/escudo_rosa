import api from './api';

export type Eventos = {
  id?: number;
  title: string;
  descricao: string;
  local?: string;
  data?: string;
  created_at: number; 
};

export async function listarEventos(): Promise<Eventos[]> {
  try {
    const response = await api.get('/eventos');
    return response.data;
  } catch (error) {
    console.error('Erro ao listar eventos:', error);
    throw error;
  }
}

export async function addEvento(data: Eventos): Promise<boolean> {
  try {
    const { title, descricao, local } = data;
    const response = await api.post('/eventos', { title, descricao, local });
    return response.status === 201;
  } catch (error: any) {
    console.error('Erro ao adicionar evento:', error.response?.data || error.message);
    throw error;
  }
}