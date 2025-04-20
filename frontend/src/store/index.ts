// src/store/index.ts
import { create } from "zustand"
import { createInventarioSlice, InventarioState } from "./slices/inventarioSlice"


// Definición del estado global
type StoreState = InventarioState

// Crear el store combinando los slices
export const useStore = create<StoreState>((...args) => ({
  ...createInventarioSlice(...args),
 
}))