import { Router } from "express";
// Fix #10: ambos imports del mismo módulo fusionados en una sola declaración
import { authenticate, requireRole } from "../middlewares/auth.js";
import { validateSchema } from "../middlewares/validator.js";
import { usuarioSchema } from "../validations/userSchema.js";
import { loginSchema } from "../validations/loginSchema.js";
import { TipoUsuario } from "../domain/enums/TipoUsuario.js";

export const configureAuthRoutes = (userController) => {
  const router = Router();

  // Fix #20 y #3: se agrega validateSchema para que la validación de credenciales
  // sea responsabilidad de la capa de esquemas (Zod) y no del controller.
  router.post("/login", validateSchema(loginSchema), userController.login.bind(userController));

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
