import { Router } from "express";
import { authenticate, requireRole } from "../middlewares/auth.js";
import { validateSchema } from "../middlewares/validator.js";
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

  // Fix #22: se agrega requireRole para que solo ADMIN y MOZO puedan crear reservas
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

  // Fix #7: se agrega validateSchema para proteger el endpoint de bodies malformados
  // (sin estado o con estado inválido que causaba BusinessRuleError confuso)
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
