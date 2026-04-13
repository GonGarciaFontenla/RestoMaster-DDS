import { EstadoComanda } from "./enums/EstadoComanda.js";
import { EstadoCocina } from "./enums/EstadoCocina.js";
import BusinessRuleError from "../errors/BusinessError.js";

/**
 * Representa una comanda abierta en una mesa del restaurante.
 * Una comanda agrupa todos los ítems pedidos por los clientes de una mesa.
 *
 * @param {Usuario} mozo - Usuario que tomó la comanda.
 * @param {Mesa} mesa - Mesa a la que pertenece la comanda.
 * @param {EstadoComanda} estado - Estado inicial (por defecto: ABIERTA).
 * @param {Date} fechaApertura - Momento en que se abrió la comanda (por defecto: ahora).
 */
export default class Comanda {
  constructor(
    mozo,
    mesa,
    estado = EstadoComanda.ABIERTA,
    fechaApertura = new Date(),
  ) {
    this.mozo = mozo;
    this.mesa = mesa;
    this.estado = estado;
    this.fechaApertura = fechaApertura;
    this.items = []; // Lista de ItemComanda
  }

  /**
   * Calcula el total de la comanda sumando el precioTotal() de cada ítem.
   * Utiliza Array.reduce para acumular los valores.
   * @returns {number} Suma total de todos los ítems.
   */
  calcularTotal() {
    return this.items.reduce((acumulador, item) => acumulador + item.precioTotal(), 0);
  }

  /**
   * Intenta cerrar la comanda.
   *
   * REGLA DE NEGOCIO: No se puede cerrar una comanda si algún ítem
   * está en estado EN_COCINA, ya que significaría que hay platos pendientes de entrega.
   *
   * @throws {BusinessRuleError} Si existen ítems con estado EN_COCINA.
   */
  cerrarComanda() {
    const hayItemsEnCocina = this.items.some(
      (item) => item.getEstado() === EstadoCocina.EN_COCINA,
    );

    if (hayItemsEnCocina) {
      throw new BusinessRuleError(
        "No se puede cerrar la comanda: hay platos aún en preparación.",
      );
    }

    this.estado = EstadoComanda.CERRADA;
  }
}
