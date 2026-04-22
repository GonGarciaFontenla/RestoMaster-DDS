import { ReservaModel } from "../schemas/ReservaSchema.js";
import { MesaModel } from "../schemas/MesaSchema.js";
import { EstadoReserva } from "../domain/enums/EstadoReserva.js";
import { EstadoMesa } from "../domain/enums/EstadoMesa.js";

export class ReservasRepository {
  /*
   * Filtro base: excluye siempre los documentos borrados (soft delete).
   * Todos los métodos de consulta lo aplican automáticamente.
   */
  baseFilter() {
    return { deletedAt: null };
  }

  async findAll(filtros = {}) {
    const query = { ...this.baseFilter() };

    if (filtros.estado) query.estado = filtros.estado;

    if (filtros.fecha) {
      const fecha = new Date(filtros.fecha);
      const inicio = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
      const fin = new Date(inicio);
      fin.setDate(fin.getDate() + 1);
      query.horario = { $gte: inicio, $lt: fin };
    }

    if (filtros.cliente) {
      query.nombreCliente = { $regex: filtros.cliente, $options: "i" };
    }

    return await ReservaModel.find(query)
      .populate("mesaReservada", "numero capacidad")
      .sort({ horario: -1 });
  }

  async findById(id) {
    return await ReservaModel.findOne({ _id: id, ...this.baseFilter() })
      .populate("mesaReservada");
  }

  async create(datosReserva) {
    const nuevaReserva = new ReservaModel(datosReserva);
    return await nuevaReserva.save();
  }

  // Fix #8 y #18: $set previene operator injection; runValidators aplica
  // las reglas del schema (enum de estado, etc.) también en actualizaciones.
  async findAndUpdate(id, datosNuevos) {
    return await ReservaModel.findOneAndUpdate(
      { _id: id, ...this.baseFilter() },
      { $set: datosNuevos },
      { new: true, runValidators: true },
    ).populate("mesaReservada");
  }

  async findAndDelete(id) {
    return await ReservaModel.findOneAndUpdate(
      { _id: id, ...this.baseFilter() },
      { $set: { deletedAt: new Date() } },
      { new: true },
    );
  }

  async existeReservaEnMesa(mesaId, horario, excludeId = null) {
    const horarioInicio = new Date(horario);
    horarioInicio.setMinutes(horarioInicio.getMinutes() - 30);

    const horarioFin = new Date(horario);
    horarioFin.setMinutes(horarioFin.getMinutes() + 30);

    const query = {
      mesaReservada: mesaId,
      estado: { $in: [EstadoReserva.PENDIENTE, EstadoReserva.CONFIRMADA] },
      horario: { $gte: horarioInicio, $lte: horarioFin },
      ...this.baseFilter(),
    };

    if (excludeId) query._id = { $ne: excludeId };

    return await ReservaModel.findOne(query);
  }

  async findAvailableTables(fecha, hora, cantidadComensales) {
    const [horas, minutos] = hora.split(":").map(Number);
    const horarioReserva = new Date(fecha);
    horarioReserva.setHours(horas, minutos, 0, 0);

    const horarioInicio = new Date(horarioReserva);
    horarioInicio.setMinutes(horarioInicio.getMinutes() - 30);

    const horarioFin = new Date(horarioReserva);
    horarioFin.setMinutes(horarioFin.getMinutes() + 30);

    const mesasOcupadas = await ReservaModel.find({
      ...this.baseFilter(),
      horario: { $gte: horarioInicio, $lte: horarioFin },
      estado: { $in: [EstadoReserva.PENDIENTE, EstadoReserva.CONFIRMADA] },
    }).select("mesaReservada");

    const idsOcupadas = mesasOcupadas.map((r) => r.mesaReservada.toString());

    return await MesaModel.find({
      capacidad: { $gte: cantidadComensales },
      _id: { $nin: idsOcupadas },
      estado: EstadoMesa.LIBRE,
    }).sort({ capacidad: 1 });
  }
}
