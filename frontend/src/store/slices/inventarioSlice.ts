// src/store/slices/inventarioSlice.ts
import type { StateCreator } from "zustand"
import { AddProductFormDataSchema } from "@/lib/zod"
import type { Tasas, AddProductFormData, Product } from "@/types"
import { createProductFromFormData, updateProductRates } from "@/utils/store/inventarioSlice/product-utils"

// Estado global
export type InventarioState = {
  editProduct: Product | null // Almacena el producto en edición (null si no hay edición)
  setEditProduct: (product: Product | null) => void
  tasas: Tasas
  setTasas: (nuevasTasas: Tasas) => void
  products: Product[]
  setProduct: (formData: AddProductFormData) => void
  deleteProduct: (productId: string) => void
  updateProduct: (product: Product) => void // Nueva función para actualizar un producto
  updateAllProductRates: () => void

}


export const createInventarioSlice: StateCreator<InventarioState> = (set, get) => ({
  editProduct: null,
  setEditProduct: (product: Product | null) => set({ editProduct: product||null }),


  tasas: { tasa1: 35, tasa2: 36, tasa3: 37 }, // Valores predeterminados
  setTasas: (nuevasTasas: Tasas) => {
    set(() => ({
      tasas: nuevasTasas,
    }))
    // Después de actualizar las tasas, actualizar todos los productos
    get().updateAllProductRates()
  },

  products: [],
  setProduct: (formData: AddProductFormData) => {
    try {
      // Validar los datos de entrada
      const validatedFormData = AddProductFormDataSchema.parse(formData)

      // Obtener las tasas actuales
      const tasas = get().tasas

      // Crear un producto completo con valores precalculados
      const newProduct = createProductFromFormData(validatedFormData, tasas)

      // Agregar el producto al estado
      set((state) => ({
        products: [...state.products, newProduct],
      }))
    } catch (error) {
      console.error("Error al añadir el producto:", error)
    }
  },

  // Nueva función para eliminar un producto
  deleteProduct: (productId: string) => {
    set((state) => ({
      products: state.products.filter((product) => product.codigo !== productId),
    }))
  },

  // Función para actualizar un producto existente
  updateProduct: (product: Product) => {
    try {
      // Validar los datos de entrada
      const validatedProduct = AddProductFormDataSchema.parse(product)

      // Obtener las tasas actuales
      const tasas = get().tasas

      // Recrear el producto con los nuevos datos y recalcular los valores
      const updatedProduct = createProductFromFormData(validatedProduct, tasas)

      // Actualizar el producto en el estado
      set((state) => ({
        products: state.products.map((p) =>
          p.codigo === product.codigo ? { ...p, ...updatedProduct } : p
        ),
      }))
    } catch (error) {
      console.error("Error al actualizar el producto:", error)
    }
  },

  // Función para actualizar todos los productos cuando cambian las tasas
  updateAllProductRates: () => {
    const { products, tasas } = get()
    const updatedProducts = products.map((product) => updateProductRates(product, tasas))

    set({ products: updatedProducts })
  },
})