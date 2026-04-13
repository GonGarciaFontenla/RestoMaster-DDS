/**
 * Clase base para todos los errores personalizados de la aplicación.
 * Extiende la clase nativa Error de JavaScript.
 *
 * Al heredar de esta clase, todos nuestros errores tendrán:
 *  - Un mensaje descriptivo (heredado de Error)
 *  - Un código HTTP de estado asociado
 *  - El flag isOperational=true para distinguir errores esperados de bugs
 *  - Una traza de pila correcta gracias a Error.captureStackTrace
 */
export default class AppError extends Error {
  constructor(mensaje, statusCode) {
    super(mensaje); // Llama al constructor de Error con el mensaje
    this.statusCode = statusCode;
    this.isOperational = true; // Flag que indica que es un error controlado (no un bug)
    Error.captureStackTrace(this, this.constructor); // Limpia el stack trace
  }
}
