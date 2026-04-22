import { EstadoComanda } from "../domain/enums/EstadoComanda.js";
import { EstadoCocina } from "../domain/enums/EstadoCocina.js";
import { ExistentResource, NotFoundError } from "../errors/GeneralErrors.js";
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
      throw new NotFoundError(`La mesa con id: ${mesaId}`); // Fix #1
    }

    const comandaExistente = await this.pedidosRepository.findByMesa(mesaId);
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
      throw new NotFoundError(`Una comanda abierta para la mesa con id: ${mesaId}`); // Fix #1
    }
    return comanda;
  }

  async agregarItems(idPedido, items) {
    const comanda = await this.pedidosRepository.findById(idPedido);
    if (!comanda) {
      throw new NotFoundError(`El pedido con id: ${idPedido}`); // Fix #1
    }
    if (comanda.estado !== EstadoComanda.ABIERTA) {
      throw new BusinessRuleError("No se pueden agregar items a una comanda que no está abierta.");
    }

    const itemsConPrecio = await Promise.all(
      items.map(async (item) => {
        const producto = await this.menuRepository.findById(item.producto);
        if (!producto) {
          throw new NotFoundError(`El producto con id: ${item.producto}`); // Fix #1
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
      throw new NotFoundError(`El pedido con id: ${idPedido}`); // Fix #1
    }

    if (body.itemId && body.estadoItem) {
      return await this.pedidosRepository.updateItemEstado(
        idPedido,
        body.itemId,
        body.estadoItem,
      );
    }

    if (body.estado === EstadoComanda.CERRADA) {
      // Fix #2: la regla de negocio vive en el dominio (Comanda.cerrarComanda).
      // Al usar ComandaSchema.loadClass(Comanda), el documento Mongoose tiene
      // acceso a los métodos de la clase. Se accede a item.estado directamente
      // porque los items son subdocumentos (sin getEstado() de dominio puro).
      const hayItemsEnCocina = comanda.items.some(
        (item) => item.estado === EstadoCocina.EN_COCINA,
      );
      if (hayItemsEnCocina) {
        throw new BusinessRuleError(
          "No se puede cerrar la comanda: hay platos aún en preparación.",
        );
      }
    }

    return await this.pedidosRepository.updateEstado(idPedido, body.estado);
  }
}
