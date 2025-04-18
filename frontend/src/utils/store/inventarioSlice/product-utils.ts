// src/utils/product-utils.ts
import { AddProductFormData, Product } from "@/types";
import { Tasas } from "@/types";
import { generateUniqueId } from '@/utils/auxiliares'

/**
 * Crea un objeto producto completo a partir de los datos del formulario,
 * calculando todos los valores derivados basados en las tasas actuales
 */
export function createProductFromFormData(formData: AddProductFormData, tasas: Tasas): Product {
  // Calcular valores en diferentes tasas
  const precioUnitarioTasa1 = formData.precioUnitario * tasas.tasa1;
  const precioUnitarioTasa2 = formData.precioUnitario * tasas.tasa2;
  const precioUnitarioTasa3 = formData.precioUnitario * tasas.tasa3;

  const gananciasEsperadasTasa1 = formData.gananciaEsperada * tasas.tasa1;
  const gananciasEsperadasTasa2 = formData.gananciaEsperada * tasas.tasa2;
  const gananciasEsperadasTasa3 = formData.gananciaEsperada * tasas.tasa3;

  return {
    codigo: generateUniqueId(),
    categoria: "",
    nombre: formData.nombre,
    cantidad: formData.cantidad,
    precioBulto: formData.precio,
    precioUnitario: formData.precioUnitario,
    // Valores precalculados
    precioUnitarioTasa1,
    precioUnitarioTasa2,
    precioUnitarioTasa3,
    articulosVendidos: 0,
    porcentajeDeGanancias: formData.porcentajeGanancia,
    gananciasPorArticulo: formData.gananciaUnitaria,
    gananciasEsperadas: formData.gananciaEsperada,
    // Valores precalculados
    gananciasEsperadasTasa1,
    gananciasEsperadasTasa2,
    gananciasEsperadasTasa3,
    gananciasActuales: 0,
  };
}

/**
 * Actualiza los valores precalculados de un producto basados en las tasas actuales
 */
export function updateProductRates(product: Product, tasas: Tasas): Product {
  return {
    ...product,
    precioUnitarioTasa1: product.precioUnitario * tasas.tasa1,
    precioUnitarioTasa2: product.precioUnitario * tasas.tasa2,
    precioUnitarioTasa3: product.precioUnitario * tasas.tasa3,
    gananciasEsperadasTasa1: product.gananciasEsperadas * tasas.tasa1,
    gananciasEsperadasTasa2: product.gananciasEsperadas * tasas.tasa2,
    gananciasEsperadasTasa3: product.gananciasEsperadas * tasas.tasa3,
  };
}