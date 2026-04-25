import { z } from "zod";
import { TipoUsuario } from "../domain/enums/TipoUsuario.js";

export const usuarioSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  email: z.string().email("Debe ser un email válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  tipo: z.nativeEnum(TipoUsuario, {
    errorMap: () => ({ message: "Tipo de usuario no válido" }),
  }),
});
