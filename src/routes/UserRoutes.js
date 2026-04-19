import { Router } from "express";

export const configureUserRoutes = (userController) => {
  const router = Router();

  router.post("/", userController.createUser.bind(userController));
  router.get("/", userController.getUsers.bind(userController));
  router.put("/:id", userController.updateUser.bind(userController));
  router.delete("/:id", userController.deleteUser.bind(userController));

  return router;
};
