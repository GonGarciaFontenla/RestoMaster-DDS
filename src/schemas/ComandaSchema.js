import mongoose from "mongoose";
import { EstadoComanda } from "../domain/enums/EstadoComanda.js";
import Comanda from "../domain/Comanda.js";
import { ItemComandaSchema } from "./ItemComandaSchema.js";

export const ComandaSchema = new mongoose.Schema({
  mozo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  mesa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mesa",
    required: true,
    index: true,
  },
  estado: {
    type: String,
    required: true,
    enum: Object.values(EstadoComanda),
    default: EstadoComanda.ABIERTA,
  },
  fechaApertura: {
    type: Date,
    default: Date.now,
  },
  items: [ItemComandaSchema],
});

ComandaSchema.loadClass(Comanda);

export const ComandaModel = mongoose.model("Comanda", ComandaSchema);
