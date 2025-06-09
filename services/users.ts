import api from './api';

export type User = {
  username: string;
  password: string;
  name: string;
  cargo: string;
};

export async function registerUser(user: User): Promise<User | null> {
  try {
    const response = await api.post('/register', user);

    return response.data;
  } catch (error: any) {
    console.error('Erro ao registrar usuário:', error.response?.data || error.message);

    throw error;
  }
}

export async function loginUser(username: string, password: string): Promise<User | null> {
  try {
    const response = await api.post('/login', { username, password });
    console.log(response);

    return response.data;
  } catch (error: any) {
    console.error('Erro ao fazer login:', error.response?.data || error.message);

    return null;
  }
}
