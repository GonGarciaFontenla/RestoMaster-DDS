import { MesasREST } from "../dtos/MesasDTO.js";

export default class MesasController {
  constructor(mesasService) {
    this.mesasService = mesasService;
  }

  async getMesas(req, res, next) {
    try {
      const mesas = await this.mesasService.getMesas();

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
      const mesa = await this.mesasService.createTable(req.body);

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
      const mesaActualizada = await this.mesasService.actualizarMesa(
        req.params.id,
        req.body,
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
