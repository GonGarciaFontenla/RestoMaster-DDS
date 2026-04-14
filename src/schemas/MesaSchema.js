import mongoose from "mongoose";
import { EstadoMesa } from "../domain/enums/EstadoMesa.js";
import { Ubicacion } from "../domain/enums/Ubicacion.js";
import Mesa from "../domain/Mesa.js";

export const MesaSchema = new mongoose.Schema({
  restauranteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurante",
    required: true,
    index: true,
  },
  numero: {
    type: Number,
    required: true,
  },
  capacidad: {
    type: Number,
    required: true,
    min: 1,
  },
  ubicacion: {
    type: String,
    required: true,
    enum: Object.values(Ubicacion),
  },
  estado: {
    type: String,
    required: true,
    enum: Object.values(EstadoMesa),
    default: EstadoMesa.LIBRE,
  },
});

/*
 * loadClass() vincula los métodos de la clase de dominio Mesa
 * al documento de Mongoose. Así los documentos devueltos por la BD
 * también tienen acceso a los métodos del dominio (si los tuviera).
 */
MesaSchema.loadClass(Mesa);

MesaSchema.index({ restauranteId: 1, numero: 1 }, { unique: true });

export const MesaModel = mongoose.model("Mesa", MesaSchema);
