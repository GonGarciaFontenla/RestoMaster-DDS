import { Router } from "express";
import { z } from "zod";
import { validateSchema } from "../middlewares/validator.js";
import { actualizarEstadoSchema } from "../validations/actualizarEstadoSchema.js";
import { itemComandaSchema } from "../validations/itemComandaSchema.js";
import { comandaSchema } from "../validations/comandaSchema.js";

export const configurePedidosRoutes = (pedidosController) => {
  const router = Router();

  router.post(
    "/",
    validateSchema(comandaSchema.pick({ mozo: true, mesa: true })),
    pedidosController.crearPedido.bind(pedidosController),
  );

  router.patch(
    "/:id/status",
    validateSchema(actualizarEstadoSchema),
    pedidosController.actualizarEstado.bind(pedidosController),
  );

  router.patch(
    "/:id/items",
    validateSchema(
      z.object({
        items: itemComandaSchema
          .array()
          .min(1, "Se debe enviar al menos un ítem"),
      }),
    ),
    pedidosController.agregarItems.bind(pedidosController),
  );

  return router;
};
