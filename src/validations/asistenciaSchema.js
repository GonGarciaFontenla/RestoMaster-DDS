import { z } from "zod";
import { EstadoReserva } from "../domain/enums/EstadoReserva.js";

export const asistenciaSchema = z.object({
  estado: z.enum([EstadoReserva.ASISTIO, EstadoReserva.NO_SHOW], {
    errorMap: () => ({ message: "El estado debe ser 'ASISTIO' o 'NO_SHOW'" }),
  }),
});
