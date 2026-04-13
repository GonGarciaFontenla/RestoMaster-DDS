import AppError from "./AppError.js";

/**
 * Error de Regla de Negocio.
 * Se lanza cuando se viola una regla del dominio (ej: cerrar comanda con ítems pendientes).
 *
 * HTTP Status: 400 Bad Request
 *
 * Ejemplo de uso:
 *   throw new BusinessRuleError("No se puede cerrar la comanda: hay platos en preparación.");
 */
export default class BusinessRuleError extends AppError {
  constructor(mensaje) {
    super(mensaje, 400);
    this.name = "BusinessRuleError"; // Identifica el tipo de error en los logs
  }
}
