import { Router } from "express";

export const configurePedidosRoutes = (pedidosController) => {
  const router = Router();

  router.post("/", pedidosController.crearPedido.bind(pedidosController));

  router.get("/active", pedidosController.getPedidosActivos.bind(pedidosController));

  router.patch("/:id/items", pedidosController.agregarItems.bind(pedidosController));

  router.patch("/:id/status", pedidosController.actualizarEstado.bind(pedidosController));

  return router;
};
