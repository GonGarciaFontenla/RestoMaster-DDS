import { UserREST } from "../dtos/UserDTO.js";

export default class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { token, user } = await this.userService.login(email, password);

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        estado: "success",
        user: UserREST(user),
      });
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      return res
        .status(200)
        .json({ estado: "success", mensaje: "Sesión cerrada" });
    } catch (err) {
      next(err);
    }
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
      const updatedUser = await this.userService.updateUser(
        req.params.id,
        req.body,
      );

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

  async getCurrentUser(req, res, next) {
    try {
      const user = await this.userService.getUserById(req.user.id);

      return res.status(200).json({
        estado: "success",
        user: UserREST(user),
      });
    } catch (err) {
      next(err);
    }
  }
}
