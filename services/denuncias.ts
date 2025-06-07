import api from './api'; // Importe o arquivo de configuração da API

export type Denuncia = {
  id?: number;
  nome?: string;
  identificar: boolean; // boolean
  motivo: string;
  descricao: string;
  agressor?: string;
  createdAt: string; // string (ISO Date ou similar)
};

// Não é mais necessário inicializar banco de dados SQLite aqui
// export function initDenunciaDb(): void { /* Remova ou comente */ }

export async function salvarDenuncia(data: Denuncia): Promise<boolean> {
  try {
    // Adapte o payload para o que a API Python espera
    const payload = {
      ...data,
      identificar: data.identificar ? 1 : 0, // A API Python espera 1 ou 0 para booleano
    };
    const response = await api.post('/denuncias', payload);
    return response.status === 201;
  } catch (error: any) {
    console.error('Erro ao salvar denúncia:', error.response?.data || error.message);
    throw error;
  }
}

export async function listarDenuncias(): Promise<Denuncia[]> {
  try {
    const response = await api.get('/denuncias');
    // Mapeie 'identificar' de volta para booleano, se necessário para seu frontend
    return response.data.map((d: any) => ({
      ...d,
      identificar: Boolean(d.identificar),
    }));
  } catch (error) {
    console.error('Erro ao listar denúncias:', error);
    throw error;
  }
}