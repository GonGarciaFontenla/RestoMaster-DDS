import mongoose from "mongoose";
import { TipoUsuario } from "../domain/enums/TipoUsuario.js";
import Usuario from "../domain/Usuario.js";

export const UsuarioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  tipo: {
    type: String,
    required: true,
    enum: Object.values(TipoUsuario),
  },
  fechaRegistro: {
    type: Date,
    default: Date.now,
  },
});

UsuarioSchema.loadClass(Usuario);

export const UsuarioModel = mongoose.model("Usuario", UsuarioSchema);
