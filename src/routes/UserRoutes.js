import { Router } from "express";
import { authenticate, requireRole } from "../middlewares/auth.js";
import { validateSchema } from "../middlewares/validator.js";
import { usuarioSchema } from "../validations/userSchema.js";
import { TipoUsuario } from "../domain/enums/TipoUsuario.js";

export const configureUserRoutes = (userController) => {
  const router = Router();

  router.post(
    "/",
    authenticate,
    requireRole(TipoUsuario.ADMIN),
    validateSchema(usuarioSchema),
    userController.createUser.bind(userController),
  );

  router.get(
    "/",
    authenticate,
    requireRole(TipoUsuario.ADMIN),
    userController.getUsers.bind(userController),
  );

  router.put(
    "/:id",
    authenticate,
    requireRole(TipoUsuario.ADMIN),
    validateSchema(usuarioSchema.partial()),
    userController.updateUser.bind(userController),
  );

  router.delete(
    "/:id",
    authenticate,
    requireRole(TipoUsuario.ADMIN),
    userController.deleteUser.bind(userController),
  );

  return router;
};
