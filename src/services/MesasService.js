import { ExistentResource, NotFoundError } from "../errors/GeneralErrors.js";

export class MesasService {
  constructor(mesasRepository) {
    this.mesasRepository = mesasRepository;
  }

  async getMesas(restauranteId) {
    return await this.mesasRepository.findAll(restauranteId);
  }

  async createTable(restauranteId, datos) {
    const mesaExistente = await this.mesasRepository.findByNumeroAndRestaurante(
      datos.numero,
      restauranteId,
    );

    if (mesaExistente) {
      throw new ExistentResource(`La mesa número ${datos.numero}`);
    }

    return await this.mesasRepository.create({ ...datos, restauranteId });
  }

  async actualizarMesa(idMesa, datosNuevos, restauranteId) {
    const mesa = await this.mesasRepository.findByIdAndRestaurante(idMesa, restauranteId);

    if (!mesa) {
      throw new NotFoundError(`La mesa con id: ${idMesa}`);
    }

    return await this.mesasRepository.findAndUpdate(idMesa, datosNuevos, restauranteId);
  }
}
