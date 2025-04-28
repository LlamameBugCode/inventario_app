// src/services/database/database.ts
import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export const initializeDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync('my-database.db');
    console.log("Conexión a la base de datos abierta correctamente");
  } catch (error) {
    console.error("Error al abrir la base de datos:", error);
    throw error;
  }
};

export const initDatabase = async () => {
  if (!db) {
    throw new Error("La base de datos no está inicializada. Asegúrate de llamar a initializeDatabase primero.");
  }

  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        precio REAL NOT NULL
      );
    `);

    console.log("Base de datos inicializada");
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
    throw error;
  }
};