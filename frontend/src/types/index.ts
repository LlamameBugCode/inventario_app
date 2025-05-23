import {z} from 'zod'
import {ProductSchema, ProductsSchema, TasasSchema, AddProductFormDataSchema} from '../lib/zod/'


//Tasas globales
export type Tasas = z.infer<typeof TasasSchema>

// Inferir los tipos desde los esquemas Zod
export type Product = z.infer<typeof ProductSchema>;
export type Products = z.infer<typeof ProductsSchema>;

//inferir el schema para el formulario que esta dentro de AddProduct
export type AddProductFormData = z.infer<typeof AddProductFormDataSchema>
