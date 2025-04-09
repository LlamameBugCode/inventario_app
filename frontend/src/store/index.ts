// src/store/index.ts
import { create } from 'zustand';
import { createInventarioSlice ,InventarioState} from './slices/inventarioSlice';

// Crear el store
export const useStore = create<InventarioState>()((...args) => ({
  ...createInventarioSlice(...args),
}));


