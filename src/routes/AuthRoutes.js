import { Router } from "express";
import { authenticate } from "../middlewares/auth.js";
import { validateSchema } from "../middlewares/validator.js";
import { usuarioSchema } from "../validations/userSchema.js";
import { TipoUsuario } from "../domain/enums/TipoUsuario.js";
import { requireRole } from "../middlewares/auth.js";

export const configureAuthRoutes = (userController) => {
  const router = Router();

  router.post("/login", userController.login.bind(userController));

  router.get("/me", authenticate, userController.getCurrentUser.bind(userController));

  router.post("/logout", authenticate, userController.logout.bind(userController));

  return router;
};

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
