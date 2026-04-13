import { z } from "zod";
import { EstadoCocina } from "../domain/enums/EstadoCocina.js";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const itemComandaSchema = z.object({
  producto: z.string().regex(objectIdRegex, "El ID del producto no es válido"),
  cantidad: z.number().int().positive("La cantidad debe ser al menos 1"),
  estado: z
    .nativeEnum(EstadoCocina, {
      errorMap: () => ({ message: "Estado de cocina no válido" }),
    })
    .default(EstadoCocina.PENDIENTE),
});
