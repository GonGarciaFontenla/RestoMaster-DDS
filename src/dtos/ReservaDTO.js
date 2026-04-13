export const ReservaREST = (reserva) => ({
  id: reserva._id,
  nombreCliente: reserva.nombreCliente,
  telefono: reserva.telefono,
  cantidadComensales: reserva.cantidadComensales,
  mesa: {
    id: reserva.mesaReservada?._id,
    numero: reserva.mesaReservada?.numero,
  },
  horario: reserva.horario,
  estado: reserva.estado,
});
