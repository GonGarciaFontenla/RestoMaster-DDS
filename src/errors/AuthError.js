import AppError from "./AppError.js";

export class CredencialesInvalidas extends AppError {
  constructor(mensaje = "El email o la contraseña son incorrectos.") {
    super(mensaje, 401);
    this.name = "CredencialesInvalidas";
  }
}
