import { EstadoComanda } from "../domain/enums/EstadoComanda.js";
import { EstadoCocina } from "../domain/enums/EstadoCocina.js";
import { ExistentResource, NotFoundError } from "../errors/GeneralErrors.js";
import BusinessRuleError from "../errors/BusinessError.js";
import Comanda from "../domain/Comanda.js";
import ItemComanda from "../domain/ItemComanda.js";

export class PedidosService {
  constructor(pedidosRepository, menuRepository, mesasRepository) {
    this.pedidosRepository = pedidosRepository;
    this.menuRepository = menuRepository;
    this.mesasRepository = mesasRepository;
  }

  async crearPedido({ mesaId, mozoId, restauranteId }) {
    const mesa = await this.mesasRepository.findByIdAndRestaurante(
      mesaId,
      restauranteId,
    );
    if (!mesa) {
      throw new NotFoundError(`La mesa con id: ${mesaId}`);
    }

    const comandaExistente =
      await this.pedidosRepository.findByMesaAndRestaurante(
        mesaId,
        restauranteId,
      );
    if (comandaExistente) {
      throw new ExistentResource(
        `Una comanda abierta para la mesa ${mesa.numero}`,
      );
    }

    return await this.pedidosRepository.create({
      restauranteId,
      mozo: mozoId,
      mesa: mesaId,
      estado: EstadoComanda.ABIERTA,
      fechaApertura: new Date(),
      items: [],
    });
  }

  async getPedidoPorMesa(mesaId, restauranteId) {
    const comanda = await this.pedidosRepository.findByMesaAndRestaurante(
      mesaId,
      restauranteId,
    );
    if (!comanda) {
      throw new NotFoundError(
        `Una comanda abierta para la mesa con id: ${mesaId}`,
      );
    }
    return comanda;
  }

  async agregarItems(idPedido, items, restauranteId) {
    const comanda = await this.pedidosRepository.findByIdAndRestaurante(
      idPedido,
      restauranteId,
    );
    if (!comanda) {
      throw new NotFoundError(`El pedido con id: ${idPedido}`);
    }
    if (comanda.estado !== EstadoComanda.ABIERTA) {
      throw new BusinessRuleError(
        "No se pueden agregar items a una comanda que no está abierta.",
      );
    }

    const itemsConPrecio = await Promise.all(
      items.map(async (item) => {
        const producto = await this.menuRepository.findByIdAndRestaurante(
          item.producto,
          restauranteId,
        );
        if (!producto) {
          throw new NotFoundError(`El producto con id: ${item.producto}`);
        }
        return {
          producto: item.producto,
          cantidad: item.cantidad,
          precioUnitario: producto.precio,
          estado: EstadoCocina.PENDIENTE,
        };
      }),
    );

    return await this.pedidosRepository.addItems(
      idPedido,
      restauranteId,
      itemsConPrecio,
    );
  }

  async actualizarEstado(idPedido, body, restauranteId) {
    const comanda = await this.pedidosRepository.findByIdAndRestaurante(
      idPedido,
      restauranteId,
    );
    if (!comanda) {
      throw new NotFoundError(`El pedido con id: ${idPedido}`);
    }

    if (body.itemId && body.estadoItem) {
      return await this.pedidosRepository.updateItemEstado(
        idPedido,
        restauranteId,
        body.itemId,
        body.estadoItem,
      );
    }

    if (body.estado === EstadoComanda.CERRADA) {
      const itemsDomain = comanda.items.map(
        (i) =>
          new ItemComanda(i.producto, i.cantidad, i.precioUnitario, i.estado),
      );
      const comandaDomain = new Comanda(comanda.mozo, comanda.mesa);
      comandaDomain.items = itemsDomain;
      comandaDomain.cerrarComanda();
    }

    return await this.pedidosRepository.updateEstado(
      idPedido,
      restauranteId,
      body.estado,
    );
  }
}
