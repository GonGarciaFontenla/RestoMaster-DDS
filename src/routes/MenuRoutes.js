import { Router } from "express";
import { authenticate, requireRole } from "../middlewares/auth.js";
import { validateSchema } from "../middlewares/validator.js";
import { productoSchema } from "../validations/productoSchema.js";
import { TipoUsuario } from "../domain/enums/TipoUsuario.js";

export const configureMenuRoutes = (menuController) => {
  const router = Router();

  router.get("/", authenticate, menuController.getMenu.bind(menuController));

  router.post(
    "/",
    authenticate,
    requireRole(TipoUsuario.ADMIN),
    validateSchema(productoSchema),
    menuController.addPlato.bind(menuController),
  );

  router.put(
    "/:id",
    authenticate,
    requireRole(TipoUsuario.ADMIN),
    validateSchema(productoSchema.partial()),
    menuController.modificarPlato.bind(menuController),
  );

  return router;
};
