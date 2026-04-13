import { MesasREST } from "../dtos/MesasDTO.js";

export default class MesasController {
  constructor(mesasService) {
    this.mesasService = mesasService;
  }

  async getMesas(req, res, next) {
    try {
      const restauranteId = req.restauranteId;
      const mesas = await this.mesasService.getMesas(restauranteId);

      return res.status(200).json({
        estado: "success",
        mensaje: "Mesas devueltas exitosamente",
        mesas: mesas.map((m) => MesasREST(m)),
      });
    } catch (err) {
      next(err);
    }
  }

  async createMesa(req, res, next) {
    try {
      const restauranteId = req.restauranteId;
      const mesa = await this.mesasService.createTable(restauranteId, req.body);

      return res.status(201).json({
        estado: "success",
        mensaje: "Mesa creada exitosamente",
        mesa: MesasREST(mesa),
      });
    } catch (err) {
      next(err);
    }
  }

  async actualizarMesa(req, res, next) {
    try {
      const restauranteId = req.restauranteId;
      const mesaActualizada = await this.mesasService.actualizarMesa(
        req.params.id,
        req.body,
        restauranteId,
      );

      return res.status(200).json({
        estado: "success",
        mensaje: "Mesa actualizada exitosamente",
        mesa: MesasREST(mesaActualizada),
      });
    } catch (err) {
      next(err);
    }
  }
}
