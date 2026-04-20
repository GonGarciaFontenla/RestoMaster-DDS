import { EstadoComanda } from "../domain/enums/EstadoComanda.js";
import { EstadoCocina } from "../domain/enums/EstadoCocina.js";
import { ExistentResource, NonExistentResource } from "../errors/GeneralErrors.js";
import BusinessRuleError from "../errors/BusinessError.js";

export class PedidosService {
  constructor(pedidosRepository, menuRepository, mesasRepository) {
    this.pedidosRepository = pedidosRepository;
    this.menuRepository = menuRepository;
    this.mesasRepository = mesasRepository;
  }

  async crearPedido({ mesaId, mozoId }) {
    const mesa = await this.mesasRepository.findById(mesaId);
    if (!mesa) {
      throw new NonExistentResource(`La mesa con id: ${mesaId}`);
    }

    const comandaExistente = await this.pedidosRepository.findByMesa(
      mesaId,
    );
    if (comandaExistente) {
      throw new ExistentResource(`Una comanda abierta para la mesa ${mesa.numero}`);
    }

    return await this.pedidosRepository.create({
      mozo: mozoId,
      mesa: mesaId,
      estado: EstadoComanda.ABIERTA,
      fechaApertura: new Date(),
      items: [],
    });
  }

  async getPedidosActivos() {
    return await this.pedidosRepository.findActivos();
  }

  async getPedidoPorMesa(mesaId) {
    const comanda = await this.pedidosRepository.findByMesa(mesaId);
    if (!comanda) {
      throw new NonExistentResource(`Una comanda abierta para la mesa con id: ${mesaId}`);
    }
    return comanda;
  }

  async agregarItems(idPedido, items) {
    const comanda = await this.pedidosRepository.findById(idPedido);
    if (!comanda) {
      throw new NonExistentResource(`El pedido con id: ${idPedido}`);
    }
    if (comanda.estado !== EstadoComanda.ABIERTA) {
      throw new BusinessRuleError("No se pueden agregar items a una comanda que no está abierta.");
    }

    const itemsConPrecio = await Promise.all(
      items.map(async (item) => {
        const producto = await this.menuRepository.findById(
          item.producto,
        );
        if (!producto) {
          throw new NonExistentResource(`El producto con id: ${item.producto}`);
        }
        return {
          producto: item.producto,
          cantidad: item.cantidad,
          precioUnitario: producto.precio,
          estado: EstadoCocina.PENDIENTE,
        };
      }),
    );

    return await this.pedidosRepository.addItems(idPedido, itemsConPrecio);
  }

  async actualizarEstado(idPedido, body) {
    const comanda = await this.pedidosRepository.findById(idPedido);
    if (!comanda) {
      throw new NonExistentResource(`El pedido con id: ${idPedido}`);
    }

    if (body.itemId && body.estadoItem) {
      return await this.pedidosRepository.updateItemEstado(
        idPedido,
        body.itemId,
        body.estadoItem,
      );
    }

    if (body.estado === EstadoComanda.CERRADA) {
      const hayItemsPendientes = comanda.items.some(
        (i) => i.estado === EstadoCocina.EN_COCINA,
      );
      if (hayItemsPendientes) {
        throw new BusinessRuleError("No se puede cerrar la comanda: hay platos aún en preparación.");
      }
    }

    return await this.pedidosRepository.updateEstado(idPedido, body.estado);
  }
}
