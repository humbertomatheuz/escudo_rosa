import api from './api'; // Importe o arquivo de configuração da API

export type User = {
  username: string;
  password: string;
  name: string;
  avatarColor: string;
};

// Não é mais necessário inicializar banco de dados SQLite aqui
// export function initDb() { /* Remova ou comente */ }

export async function registerUser(user: User): Promise<User | null> {
  try {
    const response = await api.post('/register', user);
    // A API retorna o usuário criado (sem a senha)
    return response.data;
  } catch (error: any) {
    console.error('Erro ao registrar usuário:', error.response?.data || error.message);
    // Lança o erro para que o frontend possa lidar com ele
    throw error;
  }
}

export async function loginUser(username: string, password: string): Promise<User | null> {
  try {
    const response = await api.post('/login', { username, password });
    // A API retorna o usuário logado (sem a senha)
    return response.data;
  } catch (error: any) {
    console.error('Erro ao fazer login:', error.response?.data || error.message);
    // Retorna null ou lança o erro, dependendo de como você quer tratar no frontend
    return null;
  }
}
