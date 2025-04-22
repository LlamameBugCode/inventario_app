// src/store/modalManagerStore.ts
import { create } from "zustand"
import { Product } from "@/types"

// Definición del estado y acciones del slice de modales

type ModalManagerState = {
 
  modalsVisible: {
    optionsModal: boolean
    modalAddProduct: boolean
    ModalEditarTasas: boolean
    ModalDetallesValoresCalculados:boolean
    modalEditarValoresCalculados:boolean
    modalDetallesProducto: boolean // Añadido nuevo modal
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
  openModalDetallesValoresCalculados: () => void
  closeModalDetallesValoresCalculados: () => void
  openModalEditarValoresCalculados: () => void
  closeModalEditarValoresCalculados: () => void
  openModalDetallesProducto: (product:Product) => void // Añadido nuevo modal
  closeModalDetallesProducto: () => void // Añadido nuevo modal
}

// Crear el store de modales
export const useModalManagerStore = create<ModalManagerState & ModalManagerActions>((set) => ({
  modalsVisible: {
    optionsModal: false,
    modalAddProduct: false,
    ModalEditarTasas: false,
    ModalDetallesValoresCalculados: false,
    modalEditarValoresCalculados: false,
    modalDetallesProducto: false, // Añadido nuevo modal
  },
  selectedProduct: null,


  //Arreglar aqui: Deno ver si hace falta ese parametro, creo que no
  openOptionsModal: (product) => {
    set((state) => ({
      modalsVisible: {
        ...state.modalsVisible,
        optionsModal: true,
      },

    }))
  },

  openModalAddProduct: () => {
    set((state) => ({
      modalsVisible: {
        ...state.modalsVisible,
        modalAddProduct: true,
      },
    }))
  },

  closeModalAddProduct: () => {
    set((state) => ({
      modalsVisible: {
        ...state.modalsVisible,
        modalAddProduct: false,
      },
    }))
  },

  openModalEditarTasas: () => {
    set((state) => ({
      modalsVisible: {
        ...state.modalsVisible,
        ModalEditarTasas: true,
      },
    }))
  },

  closeModalEditarTasas: () => {
    set((state) => ({
      modalsVisible: {
        ...state.modalsVisible,
        ModalEditarTasas: false,
      },
    }))
  },

  openModalDetallesValoresCalculados: () => {
    set((state) => ({
      modalsVisible: {
        ...state.modalsVisible,
        ModalDetallesValoresCalculados: true,
      },
    }))
  },

  closeModalDetallesValoresCalculados: () => {
    set((state) => ({
      modalsVisible: {
        ...state.modalsVisible,
        ModalDetallesValoresCalculados: false,
      },
    }))
  },

  openModalEditarValoresCalculados: () => {
    set((state) => ({
      modalsVisible: {
        ...state.modalsVisible,
        modalEditarValoresCalculados: true,
      },
    }))
  },

  closeModalEditarValoresCalculados: () => {
    set((state) => ({
      modalsVisible: {
        ...state.modalsVisible,
        modalEditarValoresCalculados: false,
      },
    }))
  },

  openModalDetallesProducto: (product:Product) => { // Añadido nuevo modal
    set((state) => ({
      modalsVisible: {
        ...state.modalsVisible,
        modalDetallesProducto: true,
      },
      selectedProduct:product
    }))
  },

  closeModalDetallesProducto: () => { // Añadido nuevo modal
    set((state) => ({
      modalsVisible: {
        ...state.modalsVisible,
        modalDetallesProducto: false,
      },
      selectedProduct:null
    }))

  },

  setSelectedProduct: (product) => {
    set({ selectedProduct: product })
  },

  closeOptionsModal: () => {
    set((state) => ({
      modalsVisible: {
        ...state.modalsVisible,
        optionsModal: false,
      },
      selectedProduct: null,
    }))
  },
}))