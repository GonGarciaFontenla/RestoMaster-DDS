import { Router } from "express";
import { z } from "zod";
import { authenticate, requireRole } from "../middlewares/auth.js";
import { validateSchema } from "../middlewares/validator.js";
import { actualizarEstadoSchema } from "../validations/actualizarEstadoSchema.js";
import { itemComandaSchema } from "../validations/itemComandaSchema.js";
import { TipoUsuario } from "../domain/enums/TipoUsuario.js";

export const configurePedidosRoutes = (pedidosController) => {
  const router = Router();

  // IMPORTANTE: /active debe estar registrada ANTES que /:id para que Express
  // no interprete la cadena "active" como un parámetro de ID dinámico.
  router.get(
    "/active",
    authenticate,
    requireRole(TipoUsuario.ADMIN, TipoUsuario.MOZO, TipoUsuario.COCINERO),
    pedidosController.getPedidosActivos.bind(pedidosController),
  );

  router.post(
    "/",
    authenticate,
    requireRole(TipoUsuario.ADMIN, TipoUsuario.MOZO),
    pedidosController.crearPedido.bind(pedidosController),
  );

  // Fix #6: se agrega schema de validación para garantizar que los ítems
  // tengan el formato correcto antes de llegar al servicio.
  router.patch(
    "/:id/items",
    authenticate,
    requireRole(TipoUsuario.ADMIN, TipoUsuario.MOZO),
    validateSchema(
      z.object({
        items: itemComandaSchema.array().min(1, "Se debe enviar al menos un ítem"),
      })
    ),
    pedidosController.agregarItems.bind(pedidosController),
  );

  // Fix #6: se agrega schema de validación para impedir que llegue
  // un estado arbitrario (string libre) al repositorio.
  router.patch(
    "/:id/status",
    authenticate,
    requireRole(TipoUsuario.ADMIN, TipoUsuario.MOZO, TipoUsuario.COCINERO),
    validateSchema(actualizarEstadoSchema),
    pedidosController.actualizarEstado.bind(pedidosController),
  );

  return router;
};
