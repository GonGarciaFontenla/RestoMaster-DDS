import { UserREST } from "../dtos/UserDTO.js";

export default class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  async createUser(req, res, next) {
    try {
      const newUser = await this.userService.register(req.body);

      return res.status(201).json({
        estado: "success",
        mensaje: "Usuario creado exitosamente",
        user: UserREST(newUser),
      });
    } catch (err) {
      next(err);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await this.userService.retrieveUsers(req.query);

      return res.status(200).json({
        estado: "success",
        mensaje: "Usuarios devueltos exitosamente",
        empleados: users.map((u) => UserREST(u)),
      });
    } catch (err) {
      next(err);
    }
  }

  async updateUser(req, res, next) {
    try {
      const updatedUser = await this.userService.updateUser(req.params.id, req.body);

      return res.status(200).json({
        estado: "success",
        mensaje: "Usuario actualizado exitosamente",
        user: UserREST(updatedUser),
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteUser(req, res, next) {
    try {
      await this.userService.deleteUser(req.params.id);

      return res.status(200).json({
        estado: "success",
        mensaje: "Usuario eliminado exitosamente",
      });
    } catch (err) {
      next(err);
    }
  }
}
