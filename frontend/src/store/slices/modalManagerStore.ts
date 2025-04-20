// src/store/modalManagerStore.ts
import { create } from "zustand"
import { Product } from "@/types"

// Definición del estado y acciones del slice de modales
type ModalManagerState = {
  modalsOpen: {
    optionsModal: boolean
    modalAddProduct: boolean
    ModalEditarTasas: boolean
  }
  selectedProduct: Product | null
}

type ModalManagerActions = {
  openOptionsModal: (product: Product) => void
  closeOptionsModal: () => void
  setSelectedProduct: (product: Product | null) => void
  openModalAddProduct: () => void
  closeModalAddProduct: () => void
  openModalEditarTasas: () => void
  closeModalEditarTasas: () => void
}

// Crear el store de modales
export const useModalManagerStore = create<ModalManagerState & ModalManagerActions>((set) => ({
  modalsOpen: {
    optionsModal: false,
    modalAddProduct: false,
    ModalEditarTasas: false,
  },
  selectedProduct: null,

  openOptionsModal: (product) => {
    set((state) => ({
      modalsOpen: {
        ...state.modalsOpen,
        optionsModal: true,
      },
      selectedProduct: product,
    }))
  },

  openModalAddProduct: () => {
    set((state) => ({
      modalsOpen: {
        ...state.modalsOpen,
        modalAddProduct: true,
      },
    }))
  },

  closeModalAddProduct: () => {
    set((state) => ({
      modalsOpen: {
        ...state.modalsOpen,
        modalAddProduct: false,
      },
    }))
  },

  openModalEditarTasas: () => {
    set((state) => ({
      modalsOpen: {
        ...state.modalsOpen,
        ModalEditarTasas: true,
      },
    }))
  },

  closeModalEditarTasas: () => {
    set((state) => ({
      modalsOpen: {
        ...state.modalsOpen,
        ModalEditarTasas: false,
      },
    }))
  },

  setSelectedProduct: (product) => {
    set({ selectedProduct: product })
  },

  closeOptionsModal: () => {
    set((state) => ({
      modalsOpen: {
        ...state.modalsOpen,
        optionsModal: false,
      },
      selectedProduct: null,
    }))
  },
}))