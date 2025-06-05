import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';

type User = {
  username: string;
  password: string;
  name: string;
  avatarColor: string;
};

let db: any = null;
// if (Platform.OS !== 'web') {
//   db = SQLite.openDatabaseSync('users.db');
// }

export function initDb() {
  if (db) {
    db.transaction((tx: any) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          name TEXT,
          avatarColor TEXT
        );`
      );
    });
  }
}

export async function registerUser(user: User) {
  if (db) {
    return new Promise((resolve, reject) => {
      db!.transaction((tx: any) => {
        tx.executeSql(
          'INSERT INTO users (username, password, name, avatarColor) VALUES (?, ?, ?, ?);',
          [user.username, user.password, user.name, user.avatarColor],
          (_: any, result: unknown) => resolve(result),
          (_: any, error: any) => { reject(error); return false; }
        );
      });
    });
  } else {
    // Web: salva no AsyncStorage
    const usersStr = await AsyncStorage.getItem('users');
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];
    if (users.find(u => u.username === user.username)) {
      throw new Error('Usuário já existe');
    }
    users.push(user);
    await AsyncStorage.setItem('users', JSON.stringify(users));
    return true;
  }
}

export async function loginUser(username: string, password: string) {
  if (db) {
    return new Promise<User | null>((resolve, reject) => {
      db!.transaction((tx: { executeSql: (arg0: string, arg1: string[], arg2: (_: any, { rows }: { rows: any; }) => void, arg3: (_: any, error: any) => boolean) => void; }) => {
        tx.executeSql(
          'SELECT * FROM users WHERE username = ? AND password = ?;',
          [username, password],
          (_, { rows }) => {
            if (rows.length > 0) {
              resolve(rows._array[0]);
            } else {
              resolve(null);
            }
          },
          (_, error) => { reject(error); return false; }
        );
      });
    });
  } else {
    // Web: consulta no AsyncStorage
    const usersStr = await AsyncStorage.getItem('users');
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];
    const user = users.find(u => u.username === username && u.password === password);
    return user || null;
  }
}