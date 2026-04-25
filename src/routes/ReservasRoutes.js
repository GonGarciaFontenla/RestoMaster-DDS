import { Router } from "express";
import { authenticate, requireRole } from "../middlewares/auth.js";
import { validateQuery, validateSchema } from "../middlewares/validator.js";
import { reservaSchema } from "../validations/reservaSchema.js";
import { asistenciaSchema } from "../validations/asistenciaSchema.js";
import { TipoUsuario } from "../domain/enums/TipoUsuario.js";

export const configureReservasRoutes = (reservasController) => {
  const router = Router();

  router.get(
    "/",
    authenticate,
    requireRole(TipoUsuario.ADMIN, TipoUsuario.MOZO),
    reservasController.obtenerReservas.bind(reservasController),
  );

  router.get(
    "/disponibilidad",
    authenticate,
    reservasController.obtenerDisponibilidad.bind(reservasController),
  );

  router.post(
    "/",
    authenticate,
    requireRole(TipoUsuario.ADMIN, TipoUsuario.MOZO),
    validateSchema(reservaSchema),
    reservasController.crearReserva.bind(reservasController),
  );

  router.get(
    "/:id",
    authenticate,
    requireRole(TipoUsuario.ADMIN, TipoUsuario.MOZO),
    reservasController.obtenerReservaById.bind(reservasController),
  );

  router.put(
    "/:id",
    authenticate,
    requireRole(TipoUsuario.ADMIN, TipoUsuario.MOZO),
    validateSchema(reservaSchema.partial()),
    reservasController.actualizarReserva.bind(reservasController),
  );

  router.put(
    "/:id/confirmar",
    authenticate,
    requireRole(TipoUsuario.ADMIN, TipoUsuario.MOZO),
    reservasController.confirmarReserva.bind(reservasController),
  );

  router.put(
    "/:id/cancelar",
    authenticate,
    reservasController.cancelarReserva.bind(reservasController),
  );

  router.put(
    "/:id/asistencia",
    authenticate,
    requireRole(TipoUsuario.ADMIN, TipoUsuario.MOZO),
    validateSchema(asistenciaSchema),
    reservasController.registrarAsistencia.bind(reservasController),
  );

  router.delete(
    "/:id",
    authenticate,
    requireRole(TipoUsuario.ADMIN),
    reservasController.eliminarReserva.bind(reservasController),
  );

  return router;
};
