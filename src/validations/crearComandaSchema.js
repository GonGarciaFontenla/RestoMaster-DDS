import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// Fix #4: schema específico para la creación de una comanda via HTTP.
// Es más simple que el comandaSchema completo, que valida demasiados campos
// que el servidor asigna internamente (estado, fechaApertura, items).
export const crearComandaSchema = z.object({
  mesa: z.string().regex(objectIdRegex, "El ID de la mesa no es válido"),
  mozoId: z.string().regex(objectIdRegex, "El ID del mozo no es válido"),
});

// Fix #2: schema para validar los query params de GET /disponibilidad
// cuando llegan como strings desde la URL (parseInt(undefined) → NaN).
export const disponibilidadSchema = z.object({
  fecha: z.string().min(1, "La fecha es obligatoria"),
  hora: z.string().regex(/^\d{2}:\d{2}$/, "El formato de hora debe ser HH:MM"),
  comensales: z
    .string()
    .regex(/^\d+$/, "La cantidad de comensales debe ser un número")
    .transform((v) => parseInt(v, 10))
    .refine((v) => v >= 1, "La cantidad de comensales debe ser al menos 1"),
});
