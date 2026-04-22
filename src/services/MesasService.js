import { ExistentResource, NotFoundError } from "../errors/GeneralErrors.js";

export class MesasService {
  constructor(mesasRepository) {
    this.mesasRepository = mesasRepository;
  }

  async getMesas() {
    return await this.mesasRepository.findAll();
  }

  async createTable(datos) {
    const mesaExistente = await this.mesasRepository.findByNumero(
      datos.numero,
    );

    if (mesaExistente) {
      throw new ExistentResource(`La mesa número ${datos.numero}`);
    }

    return await this.mesasRepository.create(datos);
  }

  async actualizarMesa(idMesa, datosNuevos) {
    const mesa = await this.mesasRepository.findById(idMesa);

    if (!mesa) {
      throw new NotFoundError(`La mesa con id: ${idMesa}`);
    }

    return await this.mesasRepository.findAndUpdate(idMesa, datosNuevos);
  }
}
