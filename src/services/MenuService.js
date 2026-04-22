import { ExistentResource, NotFoundError } from "../errors/GeneralErrors.js";

// Fix #13: unificado a named export para consistencia con el resto de los servicios
export class MenuService {
  constructor(menuRepository) {
    this.menuRepository = menuRepository;
  }

  async createPlate(platoData) {
    const platoExistente = await this.menuRepository.findByNombreAndRestaurante(
      platoData.nombre,
      platoData.restauranteId,
    );

    if (platoExistente) {
      throw new ExistentResource(`El plato ${platoData.nombre}`);
    }

    return await this.menuRepository.create(platoData);
  }

  // Fix #11: corregido typo "retrive" → "retrieve"
  async retrievePlates(queryParametros = {}, restauranteId) {
    const filtros = { restauranteId };

    if (queryParametros.categoria) filtros.categoria = queryParametros.categoria;
    if (queryParametros.nombre) filtros.nombre = queryParametros.nombre;
    if (queryParametros.disponible !== undefined) {
      filtros.disponible = queryParametros.disponible === "true";
    }

    return await this.menuRepository.findAll(filtros);
  }

  async modifyPlate(idPlato, datosNuevos, restauranteId) {
    const platoExistente = await this.menuRepository.findByIdAndRestaurante(idPlato, restauranteId);

    if (!platoExistente) {
      throw new NotFoundError(`El plato con id: ${idPlato}`); // Fix #5
    }

    return await this.menuRepository.findAndUpdate(idPlato, datosNuevos, restauranteId);
  }
}
