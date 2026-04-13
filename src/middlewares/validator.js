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
