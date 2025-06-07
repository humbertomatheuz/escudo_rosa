import api from './api'; // Importe o arquivo de configuração da API

export type Informacoes = {
  id?: number;
  title: string;
  descricao: string;
  local?: string;
  created_at: number; // Timestamp em milissegundos
};

// Não é mais necessário inicializar banco de dados SQLite aqui
// export function initDb() { /* Remova ou comente */ }

export async function listarInformacoes(): Promise<Informacoes[]> {
  try {
    const response = await api.get('/informacoes');
    return response.data;
  } catch (error) {
    console.error('Erro ao listar informações:', error);
    throw error;
  }
}

export async function addInformacao(data: Informacoes): Promise<boolean> {
  try {
    const { title, descricao, local } = data;
    const response = await api.post('/informacoes', { title, descricao, local });
    return response.status === 201;
  } catch (error: any) {
    console.error('Erro ao adicionar informação:', error.response?.data || error.message);
    throw error;
  }
}