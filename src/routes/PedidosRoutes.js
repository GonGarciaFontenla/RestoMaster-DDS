import { Router } from "express";
import { z } from "zod";
import { validateSchema } from "../middlewares/validator.js";
import { actualizarEstadoSchema } from "../validations/actualizarEstadoSchema.js";
import { crearComandaSchema, disponibilidadSchema } from "../validations/crearComandaSchema.js";
import { itemComandaSchema } from "../validations/itemComandaSchema.js";

export const configurePedidosRoutes = (pedidosController) => {
  const router = Router();

  // Fix #4: se agrega crearComandaSchema para validar mesa y mozoId,
  // evitando que CastErrors de Mongoose lleguen con mensajes poco claros.
  router.post(
    "/",
    validateSchema(crearComandaSchema),
    pedidosController.crearPedido.bind(pedidosController),
  );

  // IMPORTANTE: /active ANTES que /:id para evitar que Express
  // interprete "active" como un parámetro de ID dinámico.
  router.get("/active", pedidosController.getPedidosActivos.bind(pedidosController));

  router.patch(
    "/:id/items",
    validateSchema(
      z.object({
        items: itemComandaSchema.array().min(1, "Se debe enviar al menos un ítem"),
      })
    ),
    pedidosController.agregarItems.bind(pedidosController),
  );

  router.patch(
    "/:id/status",
    validateSchema(actualizarEstadoSchema),
    pedidosController.actualizarEstado.bind(pedidosController),
  );

  return router;
};
