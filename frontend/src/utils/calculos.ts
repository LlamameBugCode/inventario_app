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

//Con esto obtengo el procentaje de ganancia esperado
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