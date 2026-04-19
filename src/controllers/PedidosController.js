export default class PedidosController {
  constructor(pedidosService) {
    this.pedidosService = pedidosService;
  }

  async crearPedido(req, res, next) {
    try {
      const mozoId = req.body.mozoId;
      const mesaId = req.body.mesa;

      const pedido = await this.pedidosService.crearPedido({ mesaId, mozoId });

      return res.status(201).json({
        estado: "success",
        mensaje: "Pedido creado exitosamente",
        pedido,
      });
    } catch (err) {
      next(err);
    }
  }

  async getPedidosActivos(req, res, next) {
    try {
      const pedidos = await this.pedidosService.getPedidosActivos();

      return res.status(200).json({
        estado: "success",
        mensaje: "Pedidos activos devueltos exitosamente",
        pedidos,
      });
    } catch (err) {
      next(err);
    }
  }

  async getPedidoPorMesa(req, res, next) {
    try {
      const pedido = await this.pedidosService.getPedidoPorMesa(
        req.params.tableId,
      );

      return res.status(200).json({
        estado: "success",
        mensaje: "Pedido de la mesa devuelto exitosamente",
        pedido,
      });
    } catch (err) {
      next(err);
    }
  }

  async agregarItems(req, res, next) {
    try {
      const pedidoActualizado = await this.pedidosService.agregarItems(
        req.params.id,
        req.body.items,
      );

      return res.status(200).json({
        estado: "success",
        mensaje: "Items agregados exitosamente",
        pedido: pedidoActualizado,
      });
    } catch (err) {
      next(err);
    }
  }

  async actualizarEstado(req, res, next) {
    try {
      const pedidoActualizado = await this.pedidosService.actualizarEstado(
        req.params.id,
        req.body,
      );

      return res.status(200).json({
        estado: "success",
        mensaje: "Estado actualizado exitosamente",
        pedido: pedidoActualizado,
      });
    } catch (err) {
      next(err);
    }
  }
}
