export default class AppError extends Error {
  constructor(mensaje, statusCode) {
    super(mensaje); // Llama al constructor de Error con el mensaje
    this.statusCode = statusCode;
    this.isOperational = true; // Flag que indica que es un error controlado (no un bug)
    Error.captureStackTrace(this, this.constructor); // Limpia el stack trace
  }
}
