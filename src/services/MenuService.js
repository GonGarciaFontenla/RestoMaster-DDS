import { ExistentResource, NotFoundError } from "../errors/GeneralErrors.js";

export class MenuService {
  constructor(menuRepository) {
    this.menuRepository = menuRepository;
  }

  async createPlate(platoData) {
    const platoExistente = await this.menuRepository.findByNombre(
      platoData.nombre,
    );

    if (platoExistente) {
      throw new ExistentResource(`El plato ${platoData.nombre}`);
    }

    return await this.menuRepository.create(platoData);
  }

  async retrievePlates(queryParametros = {}) {
    const filtros = {};

    if (queryParametros.categoria)
      filtros.categoria = queryParametros.categoria;
    if (queryParametros.nombre) filtros.nombre = queryParametros.nombre;
    if (queryParametros.disponible !== undefined) {
      filtros.disponible = queryParametros.disponible === "true";
    }

    return await this.menuRepository.findAll(filtros);
  }

  async modifyPlate(idPlato, datosNuevos) {
    const platoExistente = await this.menuRepository.findById(idPlato);

    if (!platoExistente) {
      throw new NotFoundError(`El plato con id: ${idPlato}`);
    }

    return await this.menuRepository.findAndUpdate(idPlato, datosNuevos);
  }
}
