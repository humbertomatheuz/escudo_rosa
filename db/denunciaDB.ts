import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";

export type Denuncia = {
  id?: number;
  nome?: string;
  identificar: boolean;
  motivo: string;
  descricao: string;
  agressor: string;
  createdAt: string;
};

let db: any = null;
if (Platform.OS !== "web") {
  db = SQLite.openDatabaseSync("denuncias.db");
}

export function initDenunciaDb(): void {
  if (db) {
    db.transaction((tx: { executeSql: (arg0: string) => void; }) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS denuncias (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT,
          identificar INTEGER NOT NULL,
          motivo TEXT NOT NULL,
          descricao TEXT NOT NULL,
          agressor TEXT,
          createdAt TEXT NOT NULL
        );`
      );
    });
  }
}

export async function salvarDenuncia(data: Denuncia): Promise<boolean> {
  if (db) {
    return new Promise((resolve, reject) => {
      db!.transaction((tx: { executeSql: (arg0: string, arg1: (string | number | null)[], arg2: () => void, arg3: (_: any, error: any) => boolean) => void; }) => {
        tx.executeSql(
          "INSERT INTO denuncias (nome, identificar, motivo, descricao, agressor, createdAt) VALUES (?, ?, ?, ?, ?, ?);",
          [
            data.nome || null,
            data.identificar ? 1 : 0,
            data.motivo,
            data.descricao,
            data.agressor,
            data.createdAt,
          ],
          () => resolve(true),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  } else {
    // Web: salva no AsyncStorage
    const denunciasStr = await AsyncStorage.getItem("denuncias");
    const denuncias: Denuncia[] = denunciasStr ? JSON.parse(denunciasStr) : [];
    denuncias.push({ ...data, id: Date.now() });
    await AsyncStorage.setItem("denuncias", JSON.stringify(denuncias));
    return true;
  }
}

export async function listarDenuncias(): Promise<Denuncia[]> {
  if (db) {
    return new Promise((resolve, reject) => {
      db!.transaction((tx: { executeSql: (arg0: string, arg1: never[], arg2: (_: any, { rows }: any) => void, arg3: (_: any, error: any) => boolean) => void; }) => {
        tx.executeSql(
          "SELECT * FROM denuncias ORDER BY createdAt DESC;",
          [],
          (_: any, { rows }: any) => resolve(rows._array),
          (_: any, error: any) => {
            reject(error);
            return false;
          }
        );
      });
    });
  } else {
    // Web: busca no AsyncStorage
    const denunciasStr = await AsyncStorage.getItem("denuncias");
    const denuncias: Denuncia[] = denunciasStr ? JSON.parse(denunciasStr) : [];
    return denuncias;
  }
}
