import { Router } from "express";
import { validateSchema } from "../middlewares/validator.js";
import { usuarioSchema } from "../validations/userSchema.js";

// Fix #10: se agregan schemas Zod para validar los bodies de creación y actualización
export const configureUserRoutes = (userController) => {
  const router = Router();

  router.post(
    "/",
    validateSchema(usuarioSchema),
    userController.createUser.bind(userController),
  );

  router.get("/", userController.getUsers.bind(userController));

  router.put(
    "/:id",
    validateSchema(usuarioSchema.partial()),
    userController.updateUser.bind(userController),
  );

  router.delete("/:id", userController.deleteUser.bind(userController));

  return router;
};
