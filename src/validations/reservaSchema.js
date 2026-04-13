import { z } from "zod";
import { EstadoReserva } from "../domain/enums/EstadoReserva.js";

export const reservaSchema = z.object({
  mesaReservada: z.string({ required_error: "La mesa reservada es obligatoria" }),
  nombreCliente: z.string().min(1, "El nombre del cliente es obligatorio"),
  telefono: z.string().min(1, "El teléfono es obligatorio"),
  cantidadComensales: z
    .number()
    .int()
    .positive("La cantidad de comensales debe ser al menos 1"),
  horario: z.coerce.date({
    required_error: "El horario es obligatorio",
    invalid_type_error: "Debe ser una fecha válida",
  }),
  estado: z
    .nativeEnum(EstadoReserva, {
      errorMap: () => ({ message: "Estado de reserva no válido" }),
    })
    .default(EstadoReserva.PENDIENTE),
});
