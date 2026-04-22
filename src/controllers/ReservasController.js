import { ReservaREST } from "../dtos/ReservaDTO.js";

export default class ReservasController {
  constructor(reservasService) {
    this.reservasService = reservasService;
  }

  async obtenerReservas(req, res, next) {
    const reservas = await this.reservasService.obtenerReservas(req.query);
    return res.status(200).json({
      estado: "success",
      mensaje: "Reservas devueltas exitosamente",
      reservas: reservas.map((r) => ReservaREST(r)),
    });
  }
  catch(err) {
    next(err);
  }

  async obtenerReservaById(req, res, next) {
    try {
      const reserva = await this.reservasService.obtenerReservaById(
        req.params.id,
      );
      return res.status(200).json({
        estado: "success",
        mensaje: "Reserva devuelta exitosamente",
        reserva: ReservaREST(reserva),
      });
    } catch (err) {
      next(err);
    }
  }

  async crearReserva(req, res, next) {
    try {
      const reserva = await this.reservasService.crearReserva(req.body);
      return res.status(201).json({
        estado: "success",
        mensaje: "Reserva creada exitosamente",
        reserva: ReservaREST(reserva),
      });
    } catch (err) {
      next(err);
    }
  }

  async actualizarReserva(req, res, next) {
    try {
      const reserva = await this.reservasService.actualizarReserva(
        req.params.id,
        req.body,
      );
      return res.status(200).json({
        estado: "success",
        mensaje: "Reserva actualizada exitosamente",
        reserva: ReservaREST(reserva),
      });
    } catch (err) {
      next(err);
    }
  }

  async obtenerDisponibilidad(req, res, next) {
    try {
      const { fecha, hora, comensales } = req.query;
      const mesasDisponibles = await this.reservasService.obtenerDisponibilidad(
        fecha,
        hora,
        parseInt(comensales),
      );
      return res.status(200).json({
        estado: "success",
        mensaje: "Mesas disponibles obtenidas exitosamente",
        mesasDisponibles,
      });
    } catch (err) {
      next(err);
    }
  }

  async confirmarReserva(req, res, next) {
    try {
      const reserva = await this.reservasService.confirmarReserva(
        req.params.id,
      );
      return res.status(200).json({
        estado: "success",
        mensaje: "Reserva confirmada exitosamente",
        reserva: ReservaREST(reserva),
      });
    } catch (err) {
      next(err);
    }
  }

  async cancelarReserva(req, res, next) {
    try {
      const reserva = await this.reservasService.cancelarReserva(req.params.id);
      return res.status(200).json({
        estado: "success",
        mensaje: "Reserva cancelada exitosamente",
        reserva: ReservaREST(reserva),
      });
    } catch (err) {
      next(err);
    }
  }

  async registrarAsistencia(req, res, next) {
    try {
      const reserva = await this.reservasService.registrarAsistencia(
        req.params.id,
        req.body.estado,
      );
      return res.status(200).json({
        estado: "success",
        mensaje: "Asistencia registrada exitosamente",
        reserva: ReservaREST(reserva),
      });
    } catch (err) {
      next(err);
    }
  }

  async eliminarReserva(req, res, next) {
    try {
      await this.reservasService.eliminarReserva(req.params.id);
      return res.status(200).json({
        estado: "success",
        mensaje: "Reserva eliminada exitosamente",
      });
    } catch (err) {
      next(err);
    }
  }
}
