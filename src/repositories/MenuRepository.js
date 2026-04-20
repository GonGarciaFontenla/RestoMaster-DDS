import { ProductoModel } from "../schemas/ProductoSchema.js";

export class MenuRepository {
  async findByNombre(nombre) {
    return await ProductoModel.findOne({
      nombre: { $regex: new RegExp(`^${nombre}$`, "i") },
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

  async findAndUpdate(id, datosNuevos) {
    return await ProductoModel.findOneAndUpdate(
      { _id: id },
      datosNuevos,
      { new: true },
    );
  }
}
