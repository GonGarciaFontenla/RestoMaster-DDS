import { Router } from "express";
import { z } from "zod";
import { validateSchema } from "../middlewares/validator.js";
import { actualizarEstadoSchema } from "../validations/actualizarEstadoSchema.js";
import { itemComandaSchema } from "../validations/itemComandaSchema.js";

export const configurePedidosRoutes = (pedidosController) => {
  const router = Router();

  router.post("/", pedidosController.crearPedido.bind(pedidosController));

  // IMPORTANTE: /active ANTES que /:id para evitar que Express
  // interprete "active" como un parámetro de ID dinámico.
  router.get("/active", pedidosController.getPedidosActivos.bind(pedidosController));

  // Fix #5: schema de validación para que los ítems tengan formato correcto.
  // El body esperado es { items: [ { producto, cantidad } ] }
  router.patch(
    "/:id/items",
    validateSchema(
      z.object({
        items: itemComandaSchema.array().min(1, "Se debe enviar al menos un ítem"),
      })
    ),
    pedidosController.agregarItems.bind(pedidosController),
  );

  // Fix #5: schema de validación para impedir estados arbitrarios en el repositorio
  router.patch(
    "/:id/status",
    validateSchema(actualizarEstadoSchema),
    pedidosController.actualizarEstado.bind(pedidosController),
  );

  return router;
};
