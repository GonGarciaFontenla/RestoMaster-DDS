import { Router } from "express";
import { validateSchema } from "../middlewares/validator.js";
import { validateQuery } from "../middlewares/validator.js";
import { reservaSchema } from "../validations/reservaSchema.js";
import { asistenciaSchema } from "../validations/asistenciaSchema.js";
import { disponibilidadSchema } from "../validations/crearComandaSchema.js";

export const configureReservasRoutes = (reservasController) => {
  const router = Router();

  router.get("/", reservasController.obtenerReservas.bind(reservasController));

  // Fix #2: se validan os query params antes de llegar al controller
  // para que parseInt nunca reciba undefined y devuelva NaN.
  router.get(
    "/disponibilidad",
    validateQuery(disponibilidadSchema),
    reservasController.obtenerDisponibilidad.bind(reservasController),
  );

  router.post(
    "/",
    validateSchema(reservaSchema),
    reservasController.crearReserva.bind(reservasController),
  );

  router.get("/:id", reservasController.obtenerReservaById.bind(reservasController));

  router.put(
    "/:id",
    validateSchema(reservaSchema.partial()),
    reservasController.actualizarReserva.bind(reservasController),
  );

  router.put("/:id/confirmar", reservasController.confirmarReserva.bind(reservasController));

  router.put("/:id/cancelar", reservasController.cancelarReserva.bind(reservasController));

  router.put(
    "/:id/asistencia",
    validateSchema(asistenciaSchema),
    reservasController.registrarAsistencia.bind(reservasController),
  );

  router.delete("/:id", reservasController.eliminarReserva.bind(reservasController));

  return router;
};
