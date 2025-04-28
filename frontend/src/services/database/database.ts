// src/services/database/database.ts
import * as SQLite from 'expo-sqlite';
import { ProductSchema, TasasSchema } from '@/lib/zod';
import { Product } from '@/types';
import { getDatabase } from './initializeDatabase';

let db: SQLite.SQLiteDatabase | null = null;

export const initializeDatabase = async () => {
  try {

    db = await SQLite.openDatabaseAsync('my-database.db');
    //await db.execAsync(`DROP TABLE IF EXISTS products;`);
    //await db.execAsync(`DROP TABLE IF EXISTS products;`);
    const result = await db.getAllAsync<any>(`PRAGMA table_info(products);`);
    console.log("Estructura de la tabla products:", result);
    console.log("Conexión a la base de datos abierta correctamente");
  } catch (error) {
    console.error("Error al abrir la base de datos:", error);
    throw error;
  }
};

export const initDatabase = async () => {
  const db = getDatabase();

  try {
    // Crear tabla para productos
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS products (
        codigo TEXT PRIMARY KEY,
        categoria TEXT,
        nombre TEXT NOT NULL,
        cantidad INTEGER NOT NULL,
        precioBulto REAL NOT NULL,
        precioUnitario REAL,
        precioUnitarioTasa1 REAL,
        precioUnitarioTasa2 REAL,
        precioUnitarioTasa3 REAL,
        gananciasEsperadasTasa1 REAL,
        gananciasEsperadasTasa2 REAL,
        gananciasEsperadasTasa3 REAL,
        articulosVendidos INTEGER,
        porcentajeDeGanancias REAL,
        gananciasPorArticulo REAL,
        gananciasEsperadas REAL,
        gananciasActuales REAL
      );
    `);

    // Crear tabla para tasas
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS tasas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tasa1 REAL,
        tasa2 REAL,
        tasa3 REAL
      );
    `);

    console.log("Tablas creadas correctamente");
  } catch (error) {
    console.error("Error al inicializar las tablas:", error);
    throw error;
  }
};

// Guardar productos en la base de datos
export const saveProductsToDB = async (products: Product[]) => {
  const db = getDatabase();

  try {
    await db.runAsync(`DELETE FROM products;`); // Limpiar la tabla antes de guardar nuevos productos
    for (const product of products) {
      await db.runAsync(
        `INSERT INTO products (
          codigo, categoria, nombre, cantidad, precioBulto, precioUnitario,
          precioUnitarioTasa1, precioUnitarioTasa2, precioUnitarioTasa3,
          gananciasEsperadasTasa1, gananciasEsperadasTasa2, gananciasEsperadasTasa3,
          articulosVendidos, porcentajeDeGanancias, gananciasPorArticulo,
          gananciasEsperadas, gananciasActuales
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          product.codigo,
          product.categoria,
          product.nombre,
          product.cantidad,
          product.precioBulto,
          product.precioUnitario,
          product.precioUnitarioTasa1,
          product.precioUnitarioTasa2,
          product.precioUnitarioTasa3,
          product.gananciasEsperadasTasa1,
          product.gananciasEsperadasTasa2,
          product.gananciasEsperadasTasa3,
          product.articulosVendidos,
          product.porcentajeDeGanancias,
          product.gananciasPorArticulo,
          product.gananciasEsperadas,
          product.gananciasActuales,
        ]
      );
    }
    console.log("Productos guardados en la base de datos");
  } catch (error) {
    console.error("Error al guardar los productos en la base de datos:", error);
    throw error;
  }
};

// Cargar productos desde la base de datos
export const loadProductsFromDB = async (): Promise<Product[]> => {
  const db = getDatabase();

  try {
    const result = await db.getAllAsync<any>(`SELECT * FROM products;`);
    console.log("Productos cargados desde la base de datos:", result);
    return result;
  } catch (error) {
    console.error("Error al cargar los productos desde la base de datos:", error);
    throw error;
  }
};

// Guardar tasas en la base de datos
export const saveTasasToDB = async (tasas: { tasa1: number; tasa2: number; tasa3: number }) => {
  const db = getDatabase();

  try {
    await db.runAsync(`DELETE FROM tasas;`); // Limpiar la tabla antes de guardar nuevas tasas
    await db.runAsync(
      `INSERT INTO tasas (tasa1, tasa2, tasa3) VALUES (?, ?, ?);`,
      [tasas.tasa1, tasas.tasa2, tasas.tasa3]
    );
    console.log("Tasas guardadas en la base de datos");
  } catch (error) {
    console.error("Error al guardar las tasas en la base de datos:", error);
    throw error;
  }
};

// Cargar tasas desde la base de datos
export const loadTasasFromDB = async (): Promise<{ tasa1: number; tasa2: number; tasa3: number }> => {
  const db = getDatabase();

  try {
    const result = await db.getFirstAsync<any>(`SELECT * FROM tasas ORDER BY id DESC LIMIT 1;`);
    if (!result) {
      console.log("No se encontraron tasas en la base de datos. Usando valores predeterminados.");
      return { tasa1: 35, tasa2: 36, tasa3: 37 }; // Valores predeterminados
    }
    console.log("Tasas cargadas desde la base de datos:", result);
    return result;
  } catch (error) {
    console.error("Error al cargar las tasas desde la base de datos:", error);
    throw error;
  }
};