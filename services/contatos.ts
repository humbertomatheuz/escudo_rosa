import api from './api';

export type Contatos = {
  id?: number;
  title: string;
  descricao: string;
  local?: string;
  telefone?: string;
  email?: string;
  created_at: number;
};

export async function listarContatos(): Promise<Contatos[]> {
  try {
    const response = await api.get('/contatos');
    return response.data;
  } catch (error) {
    console.error('Erro ao listar contatos:', error);
    throw error;
  }
}

// export async function addContato(data: Contatos): Promise<boolean> {
//   try {
//     const { title, descricao, local } = data;
//     const response = await api.post('/contatos', { title, descricao, local });
//     return response.status === 201;
//   } catch (error: any) {
//     console.error('Erro ao adicionar contato:', error.response?.data || error.message);
//     throw error;
//   }
// }

// export async function updateContato(id: number, data: Partial<Contatos>): Promise<boolean> {
//     try {
//         const response = await api.put(`/contatos/${id}`, data);
//         return response.status === 200;
//     } catch (error: any) {
//         console.error('Erro ao atualizar contato:', error.response?.data || error.message);
//         throw error;
//     }
// }

// export async function deleteContato(id: number): Promise<boolean> {
//     try {
//         const response = await api.delete(`/contatos/${id}`);
//         return response.status === 204;
//     } catch (error: any) {
//         console.error('Erro ao deletar contato:', error.response?.data || error.message);
//         throw error;
//     }
// }