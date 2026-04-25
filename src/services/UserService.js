import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CredencialesInvalidas } from "../errors/AuthError.js";
import { ExistentResource, NotFoundError } from "../errors/GeneralErrors.js";

export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async login(email, password) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new CredencialesInvalidas();

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new CredencialesInvalidas();

    const token = jwt.sign(
      { id: user._id, tipo: user.tipo },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    const { password: _, ...userSinPassword } = user._doc ?? user;
    return { token, user: userSinPassword };
  }

  async register(newUserData) {
    const usuarioExistente = await this.userRepository.findByEmail(
      newUserData.email,
    );
    if (usuarioExistente) throw new ExistentResource("El usuario");

    const hashedPassword = await bcrypt.hash(newUserData.password, 10);
    return await this.userRepository.create({
      ...newUserData,
      password: hashedPassword,
    });
  }

  async retrieveUsers(queryParametros = {}) {
    const filtros = {};
    if (queryParametros.tipo) filtros.tipo = queryParametros.tipo;
    if (queryParametros.nombre) filtros.nombre = queryParametros.nombre;
    return await this.userRepository.findAll(filtros);
  }

  async getUserById(id) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundError("El usuario");
    return user;
  }

  async updateUser(id, updateData) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundError("El usuario");

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    return await this.userRepository.update(id, updateData);
  }

  async deleteUser(id) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundError("El usuario");
    return await this.userRepository.delete(id);
  }
}
