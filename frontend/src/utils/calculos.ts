import {parseNumber  } from "@/utils/auxiliares";

type getPrecioUnitarioProps = {
  precioBulto:string,
  cantidad:string,
  porcentajeDeGanancia:string
}

export const getPrecioUnitario = ({precioBulto,cantidad,porcentajeDeGanancia} : getPrecioUnitarioProps)=>{
const p = parseNumber(precioBulto)
const c = parseNumber(cantidad)
const pg = parseNumber(porcentajeDeGanancia)

//Con esto obtengo el procentaje de gan ancia esperado
const valor_de_pg = (pg * p)/100;
const pa = (valor_de_pg + p) / c

return pa;
}

export const getValorPorcentajeGanancia = ({precioBulto,porcentajeDeGanancia} : getPrecioUnitarioProps)=>{
const p = parseNumber(precioBulto)
const pg = parseNumber(porcentajeDeGanancia)

//Con esto obtengo el procentaje de ganancia esperado
const valor_de_pg = (pg * p)/100;

return valor_de_pg;
}

/**
 * Convierte un valor entre dólares y bolívares según la tasa de cambio
 * @param valor - El valor a convertir (string)
 * @param tasa - La tasa de cambio (number)
 * @param aBs - Si es true, convierte de dólares a bolívares. Si es false, de bolívares a dólares.
 * @returns El valor convertido formateado con 2 decimales
 */
export function convertirValor(valor: string, tasa: number, aBs = false): string {
  if (!valor) return "";
  const numero = parseNumber(valor);
  return aBs ? (numero * tasa).toFixed(2) : (numero / tasa).toFixed(2);
}

/**
 * Calcula el precio unitario de un producto
 * @param precioTotal - Precio total del lote
 * @param cantidad - Cantidad de unidades
 * @returns Precio unitario
 */
export function calcularPrecioUnitario(precioTotal: number, cantidad: number): number {
  return precioTotal / cantidad;
}

/**
 * Calcula la ganancia esperada basada en el precio y el porcentaje de ganancia
 * @param precio - Precio del producto
 * @param porcentajeGanancia - Porcentaje de ganancia
 * @returns Ganancia esperada
 */
export function calcularGananciaEsperada(precio: number, porcentajeGanancia: number): number {
  return (precio * porcentajeGanancia) / 100;
}

/**
 * Calcula la ganancia por artículo
 * @param gananciaTotal - Ganancia total
 * @param cantidad - Cantidad de artículos
 * @returns Ganancia por artículo
 */
export function calcularGananciaUnitaria(gananciaTotal: number, cantidad: number): number {
  return gananciaTotal / cantidad;
}