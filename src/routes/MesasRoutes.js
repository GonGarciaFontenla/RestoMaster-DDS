import { Router } from "express";
import { authenticate, requireRole } from "../middlewares/auth.js";
import { validateSchema } from "../middlewares/validator.js";
import { mesaSchema } from "../validations/mesaSchema.js";
import { TipoUsuario } from "../domain/enums/TipoUsuario.js";

export const configureMesasRoutes = (mesasController, pedidosController) => {
  const router = Router();

  router.get(
    "/",
    authenticate,
    requireRole(TipoUsuario.ADMIN, TipoUsuario.MOZO),
    mesasController.getMesas.bind(mesasController),
  );

  router.post(
    "/",
    authenticate,
    requireRole(TipoUsuario.ADMIN),
    validateSchema(mesaSchema),
    mesasController.createMesa.bind(mesasController),
  );

  router.put(
    "/:id",
    authenticate,
    requireRole(TipoUsuario.ADMIN, TipoUsuario.MOZO),
    validateSchema(mesaSchema.partial()),
    mesasController.actualizarMesa.bind(mesasController),
  );

  router.get(
    "/:tableId/pedidos",
    authenticate,
    requireRole(TipoUsuario.ADMIN, TipoUsuario.MOZO),
    pedidosController.getPedidoPorMesa.bind(pedidosController),
  );

  return router;
};
