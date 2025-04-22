// src/store/modalManagerStore.ts
import { create } from "zustand"
import { Product } from "@/types"

// Definición del estado del store
type ModalManagerState = {
  // Estado de visibilidad de los modales
  modalsVisible: {
    optionsModal: boolean
    modalAddProduct: boolean
    ModalEditarTasas: boolean
    ModalDetallesValoresCalculados: boolean
    modalEditarValoresCalculados: boolean
    modalDetallesProducto: boolean
  }
  selectedProduct: Product | null
}

// Acciones para abrir modales
type OpenActions = {
  openOptionsModal: (product: Product) => void
  openModalAddProduct: () => void
  openModalEditarTasas: () => void
  openModalDetallesValoresCalculados: () => void
  openModalEditarValoresCalculados: () => void
  openModalDetallesProducto: (product: Product) => void
}

// Acciones para cerrar modales
type CloseActions = {
  closeOptionsModal: () => void
  closeModalAddProduct: () => void
  closeModalEditarTasas: () => void
  closeModalDetallesValoresCalculados: () => void
  closeModalEditarValoresCalculados: () => void
  closeModalDetallesProducto: () => void
}

// Acciones adicionales
type SetActions = {
  setSelectedProduct: (product: Product | null) => void
}

// Crear el store de modales
export const useModalManagerStore = create<ModalManagerState & OpenActions & CloseActions & SetActions>((set) => ({
  // Estado inicial de visibilidad de los modales
  modalsVisible: {
    optionsModal: false,
    modalAddProduct: false,
    ModalEditarTasas: false,
    ModalDetallesValoresCalculados: false,
    modalEditarValoresCalculados: false,
    modalDetallesProducto: false,
  },
  selectedProduct: null,

  // Acciones para abrir modales
  openOptionsModal: (product) =>
    set((state) => ({
      modalsVisible: { ...state.modalsVisible, optionsModal: true },
      selectedProduct: product,
    })),

  openModalAddProduct: () =>
    set((state) => ({
      modalsVisible: { ...state.modalsVisible, modalAddProduct: true },
    })),

  openModalEditarTasas: () =>
    set((state) => ({
      modalsVisible: { ...state.modalsVisible, ModalEditarTasas: true },
    })),

  openModalDetallesValoresCalculados: () =>
    set((state) => ({
      modalsVisible: { ...state.modalsVisible, ModalDetallesValoresCalculados: true },
    })),

  openModalEditarValoresCalculados: () =>
    set((state) => ({
      modalsVisible: { ...state.modalsVisible, modalEditarValoresCalculados: true },
    })),

  openModalDetallesProducto: (product) =>
    set((state) => ({
      modalsVisible: { ...state.modalsVisible, modalDetallesProducto: true },
      selectedProduct: product,
    })),

  // Acciones para cerrar modales
  closeOptionsModal: () =>
    set((state) => ({
      modalsVisible: { ...state.modalsVisible, optionsModal: false },
      selectedProduct: null,
    })),

  closeModalAddProduct: () =>
    set((state) => ({
      modalsVisible: { ...state.modalsVisible, modalAddProduct: false },
    })),

  closeModalEditarTasas: () =>
    set((state) => ({
      modalsVisible: { ...state.modalsVisible, ModalEditarTasas: false },
    })),

  closeModalDetallesValoresCalculados: () =>
    set((state) => ({
      modalsVisible: { ...state.modalsVisible, ModalDetallesValoresCalculados: false },
    })),

  closeModalEditarValoresCalculados: () =>
    set((state) => ({
      modalsVisible: { ...state.modalsVisible, modalEditarValoresCalculados: false },
    })),

  closeModalDetallesProducto: () =>
    set((state) => ({
      modalsVisible: { ...state.modalsVisible, modalDetallesProducto: false },
      selectedProduct: null,
    })),

  // Acción adicional para establecer el producto seleccionado
  setSelectedProduct: (product) =>
    set({ selectedProduct: product }),
}))