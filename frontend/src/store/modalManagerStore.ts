// src/store/modalManagerStore.ts
import { create } from "zustand"
import { Product } from "@/types"

// Definición del estado y acciones del slice de modales
type ModalManagerState = {
  //En vez de modalsOpen deberia ser modalVisible
  modalsOpen: {
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
  modalsOpen: {
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
      modalsOpen: {
        ...state.modalsOpen,
        optionsModal: true,
      },

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

  openModalDetallesValoresCalculados: () => {
    set((state) => ({
      modalsOpen: {
        ...state.modalsOpen,
        ModalDetallesValoresCalculados: true,
      },
    }))
  },

  closeModalDetallesValoresCalculados: () => {
    set((state) => ({
      modalsOpen: {
        ...state.modalsOpen,
        ModalDetallesValoresCalculados: false,
      },
    }))
  },

  openModalEditarValoresCalculados: () => {
    set((state) => ({
      modalsOpen: {
        ...state.modalsOpen,
        modalEditarValoresCalculados: true,
      },
    }))
  },

  closeModalEditarValoresCalculados: () => {
    set((state) => ({
      modalsOpen: {
        ...state.modalsOpen,
        modalEditarValoresCalculados: false,
      },
    }))
  },

  openModalDetallesProducto: (product:Product) => { // Añadido nuevo modal
    set((state) => ({
      modalsOpen: {
        ...state.modalsOpen,
        modalDetallesProducto: true,
      },
      selectedProduct:product
    }))
  },

  closeModalDetallesProducto: () => { // Añadido nuevo modal
    set((state) => ({
      modalsOpen: {
        ...state.modalsOpen,
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
      modalsOpen: {
        ...state.modalsOpen,
        optionsModal: false,
      },
      selectedProduct: null,
    }))
  },
}))