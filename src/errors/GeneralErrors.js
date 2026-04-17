import AppError from "./AppError.js";

export class NotFoundError extends AppError {
  constructor(recurso) {
    super(`${recurso} no encontrado en el sistema.`, 404);
    this.name = "NotFoundError";
  }
}

export class ExistentResource extends AppError {
  constructor(recurso) {
    super(`${recurso} ya existe en el sistema.`, 400);
    this.name = "ExistentResource";
  }
}

export class NonExistentResource extends AppError {
  constructor(recurso) {
    super(`${recurso} no existe en el sistema.`, 400);
    this.name = "NonExistentResource";
  }
}
