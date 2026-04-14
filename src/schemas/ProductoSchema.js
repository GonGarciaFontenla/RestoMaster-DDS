import mongoose from "mongoose";
import { CategoriaPlato } from "../domain/enums/CategoriaPlato.js";
import Producto from "../domain/Producto.js";

export const ProductoSchema = new mongoose.Schema({
  restauranteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurante",
    required: true,
    index: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
    min: 0,
  },
  categoria: {
    type: String,
    required: true,
    enum: Object.values(CategoriaPlato),
  },
  vegetariano: {
    type: Boolean,
    default: false,
  },
  celiaco: {
    type: Boolean,
    default: false,
  },
  disponible: {
    type: Boolean,
    default: true,
  },
});

ProductoSchema.loadClass(Producto);

export const ProductoModel = mongoose.model("Producto", ProductoSchema);
