// src/store/slices/inventarioSlice.ts
import type { StateCreator } from "zustand";
import { AddProductFormDataSchema } from "@/lib/zod";
import type { Tasas, AddProductFormData, Product } from "@/types";
import { createProductFromFormData, updateProductRates } from "@/utils/store/inventarioSlice/product-utils";
import {
  initializeDatabase,
  saveProductsToDB,
  loadProductsFromDB,
  saveTasasToDB,
  loadTasasFromDB,
} from "@/services/database/database";
import { StoreApi } from 'zustand';

export type InventarioState = {
  editProduct: Product | null;
  setEditProduct: (product: Product | null) => void;
  tasas: Tasas;
  setTasas: (nuevasTasas: Tasas) => void;
  products: Product[];
  setProduct: (formData: AddProductFormData) => void;
  deleteProduct: (productId: string) => void;
  updateProduct: (product: Product) => void;
  updateAllProductRates: () => void;
};

export const createInventarioSlice: StateCreator<InventarioState> = (set, get) => ({
  editProduct: null,
  setEditProduct: (product: Product | null) => set({ editProduct: product || null }),

  tasas: { tasa1: 35, tasa2: 36, tasa3: 37 }, // Valores predeterminados
  setTasas: async (nuevasTasas: Tasas) => {
    set(() => ({ tasas: nuevasTasas }));
    await saveTasasToDB(nuevasTasas); // Guardar tasas en SQLite
    get().updateAllProductRates();
  },

  products: [],
  setProduct: async (formData: AddProductFormData) => {
    try {
      const validatedFormData = AddProductFormDataSchema.parse(formData);
      const tasas = get().tasas;
      const newProduct = createProductFromFormData(validatedFormData, tasas);

      set((state) => ({
        products: [...state.products, newProduct],
      }));

      await saveProductsToDB(get().products); // Guardar productos en SQLite
    } catch (error) {
      console.error("Error al añadir el producto:", error);
    }
  },

  deleteProduct: async (productId: string) => {
    set((state) => ({
      products: state.products.filter((product) => product.codigo !== productId),
    }));

    await saveProductsToDB(get().products); // Guardar productos en SQLite
  },

  updateProduct: async (product: Product) => {
    try {
      const validatedProduct = AddProductFormDataSchema.parse(product);
      const tasas = get().tasas;
      const updatedProduct = createProductFromFormData(validatedProduct, tasas);

      set((state) => ({
        products: state.products.map((p) => (p.codigo === product.codigo ? { ...p, ...updatedProduct } : p)),
      }));

      await saveProductsToDB(get().products); // Guardar productos en SQLite
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
    }
  },

  updateAllProductRates: () => {
    const { products, tasas } = get();
    const updatedProducts = products.map((product) => updateProductRates(product, tasas));

    set({ products: updatedProducts });
    saveProductsToDB(updatedProducts); // Guardar productos actualizados en SQLite
  },
});

// Función para inicializar el estado global desde SQLite
export const initializeStoreFromDB = async (store: StoreApi<InventarioState>) => {
  if (!store) {
    console.error("Store no está disponible");
    return;
  }

  try {
    const products = await loadProductsFromDB();
    const tasas = await loadTasasFromDB();

    store.setState((state) => ({
      ...state,
      products,
      tasas,
    }));

    console.log("Estado global inicializado desde SQLite...");
  } catch (error) {
    console.error("Error al inicializar el estado global desde SQLite:", error);
  }
};