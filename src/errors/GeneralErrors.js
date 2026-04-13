import AppError from "./AppError.js";

/**
 * Error de recurso no encontrado.
 * Se lanza al buscar una entidad por ID u otro criterio y no existe en el sistema.
 *
 * HTTP Status: 404 Not Found
 *
 * Ejemplo de uso:
 *   throw new NotFoundError("Mesa");
 *   // → "Mesa no encontrada en el sistema"
 */
export class NotFoundError extends AppError {
  constructor(recurso) {
    super(`${recurso} no encontrado en el sistema.`, 404);
    this.name = "NotFoundError";
  }
}

/**
 * Error de recurso ya existente.
 * Se lanza al intentar crear una entidad que ya existe (ej: email duplicado).
 *
 * HTTP Status: 400 Bad Request
 *
 * Ejemplo de uso:
 *   throw new ExistentResource("El email ingresado");
 *   // → "El email ingresado ya existe en el sistema."
 */
export class ExistentResource extends AppError {
  constructor(recurso) {
    super(`${recurso} ya existe en el sistema.`, 400);
    this.name = "ExistentResource";
  }
}

/**
 * Error de recurso inexistente.
 * Se lanza al intentar operar sobre una entidad que no existe (ej: actualizar un producto borrado).
 *
 * HTTP Status: 400 Bad Request
 *
 * Ejemplo de uso:
 *   throw new NonExistentResource("El producto");
 *   // → "El producto no existe en el sistema."
 */
export class NonExistentResource extends AppError {
  constructor(recurso) {
    super(`${recurso} no existe en el sistema.`, 400);
    this.name = "NonExistentResource";
  }
}
