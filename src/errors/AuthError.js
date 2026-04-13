import AppError from "./AppError.js";

/**
 * Error de Credenciales Inválidas.
 * Se lanza cuando un usuario intenta autenticarse con email o contraseña incorrectos.
 *
 * HTTP Status: 401 Unauthorized
 *
 * Ejemplo de uso:
 *   throw new CredencialesInvalidas(); // usa el mensaje por defecto
 *   throw new CredencialesInvalidas("Token expirado.");
 */
export class CredencialesInvalidas extends AppError {
  constructor(mensaje = "El email o la contraseña son incorrectos.") {
    super(mensaje, 401);
    this.name = "CredencialesInvalidas";
  }
}
