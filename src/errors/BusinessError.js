import AppError from "./AppError.js";

export default class BusinessRuleError extends AppError {
  constructor(mensaje) {
    super(mensaje, 400);
    this.name = "BusinessRuleError"; // Identifica el tipo de error en los logs
  }
}
