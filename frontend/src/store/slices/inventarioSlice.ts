// src/store/slices/inventarioSlice.ts
import { StateCreator } from 'zustand';
import { TasasSchema } from '@/lib/zod';
import { Product, Products, Tasas } from '../../types';

// Definición del tipo para el estado
export type InventarioState = {
  tasas: Tasas;
  setTasas: (nuevasTasas: Tasas) => void; // Recibe un objeto de tipo Tasas
  products: Products;
};

export const createInventarioSlice: StateCreator<InventarioState> = (set) => ({
  tasas: { tasa1: 0, tasa2: 0, tasa3: 0 },
  products: [],

  setTasas: (nuevasTasas: Tasas) => {
    try {
      // Validar el objeto de entrada
      const tasasValidadas = TasasSchema.parse(nuevasTasas);

      // Actualizar el estado con las tasas validadas
      set(() => ({
        tasas: tasasValidadas,
      }));
    } catch (error) {
      console.error('Error al actualizar las tasas:', error);
    }
  },
});