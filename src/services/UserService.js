import bcrypt from "bcrypt";
import { ExistentResource, NotFoundError } from "../errors/GeneralErrors.js";

export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  // Fix #11: se agrega hashing de contraseña con bcrypt.
  // Sin esto, las contraseñas se guardan en texto plano en MongoDB.
  async register(newUserData) {
    const usuarioExistente = await this.userRepository.findByEmail(newUserData.email);
    if (usuarioExistente) {
      throw new ExistentResource("El usuario");
    }
    const hashedPassword = await bcrypt.hash(newUserData.password, 10);
    return await this.userRepository.create({ ...newUserData, password: hashedPassword });
  }

  async retrieveUsers(queryParametros = {}) {
    const filtros = {};
    if (queryParametros.tipo) filtros.tipo = queryParametros.tipo;
    if (queryParametros.name) filtros.name = queryParametros.name;
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

    // Si se actualiza la contraseña, también se hashea
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
