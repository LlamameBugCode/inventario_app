import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export const getDatabase = () => {
  if (!db) {
    db = SQLite.openDatabaseSync('my-database.db');
    console.log("Conexión a la base de datos abierta correctamente");
  }
  return db;
};