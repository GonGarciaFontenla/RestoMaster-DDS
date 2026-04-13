// Enumeración de estados posibles para una Reserva
export const EstadoReserva = Object.freeze({
  PENDIENTE: "PENDIENTE",    // La reserva fue creada pero no confirmada
  CONFIRMADA: "CONFIRMADA",  // La reserva fue confirmada con el cliente
  ASISTIO: "ASISTIO",        // El cliente se presentó al restaurante
  NO_SHOW: "NO_SHOW",        // El cliente no se presentó
  CANCELADA: "CANCELADA",    // La reserva fue anulada
});
