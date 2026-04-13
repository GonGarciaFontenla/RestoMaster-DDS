import { Router } from "express";
import { validateSchema } from "../middlewares/validator.js";
import { productoSchema } from "../validations/productoSchema.js";

export const configureMenuRoutes = (menuController) => {
  const router = Router();

  router.get("/", menuController.getMenu.bind(menuController));

  router.post(
    "/",
    validateSchema(productoSchema),
    menuController.addPlato.bind(menuController),
  );

  router.put(
    "/:id",
    validateSchema(productoSchema.partial()),
    menuController.modificarPlato.bind(menuController),
  );

  return router;
};
