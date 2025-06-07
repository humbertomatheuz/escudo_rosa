import api from './api'; // Importe o arquivo de configuração da API

export type Contatos = {
  id?: number;
  title: string;
  descricao: string;
  local?: string;
  created_at: number;
};

// Não é mais necessário inicializar banco de dados SQLite aqui
// export function initDb() { /* Remova ou comente */ }

export async function listarContatos(): Promise<Contatos[]> {
  try {
    const response = await api.get('/contatos');
    return response.data;
  } catch (error) {
    console.error('Erro ao listar contatos:', error);
    throw error;
  }
}

export async function addContato(data: Contatos): Promise<boolean> {
  try {
    // A API gerará o ID e o created_at
    const { title, descricao, local } = data;
    const response = await api.post('/contatos', { title, descricao, local });
    return response.status === 201; // Retorna true se a criação foi bem-sucedida (status 201 Created)
  } catch (error: any) {
    console.error('Erro ao adicionar contato:', error.response?.data || error.message);
    throw error;
  }
}

// Se precisar de atualização ou exclusão de contatos:
export async function updateContato(id: number, data: Partial<Contatos>): Promise<boolean> {
    try {
        const response = await api.put(`/contatos/${id}`, data);
        return response.status === 200;
    } catch (error: any) {
        console.error('Erro ao atualizar contato:', error.response?.data || error.message);
        throw error;
    }
}

export async function deleteContato(id: number): Promise<boolean> {
    try {
        const response = await api.delete(`/contatos/${id}`);
        return response.status === 204;
    } catch (error: any) {
        console.error('Erro ao deletar contato:', error.response?.data || error.message);
        throw error;
    }
}