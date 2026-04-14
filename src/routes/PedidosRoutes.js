import { Router } from "express";
import { authenticate, requireRole } from "../middlewares/auth.js";
import { TipoUsuario } from "../domain/enums/TipoUsuario.js";

export const configurePedidosRoutes = (pedidosController) => {
  const router = Router();

  router.post(
    "/",
    authenticate,
    requireRole(TipoUsuario.ADMIN, TipoUsuario.MOZO),
    pedidosController.crearPedido.bind(pedidosController),
  );

  router.get(
    "/active",
    authenticate,
    requireRole(TipoUsuario.ADMIN, TipoUsuario.MOZO, TipoUsuario.COCINERO),
    pedidosController.getPedidosActivos.bind(pedidosController),
  );

  router.patch(
    "/:id/items",
    authenticate,
    requireRole(TipoUsuario.ADMIN, TipoUsuario.MOZO),
    pedidosController.agregarItems.bind(pedidosController),
  );

  router.patch(
    "/:id/status",
    authenticate,
    requireRole(TipoUsuario.ADMIN, TipoUsuario.MOZO, TipoUsuario.COCINERO),
    pedidosController.actualizarEstado.bind(pedidosController),
  );

  return router;
};
