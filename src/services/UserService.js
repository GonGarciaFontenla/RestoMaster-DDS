import { ExistentResource, NotFoundError } from "../errors/GeneralErrors.js";

export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async register(newUserData) {
    const usuarioExistente = await this.userRepository.findByEmail(newUserData.email);
    if (usuarioExistente) {
      throw new ExistentResource("El usuario");
    }
    return await this.userRepository.create(newUserData);
  }

  // Fix #11: corregido typo "retrive" → "retrieve"
  async retrieveUsers(queryParametros = {}) {
    const filtros = {};
    if (queryParametros.tipo) filtros.tipo = queryParametros.tipo;
    if (queryParametros.name) filtros.name = queryParametros.name;
    return await this.userRepository.findAll(filtros);
  }

  async getUserById(id) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundError("El usuario"); // Fix #1
    return user;
  }

  async updateUser(id, updateData) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundError("El usuario"); // Fix #1
    return await this.userRepository.update(id, updateData);
  }

  async deleteUser(id) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundError("El usuario"); // Fix #1
    return await this.userRepository.delete(id);
  }
}
