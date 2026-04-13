import { EstadoReserva } from "./enums/EstadoReserva.js";

/**
 * Representa una reserva de mesa realizada por un cliente.
 *
 * @param {Mesa} mesaReservada - Mesa asignada para la reserva.
 * @param {string} nombreCliente - Nombre del cliente que realiza la reserva.
 * @param {string} telefono - Teléfono de contacto del cliente.
 * @param {number} cantidadComensales - Número de personas que asistirán.
 * @param {Date} horario - Fecha y hora de la reserva.
 * @param {EstadoReserva} estado - Estado de la reserva (por defecto: PENDIENTE).
 */
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
