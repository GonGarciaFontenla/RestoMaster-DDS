import jwt from "jsonwebtoken";
import AppError from "../errors/AppError.js";

export const authenticate = (req, res, next) => {
  const token =
    req.cookies?.token || req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return next(new AppError("No autenticado", 401));
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return next(new AppError("Token inválido o expirado", 401));
  }
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.tipo)) {
      return next(new AppError("No autorizado", 403));
    }
    next();
  };
};
