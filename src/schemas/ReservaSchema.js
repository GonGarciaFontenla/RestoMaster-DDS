import mongoose from "mongoose";
import { EstadoReserva } from "../domain/enums/EstadoReserva.js";
import Reserva from "../domain/Reserva.js";

export const ReservaSchema = new mongoose.Schema({
  mesaReservada: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mesa",
    required: true,
  },
  nombreCliente: {
    type: String,
    required: true,
  },
  telefono: {
    type: String,
    required: true,
  },
  cantidadComensales: {
    type: Number,
    required: true,
    min: 1,
  },
  horario: {
    type: Date,
    required: true,
  },
  estado: {
    type: String,
    required: true,
    enum: Object.values(EstadoReserva),
    default: EstadoReserva.PENDIENTE,
  },
  /*
   * Soft delete: en lugar de borrar el documento de la BD,
   * se setea deletedAt con la fecha de eliminación.
   * Al consultar, siempre se filtra por deletedAt: null.
   */
  deletedAt: {
    type: Date,
    default: null,
  },
});

ReservaSchema.loadClass(Reserva);

export const ReservaModel = mongoose.model("Reserva", ReservaSchema);
