import { UsuarioModel } from "../schemas/UsuarioSchema.js";

export class UserRepository {
  async findByEmail(email) {
    return await UsuarioModel.findOne({ email });
  }

  async create(userData) {
    const newUser = new UsuarioModel(userData);
    return await newUser.save();
  }

  async findAll(filtros = {}) {
    return await UsuarioModel.find(filtros).select("-password");
  }

  async findById(id) {
    return await UsuarioModel.findById(id);
  }

  async update(id, updateData) {
    return await UsuarioModel.findByIdAndUpdate(id, updateData, {
      new: true,
    }).select("-password");
  }

  async delete(id) {
    return await UsuarioModel.findByIdAndDelete(id);
  }
}
