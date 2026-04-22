import { z } from "zod";
import { EstadoComanda } from "../domain/enums/EstadoComanda.js";
import { EstadoCocina } from "../domain/enums/EstadoCocina.js";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// El body puede tener dos formas mutuamente excluyentes:
// 1. Actualizar estado de un ítem puntual:   { itemId, estadoItem }
// 2. Actualizar estado global de la comanda: { estado }
export const actualizarEstadoSchema = z.union([
  z.object({
    itemId: z.string().regex(objectIdRegex, "El ID del ítem no es válido"),
    estadoItem: z.nativeEnum(EstadoCocina, {
      errorMap: () => ({ message: "Estado de cocina no válido" }),
    }),
  }),
  z.object({
    estado: z.nativeEnum(EstadoComanda, {
      errorMap: () => ({ message: "Estado de comanda no válido" }),
    }),
  }),
]);
