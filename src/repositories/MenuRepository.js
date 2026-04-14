import { ProductoModel } from "../schemas/ProductoSchema.js";

export class MenuRepository {
  async findByNombreAndRestaurante(nombre, restauranteId) {
    return await ProductoModel.findOne({
      nombre: { $regex: new RegExp(`^${nombre}$`, "i") },
      restauranteId,
    });
  }

  async findByIdAndRestaurante(id, restauranteId) {
    return await ProductoModel.findOne({ _id: id, restauranteId });
  }

  async create(platoData) {
    const nuevoPlato = new ProductoModel(platoData);
    return await nuevoPlato.save();
  }

  async findAll(filtros = {}) {
    return await ProductoModel.find(filtros);
  }

  async findAndUpdate(id, datosNuevos, restauranteId) {
    return await ProductoModel.findOneAndUpdate(
      { _id: id, restauranteId },
      datosNuevos,
      { new: true },
    );
  }
}
