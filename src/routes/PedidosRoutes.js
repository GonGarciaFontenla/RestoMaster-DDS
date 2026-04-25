import { Router } from "express";
import { z } from "zod";
import { authenticate, requireRole } from "../middlewares/auth.js";
import { validateSchema } from "../middlewares/validator.js";
import { actualizarEstadoSchema } from "../validations/actualizarEstadoSchema.js";
import { itemComandaSchema } from "../validations/itemComandaSchema.js";
import { comandaSchema } from "../validations/comandaSchema.js";
import { TipoUsuario } from "../domain/enums/TipoUsuario.js";

export const configurePedidosRoutes = (pedidosController) => {
  const router = Router();

  router.post(
    "/",
    authenticate,
    requireRole(TipoUsuario.ADMIN, TipoUsuario.MOZO),
    validateSchema(comandaSchema.pick({ mozo: true, mesa: true })),
    pedidosController.crearPedido.bind(pedidosController),
  );

  router.patch(
    "/:id/items",
    authenticate,
    requireRole(TipoUsuario.ADMIN, TipoUsuario.MOZO),
    validateSchema(
      z.object({
        items: itemComandaSchema
          .array()
          .min(1, "Se debe enviar al menos un ítem"),
      }),
    ),
    pedidosController.agregarItems.bind(pedidosController),
  );

  router.patch(
    "/:id/status",
    authenticate,
    requireRole(TipoUsuario.ADMIN, TipoUsuario.MOZO, TipoUsuario.COCINERO),
    validateSchema(actualizarEstadoSchema),
    pedidosController.actualizarEstado.bind(pedidosController),
  );

  return router;
};
