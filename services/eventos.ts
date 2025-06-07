import api from './api'; // Importe o arquivo de configuração da API

export type Eventos = {
  id?: number;
  title: string;
  descricao: string;
  local?: string;
  created_at: number; // Timestamp em milissegundos
};

// Não é mais necessário inicializar banco de dados SQLite aqui
// export function initDb() { /* Remova ou comente */ }

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