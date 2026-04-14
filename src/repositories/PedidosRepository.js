import { ComandaModel } from "../schemas/ComandaSchema.js";
import { EstadoComanda } from "../domain/enums/EstadoComanda.js";

export class PedidosRepository {
  async create(data) {
    const comanda = new ComandaModel(data);
    return await comanda.save();
  }

  async findActivos(restauranteId) {
    return await ComandaModel.find({ restauranteId, estado: EstadoComanda.ABIERTA })
      .populate("mozo", "name")
      .populate("mesa", "numero ubicacion")
      .populate("items.producto", "nombre precio");
  }

  async findByMesaAndRestaurante(mesaId, restauranteId) {
    return await ComandaModel.findOne({
      mesa: mesaId,
      restauranteId,
      estado: EstadoComanda.ABIERTA,
    })
      .populate("mozo", "name")
      .populate("mesa", "numero ubicacion")
      .populate("items.producto", "nombre precio");
  }

  async findByIdAndRestaurante(id, restauranteId) {
    return await ComandaModel.findOne({ _id: id, restauranteId });
  }

  async addItems(id, restauranteId, items) {
    return await ComandaModel.findOneAndUpdate(
      { _id: id, restauranteId },
      { $push: { items: { $each: items } } },
      { new: true },
    );
  }

  async updateEstado(id, restauranteId, estado) {
    return await ComandaModel.findOneAndUpdate(
      { _id: id, restauranteId },
      { estado },
      { new: true },
    );
  }

  async updateItemEstado(id, restauranteId, itemId, estadoItem) {
    return await ComandaModel.findOneAndUpdate(
      { _id: id, restauranteId, "items._id": itemId },
      { $set: { "items.$.estado": estadoItem } },
      { new: true },
    );
  }
}
