import { MesaModel } from "../schemas/MesaSchema.js";

export class MesasRepository {
  async findAll() {
    return await MesaModel.find({});
  }

  async findById(id) {
    return await MesaModel.findOne({ _id: id });
  }

  async findByNumero(numero) {
    return await MesaModel.findOne({ numero });
  }

  async create(datosMesa) {
    const nuevaMesa = new MesaModel(datosMesa);
    return await nuevaMesa.save();
  }

  async findAndUpdate(id, datosNuevos) {
    return await MesaModel.findOneAndUpdate(
      { _id: id },
      datosNuevos,
      { new: true },
    );
  }
}
