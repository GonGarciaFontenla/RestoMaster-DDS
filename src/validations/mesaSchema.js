import { z } from "zod";
import { EstadoMesa } from "../domain/enums/EstadoMesa.js";
import { Ubicacion } from "../domain/enums/Ubicacion.js";

const valoresUbicacion = Object.values(Ubicacion);
const valoresEstado = Object.values(EstadoMesa);

export const mesaSchema = z.object({
  numero: z
    .number({ required_error: "El número de mesa es obligatorio" })
    .int("El número no puede tener decimales")
    .positive("El número de mesa debe ser mayor a 0"),

  capacidad: z
    .number({ required_error: "La capacidad de la mesa es obligatoria" })
    .int("La capacidad no puede tener decimales")
    .min(1, "La capacidad mínima es de 1 comensal"),

  ubicacion: z.enum(valoresUbicacion, {
    errorMap: () => ({
      message: `La ubicación debe ser una de: ${valoresUbicacion.join(", ")}`,
    }),
  }),

  estado: z
    .enum(valoresEstado, {
      errorMap: () => ({
        message: `El estado debe ser uno de: ${valoresEstado.join(", ")}`,
      }),
    })
    .optional(),
});
