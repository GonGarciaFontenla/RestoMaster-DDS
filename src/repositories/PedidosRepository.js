import { ComandaModel } from "../schemas/ComandaSchema.js";
import { EstadoComanda } from "../domain/enums/EstadoComanda.js";

export class PedidosRepository {
  async create(data) {
    const comanda = new ComandaModel(data);
    return await comanda.save();
  }

  async findActivos() {
    return await ComandaModel.find({ estado: EstadoComanda.ABIERTA })
      .populate("mozo", "name")
      .populate("mesa", "numero ubicacion")
      .populate("items.producto", "nombre precio");
  }

  async findByMesa(mesaId) {
    return await ComandaModel.findOne({
      mesa: mesaId,
      estado: EstadoComanda.ABIERTA,
    })
      .populate("mozo", "name")
      .populate("mesa", "numero ubicacion")
      .populate("items.producto", "nombre precio");
  }

  async findById(id) {
    return await ComandaModel.findOne({ _id: id });
  }

  async addItems(id, items) {
    return await ComandaModel.findOneAndUpdate(
      { _id: id },
      { $push: { items: { $each: items } } },
      { new: true, runValidators: true }, // Fix #18
    );
  }

  // Fix #8: se usa $set explícito para evitar que operator injection sobreescriba campos
  async updateEstado(id, estado) {
    return await ComandaModel.findOneAndUpdate(
      { _id: id },
      { $set: { estado } },
      { new: true, runValidators: true }, // Fix #18
    );
  }

  async updateItemEstado(id, itemId, estadoItem) {
    return await ComandaModel.findOneAndUpdate(
      { _id: id, "items._id": itemId },
      { $set: { "items.$.estado": estadoItem } },
      { new: true, runValidators: true }, // Fix #18
    );
  }
}
