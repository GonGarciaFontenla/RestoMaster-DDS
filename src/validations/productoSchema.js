import { z } from "zod";
import { CategoriaPlato } from "../domain/enums/CategoriaPlato.js";

export const productoSchema = z.object({
  nombre: z.string().min(1, "El nombre del producto es obligatorio"),
  precio: z.number().positive("El precio debe ser un número positivo"),
  categoria: z.nativeEnum(CategoriaPlato, {
    errorMap: () => ({ message: "Categoría de plato no válida" }),
  }),
  vegetariano: z.boolean().default(false),
  celiaco: z.boolean().default(false),
});
