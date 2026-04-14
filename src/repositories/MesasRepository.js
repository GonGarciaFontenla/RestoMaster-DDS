import { MesaModel } from "../schemas/MesaSchema.js";

export class MesasRepository {
  async findAll(restauranteId) {
    return await MesaModel.find({ restauranteId });
  }

  async findByIdAndRestaurante(id, restauranteId) {
    return await MesaModel.findOne({ _id: id, restauranteId });
  }

  async findByNumeroAndRestaurante(numero, restauranteId) {
    return await MesaModel.findOne({ numero, restauranteId });
  }

  async create(datosMesa) {
    const nuevaMesa = new MesaModel(datosMesa);
    return await nuevaMesa.save();
  }

  async findAndUpdate(id, datosNuevos, restauranteId) {
    return await MesaModel.findOneAndUpdate(
      { _id: id, restauranteId },
      datosNuevos,
      { new: true },
    );
  }
}
