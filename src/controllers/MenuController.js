import { PlatoREST } from "../dtos/PlatoDTO.js";

export default class MenuController {
  constructor(menuService) {
    this.menuService = menuService;
  }

  async addPlato(req, res, next) {
    try {
      const newPlato = await this.menuService.createPlate(req.body);

      return res.status(201).json({
        estado: "success",
        mensaje: "Plato agregado exitosamente",
        plato: PlatoREST(newPlato),
      });
    } catch (err) {
      next(err);
    }
  }

  async getMenu(req, res, next) {
    try {
      const platos = await this.menuService.retrivePlates(req.query);

      return res.status(200).json({
        estado: "success",
        mensaje: "Platos devueltos exitosamente",
        platos: platos.map((p) => PlatoREST(p)),
      });
    } catch (err) {
      next(err);
    }
  }

  async modificarPlato(req, res, next) {
    try {
      const platoModificado = await this.menuService.modifyPlate(
        req.params.id,
        req.body,
      );

      return res.status(200).json({
        estado: "success",
        mensaje: "Plato modificado exitosamente",
        plato: PlatoREST(platoModificado),
      });
    } catch (err) {
      next(err);
    }
  }
}
