import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ estado: "error", mensaje: "No autenticado" });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    req.restauranteId = req.user.restauranteId;
    next();
  } catch {
    return res.status(403).json({ estado: "error", mensaje: "Token inválido o expirado" });
  }
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    // Fix #1: guarda defensiva por si requireRole se usa sin authenticate previo
    if (!req.user || !roles.includes(req.user.tipo)) {
      return res.status(403).json({ estado: "error", mensaje: "No autorizado" });
    }
    next();
  };
};
