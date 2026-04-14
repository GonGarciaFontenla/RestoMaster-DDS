import { EstadoReserva } from "./enums/EstadoReserva.js";

export default class Reserva {
  constructor(
    mesaReservada,
    nombreCliente,
    telefono,
    cantidadComensales,
    horario,
    estado = EstadoReserva.PENDIENTE,
  ) {
    this.mesaReservada = mesaReservada;
    this.nombreCliente = nombreCliente;
    this.telefono = telefono;
    this.cantidadComensales = cantidadComensales;
    this.horario = horario;
    this.estado = estado;
  }
}
