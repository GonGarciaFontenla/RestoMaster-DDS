import { Router } from "express";
import { z } from "zod";
import { validateSchema } from "../middlewares/validator.js";
import { actualizarEstadoSchema } from "../validations/actualizarEstadoSchema.js";
import { itemComandaSchema } from "../validations/itemComandaSchema.js";

export const configurePedidosRoutes = (pedidosController) => {
  const router = Router();

  // IMPORTANTE: /active debe registrarse ANTES que /:id para que Express
  // no interprete la cadena "active" como un parámetro de ID dinámico.
  router.get("/active", pedidosController.getPedidosActivos.bind(pedidosController));

  router.post("/", pedidosController.crearPedido.bind(pedidosController));

  // Fix #5: se agrega validación del body para garantizar que el estado enviado
  // sea un valor del enum EstadoComanda o EstadoCocina (no cualquier string arbitrario).
  router.patch(
    "/:id/status",
    validateSchema(actualizarEstadoSchema),
    pedidosController.actualizarEstado.bind(pedidosController),
  );

  router.patch(
    "/:id/items",
    validateSchema(
      // El body esperado es { items: [ { producto, cantidad }, ... ] }
      // Se valida que items sea un array no vacío de itemComandaSchema
      z.object({
        items: itemComandaSchema.array().min(1, "Se debe enviar al menos un ítem"),
      })
    ),
    pedidosController.agregarItems.bind(pedidosController),
  );

  return router;
};
