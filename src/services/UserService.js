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
      { id: user._id, tipo: user.tipo, restauranteId: user.restauranteId },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    return { token, user };
  }

  async register(newUserData) {
    const usuarioExistente = await this.userRepository.findByEmail(newUserData.email);
    if (usuarioExistente) throw new ExistentResource("El usuario");

    const hashedPassword = await bcrypt.hash(newUserData.password, 10);
    return await this.userRepository.create({ ...newUserData, password: hashedPassword });
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
    if (!user) throw new NotFoundError("El usuario"); // Fix #5: 404 en lugar de 400
    return user;
  }

  async updateUser(id, updateData) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundError("El usuario"); // Fix #5

    // Fix #9: se excluye restauranteId para impedir que se cambie de tenant
    // vía este endpoint. El campo "tipo" (rol) se permite solo para admins,
    // cuyo permiso ya está garantizado por requireRole en la ruta.
    const { restauranteId, ...datosPermitidos } = updateData;

    if (datosPermitidos.password) {
      datosPermitidos.password = await bcrypt.hash(datosPermitidos.password, 10);
    }

    return await this.userRepository.update(id, datosPermitidos);
  }

  async deleteUser(id) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundError("El usuario"); // Fix #5
    return await this.userRepository.delete(id);
  }
}
