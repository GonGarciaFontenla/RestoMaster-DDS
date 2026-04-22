// Fix #14: se agrega validateQuery para validar parámetros de req.query (ej: GET /disponibilidad)
// El validador original solo cubría req.body, dejando sin protección a los endpoints GET con filtros.

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
