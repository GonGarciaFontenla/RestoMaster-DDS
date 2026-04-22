import { ProductoModel } from "../schemas/ProductoSchema.js";

export class MenuRepository {
  // Fix #17: se escapa el input para prevenir ReDoS.
  // Un nombre como "(a+)+" pasado sin escapar crea una regex catastrófica.
  async findByNombre(nombre) {
    const escaped = nombre.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return await ProductoModel.findOne({
      nombre: { $regex: new RegExp(`^${escaped}$`, "i") },
    });
  }

  async findById(id) {
    return await ProductoModel.findOne({ _id: id });
  }

  async create(platoData) {
    const nuevoPlato = new ProductoModel(platoData);
    return await nuevoPlato.save();
  }

  async findAll(filtros = {}) {
    return await ProductoModel.find(filtros);
  }

  // Fix #8 y #18: se usa $set para evitar operator injection y
  // runValidators para que Mongoose aplique las validaciones del schema en updates.
  async findAndUpdate(id, datosNuevos) {
    return await ProductoModel.findOneAndUpdate(
      { _id: id },
      { $set: datosNuevos },
      { new: true, runValidators: true },
    );
  }
}
