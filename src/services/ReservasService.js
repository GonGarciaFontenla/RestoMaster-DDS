import { ExistentResource, NotFoundError } from "../errors/GeneralErrors.js";
import BusinessRuleError from "../errors/BusinessError.js";
import { EstadoReserva } from "../domain/enums/EstadoReserva.js";

export class ReservasService {
  constructor(reservasRepository, mesasRepository) {
    this.reservasRepository = reservasRepository;
    this.mesasRepository = mesasRepository;
  }

  async obtenerReservas(restauranteId, filtros = {}) {
    return await this.reservasRepository.findAll(restauranteId, filtros);
  }

  async obtenerReservaById(id, restauranteId) {
    const reserva = await this.reservasRepository.findById(id, restauranteId);
    if (!reserva) {
      throw new NotFoundError(`La reserva con id: ${id}`);
    }
    return reserva;
  }

  async crearReserva(restauranteId, datos) {
    const mesa = await this.mesasRepository.findByIdAndRestaurante(
      datos.mesaReservada,
      restauranteId,
    );
    if (!mesa) {
      throw new NotFoundError("La mesa especificada");
    }

    if (datos.cantidadComensales > mesa.capacidad) {
      throw new BusinessRuleError(
        `La mesa ${mesa.numero} tiene capacidad para ${mesa.capacidad} comensales`,
      );
    }

    const horarioReserva = new Date(datos.horario);
    if (horarioReserva < new Date()) {
      throw new BusinessRuleError("No se puede crear una reserva para una fecha pasada");
    }

    const reservaExistente = await this.reservasRepository.existeReservaEnMesa(
      datos.mesaReservada,
      datos.horario,
      restauranteId,
    );
    if (reservaExistente) {
      throw new ExistentResource(`Ya existe una reserva para la mesa ${mesa.numero} en ese horario`);
    }

    return await this.reservasRepository.create({
      ...datos,
      restauranteId,
      estado: EstadoReserva.PENDIENTE,
    });
  }

  async actualizarReserva(id, restauranteId, datosNuevos) {
    const reserva = await this.reservasRepository.findById(id, restauranteId);
    if (!reserva) {
      throw new NotFoundError(`La reserva con id: ${id}`);
    }

    if (datosNuevos.mesaReservada && datosNuevos.mesaReservada !== reserva.mesaReservada._id.toString()) {
      const nuevaMesa = await this.mesasRepository.findByIdAndRestaurante(
        datosNuevos.mesaReservada,
        restauranteId,
      );
      if (!nuevaMesa) {
        throw new NotFoundError("La nueva mesa especificada");
      }

      const cantidadComensales = datosNuevos.cantidadComensales || reserva.cantidadComensales;
      if (cantidadComensales > nuevaMesa.capacidad) {
        throw new BusinessRuleError(
          `La nueva mesa tiene capacidad para ${nuevaMesa.capacidad} comensales`,
        );
      }

      const horario = datosNuevos.horario || reserva.horario;
      const conflicto = await this.reservasRepository.existeReservaEnMesa(
        datosNuevos.mesaReservada,
        horario,
        restauranteId,
        id,
      );
      if (conflicto) {
        throw new ExistentResource("ya existe una reserva en esa mesa para ese horario");
      }
    }

    // Fix #15: se comparan los timestamps para evitar falsos positivos cuando
    // datosNuevos.horario es un string ISO y reserva.horario es un objeto Date.
    if (
      datosNuevos.horario &&
      new Date(datosNuevos.horario).getTime() !== new Date(reserva.horario).getTime()
    ) {
      if (new Date(datosNuevos.horario) < new Date()) {
        throw new BusinessRuleError("No se puede cambiar a un horario en el pasado");
      }

      const conflicto = await this.reservasRepository.existeReservaEnMesa(
        reserva.mesaReservada._id,
        datosNuevos.horario,
        restauranteId,
        id,
      );
      if (conflicto) {
        throw new ExistentResource("ya existe una reserva en ese horario");
      }
    }

    return await this.reservasRepository.findAndUpdate(id, datosNuevos, restauranteId);
  }

  async obtenerDisponibilidad(restauranteId, fecha, hora, cantidadComensales) {
    if (!fecha || !hora || !cantidadComensales) {
      throw new BusinessRuleError("fecha, hora y cantidadComensales son obligatorios");
    }
    if (cantidadComensales < 1) {
      throw new BusinessRuleError("La cantidad de comensales debe ser mayor a 0");
    }
    return await this.reservasRepository.findAvailableTables(
      restauranteId,
      fecha,
      hora,
      cantidadComensales,
    );
  }

  async confirmarReserva(id, restauranteId) {
    const reserva = await this.reservasRepository.findById(id, restauranteId);
    if (!reserva) {
      throw new NotFoundError(`La reserva con id: ${id}`);
    }
    if (reserva.estado !== EstadoReserva.PENDIENTE) {
      throw new BusinessRuleError(`No se puede confirmar una reserva en estado ${reserva.estado}`);
    }
    return await this.reservasRepository.findAndUpdate(
      id,
      { estado: EstadoReserva.CONFIRMADA },
      restauranteId,
    );
  }

  async cancelarReserva(id, restauranteId) {
    const reserva = await this.reservasRepository.findById(id, restauranteId);
    if (!reserva) {
      throw new NotFoundError(`La reserva con id: ${id}`);
    }
    // Fix #14: se convierte a Date explícitamente para evitar comparación
    // incorrecta entre string ISO (repositorio) y objeto Date (new Date()).
    if (new Date(reserva.horario) < new Date()) {
      throw new BusinessRuleError("No se puede cancelar una reserva que ya pasó");
    }
    if (![EstadoReserva.PENDIENTE, EstadoReserva.CONFIRMADA].includes(reserva.estado)) {
      throw new BusinessRuleError(
        `No se puede cancelar una reserva en estado ${reserva.estado}`,
      );
    }
    return await this.reservasRepository.findAndUpdate(
      id,
      { estado: EstadoReserva.CANCELADA },
      restauranteId,
    );
  }

  async registrarAsistencia(id, restauranteId, estado) {
    const reserva = await this.reservasRepository.findById(id, restauranteId);
    if (!reserva) {
      throw new NotFoundError(`La reserva con id: ${id}`);
    }
    if (![EstadoReserva.ASISTIO, EstadoReserva.NO_SHOW].includes(estado)) {
      throw new BusinessRuleError(`Estado de asistencia inválido: ${estado}`);
    }
    if (reserva.estado !== EstadoReserva.CONFIRMADA) {
      throw new BusinessRuleError("La reserva debe estar en estado CONFIRMADA para registrar asistencia");
    }
    return await this.reservasRepository.findAndUpdate(id, { estado }, restauranteId);
  }

  async eliminarReserva(id, restauranteId) {
    const reserva = await this.reservasRepository.findById(id, restauranteId);
    if (!reserva) {
      throw new NotFoundError(`La reserva con id: ${id}`);
    }
    return await this.reservasRepository.findAndDelete(id, restauranteId);
  }
}
