import { EstadoMesa } from "./enums/EstadoMesa.js";
import { Ubicacion } from "./enums/Ubicacion.js";

/**
 * Representa una mesa física del restaurante.
 *
 * @param {number} numero - Número identificador de la mesa.
 * @param {number} capacidad - Cantidad máxima de comensales.
 * @param {Ubicacion} ubicacion - Sector del restaurante donde se encuentra.
 * @param {EstadoMesa} estado - Estado actual de la mesa (por defecto: LIBRE).
 */
export default class Mesa {
  constructor(numero, capacidad, ubicacion, estado = EstadoMesa.LIBRE) {
    this.numero = numero;
    this.capacidad = capacidad;
    this.ubicacion = ubicacion;
    this.estado = estado;
  }
}
