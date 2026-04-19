import { Router } from "express";
import { validateSchema } from "../middlewares/validator.js";
import { mesaSchema } from "../validations/mesaSchema.js";

export const configureMesasRoutes = (mesasController, pedidosController) => {
  const router = Router();

  router.get(
    "/",
    mesasController.getMesas.bind(mesasController),
  );

  router.post(
    "/",
    validateSchema(mesaSchema),
    mesasController.createMesa.bind(mesasController),
  );

  router.put(
    "/:id",
    validateSchema(mesaSchema.partial()),
    mesasController.actualizarMesa.bind(mesasController),
  );

  router.get(
    "/:tableId/pedidos",
    pedidosController.getPedidoPorMesa.bind(pedidosController),
  );

  return router;
};
