import AppError from "../errors/AppError.js";
import mongoose from "mongoose";

export const errorHandler = (err, req, res, next) => {
  // Fix #14: se loguea el stack trace completo en lugar de solo el mensaje
  console.error("🔥 ERROR:", err.stack || err.message);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      estado: "error",
      tipo: err.name,
      mensaje: err.message,
    });
  }

  // Fix #7: CastError de Mongoose → el ID enviado no tiene formato ObjectId válido.
  // Sin esta guarda, el error llega como 500 genérico con un mensaje poco descriptivo.
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      estado: "error",
      tipo: "ErrorDeValidacion",
      mensaje: `El valor "${err.value}" no es un ID válido para el campo "${err.path}"`,
    });
  }

  return res.status(500).json({
    estado: "error",
    tipo: "InternalServerError",
    mensaje: "Ocurrió un error inesperado en el servidor.",
  });
};
