import { Router } from "express";
import { validateSchema } from "../middlewares/validator.js";
import { reservaSchema } from "../validations/reservaSchema.js";

export const configureReservasRoutes = (reservasController) => {
  const router = Router();

  router.get("/", reservasController.obtenerReservas.bind(reservasController));

  router.get("/disponibilidad", reservasController.obtenerDisponibilidad.bind(reservasController));

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

  router.put("/:id/asistencia", reservasController.registrarAsistencia.bind(reservasController));

  router.delete("/:id", reservasController.eliminarReserva.bind(reservasController));

  return router;
};
