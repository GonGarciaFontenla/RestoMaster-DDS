// Fix #15: se agrega validateQuery para validar parámetros de req.query
// (ej: GET /api/reservas/disponibilidad?fecha=...&hora=...&cantidadComensales=...)
// validateSchema solo cubre req.body, dejando sin protección a los endpoints GET.

export const validateSchema = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const erroresFormateados = result.error.issues.map((issue) => ({
        campo: issue.path.join("."),
        mensaje: issue.message,
      }));

      return res.status(400).json({
        estado: "error",
        tipo: "ErrorDeValidacion",
        mensaje: "Los datos enviados no son válidos",
        detalles: erroresFormateados,
      });
    }

    req.body = result.data;
    next();
  };
};

export const validateQuery = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const erroresFormateados = result.error.issues.map((issue) => ({
        campo: issue.path.join("."),
        mensaje: issue.message,
      }));

      return res.status(400).json({
        estado: "error",
        tipo: "ErrorDeValidacion",
        mensaje: "Los parámetros de consulta no son válidos",
        detalles: erroresFormateados,
      });
    }

    req.query = result.data;
    next();
  };
};
