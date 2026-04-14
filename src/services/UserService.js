import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CredencialesInvalidas } from "../errors/AuthError.js";
import { ExistentResource, NonExistentResource } from "../errors/GeneralErrors.js";

export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async login(email, password) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new CredencialesInvalidas();
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new CredencialesInvalidas();
    }

    const token = jwt.sign(
      {
        id: user._id,
        tipo: user.tipo,
        restauranteId: user.restauranteId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    return { token, user };
  }

  async register(newUserData) {
    const usuarioExistente = await this.userRepository.findByEmail(newUserData.email);

    if (usuarioExistente) {
      throw new ExistentResource("El usuario");
    }

    const hashedPassword = await bcrypt.hash(newUserData.password, 10);

    return await this.userRepository.create({ ...newUserData, password: hashedPassword });
  }

  async retriveUsers(queryParametros = {}) {
    const filtros = {};

    if (queryParametros.tipo) filtros.tipo = queryParametros.tipo;
    if (queryParametros.name) filtros.name = queryParametros.name;

    return await this.userRepository.findAll(filtros);
  }

  async getUserById(id) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NonExistentResource("El usuario");
    return user;
  }

  async updateUser(id, updateData) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NonExistentResource("El usuario");

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    return await this.userRepository.update(id, updateData);
  }

  async deleteUser(id) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NonExistentResource("El usuario");
    return await this.userRepository.delete(id);
  }
}
