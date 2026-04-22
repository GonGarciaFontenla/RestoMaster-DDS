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

  // Fix #8 y #18: $set previene operator injection y runValidators aplica
  // las reglas del schema (unique, enum, etc.) también en actualizaciones.
  async update(id, updateData) {
    return await UsuarioModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    ).select("-password");
  }

  async delete(id) {
    return await UsuarioModel.findByIdAndDelete(id);
  }
}
