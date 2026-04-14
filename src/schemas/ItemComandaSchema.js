import mongoose from "mongoose";
import { EstadoCocina } from "../domain/enums/EstadoCocina.js";
import ItemComanda from "../domain/ItemComanda.js";

/*
 * ItemComandaSchema es un subdocumento: no tiene colección propia en MongoDB.
 * Vive embebido dentro del documento de Comanda (campo `items`).
 * Esto refleja la relación de composición entre Comanda e ItemComanda.
 */
export const ItemComandaSchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Producto",
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
    min: 1,
  },
  precioUnitario: {
    type: Number,
    required: true,
    min: 0,
  },
  estado: {
    type: String,
    required: true,
    enum: Object.values(EstadoCocina),
    default: EstadoCocina.PENDIENTE,
  },
});

ItemComandaSchema.loadClass(ItemComanda);
