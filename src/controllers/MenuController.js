import { PlatoREST } from "../dtos/PlatoDTO.js";

export default class MenuController {
  constructor(menuService) {
    this.menuService = menuService;
  }

  async addPlato(req, res, next) {
    try {
      const restauranteId = req.restauranteId;
      const newPlato = await this.menuService.createPlate({ ...req.body, restauranteId });

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
      const restauranteId = req.restauranteId;
      const platos = await this.menuService.retrievePlates(req.query, restauranteId);

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
      const restauranteId = req.restauranteId;
      const platoModificado = await this.menuService.modifyPlate(
        req.params.id,
        req.body,
        restauranteId,
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
