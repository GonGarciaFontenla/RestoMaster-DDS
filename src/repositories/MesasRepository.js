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

  // Fix #8 y #18: $set previene operator injection y runValidators aplica
  // las reglas del schema (enum, min, etc.) también en actualizaciones.
  async findAndUpdate(id, datosNuevos) {
    return await MesaModel.findOneAndUpdate(
      { _id: id },
      { $set: datosNuevos },
      { new: true, runValidators: true },
    );
  }
}
