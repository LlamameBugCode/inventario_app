import {z} from 'zod'

//Schema tasas
export const TasasSchema = z.object({
  tasa1: z.number(),
  tasa2: z.number(),
  tasa3: z.number(),
})




//Schema de CardProduct
export const ProductSchema = z.object({
  codigo:z.string(),
  categoria:z.string(),

  nombre:z.string(),
  cantidad:z.number(),
  precioBulto:z.number(),
  precioUnitario:z.number(),

  precioUnitarioTasa1: z.number(),
  precioUnitarioTasa2: z.number(),
  precioUnitarioTasa3: z.number(),

  gananciasEsperadasTasa1: z.number(),
  gananciasEsperadasTasa2: z.number(),
  gananciasEsperadasTasa3: z.number(),

  articulosVendidos:z.number(),

  porcentajeDeGanancias:z.number(),
  gananciasPorArticulo:z.number(),
  gananciasEsperadas:z.number(),
  gananciasActuales:z.number(),


})

export const ProductPreviewSchema = z.object({
  nombre:z.string(),
  codigo:z.string(),
  cantidad:z.number(),
  precioUnitario:z.number(),
  ultimaActualizacion:z.string(),
  gananciasEsperadas:z.number()
})

//chema para El formularuio que esta dentro de AddProduct
export const AddProductFormDataSchema = z.object({
  nombre: z.string(),
  precio: z.number(),
  cantidad: z.number(),
  porcentajeGanancia: z.number(),
  precioUnitario: z.number(),
  gananciaEsperada: z.number(),
  gananciaUnitaria: z.number(),
});


export const ProductsSchema = z.array(ProductSchema)