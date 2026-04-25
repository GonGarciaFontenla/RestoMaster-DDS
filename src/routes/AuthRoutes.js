import { Router } from "express";
import { authenticate } from "../middlewares/auth.js";
import { validateSchema } from "../middlewares/validator.js";
import { loginSchema } from "../validations/loginSchema.js";

export const configureAuthRoutes = (userController) => {
  const router = Router();

  router.post(
    "/login",
    validateSchema(loginSchema),
    userController.login.bind(userController),
  );

  router.get(
    "/me",
    authenticate,
    userController.getCurrentUser.bind(userController),
  );

  router.post(
    "/logout",
    authenticate,
    userController.logout.bind(userController),
  );

  return router;
};
