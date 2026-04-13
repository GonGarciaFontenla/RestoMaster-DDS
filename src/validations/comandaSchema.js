import { z } from "zod";
import { EstadoComanda } from "../domain/enums/EstadoComanda.js";
import { itemComandaSchema } from "./itemComandaSchema.js";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const comandaSchema = z.object({
  mozo: z.string().regex(objectIdRegex, "El ID del mozo no es válido"),
  mesa: z.string().regex(objectIdRegex, "El ID de la mesa no es válido"),
  estado: z
    .nativeEnum(EstadoComanda, {
      errorMap: () => ({ message: "Estado de comanda no válido" }),
    })
    .default(EstadoComanda.ABIERTA),
  fechaApertura: z.coerce.date().default(() => new Date()),
  items: z.array(itemComandaSchema).default([]),
});
