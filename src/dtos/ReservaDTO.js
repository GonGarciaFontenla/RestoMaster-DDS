// Fix #7: se reemplaza optional chaining (que silenciaba campos undefined)
// por un acceso explícito con fallback claro.
// Si la reserva llega sin populate, el campo mesa tendrá id: null y numero: null,
// haciéndolo evidente en lugar de invisible.
export const ReservaREST = (reserva) => ({
  id: reserva._id,
  nombreCliente: reserva.nombreCliente,
  telefono: reserva.telefono,
  cantidadComensales: reserva.cantidadComensales,
  mesa: {
    id: reserva.mesaReservada?._id ?? null,
    numero: reserva.mesaReservada?.numero ?? null,
  },
  horario: reserva.horario,
  estado: reserva.estado,
});
