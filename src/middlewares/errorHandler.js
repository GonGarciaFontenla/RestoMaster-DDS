import AppError from "../errors/AppError.js";

export const errorHandler = (err, req, res, next) => {
  console.error("🔥 ERROR:", err.stack || err.message);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      estado: "error",
      tipo: err.name,
      mensaje: err.message,
    });
  }

  return res.status(500).json({
    estado: "error",
    tipo: "InternalServerError",
    mensaje: "Ocurrió un error inesperado en el servidor.",
  });
};
