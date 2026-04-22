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
  // Fix #9: campo password faltante — sin esto Mongoose descarta la contraseña
  // silenciosamente al guardar, creando usuarios sin autenticación posible.
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
