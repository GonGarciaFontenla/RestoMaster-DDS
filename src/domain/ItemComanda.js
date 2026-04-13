import { EstadoCocina } from "./enums/EstadoCocina.js";

/**
 * Representa un ítem dentro de una Comanda.
 * Cada ítem corresponde a un Producto pedido con una cantidad determinada.
 *
 * @param {Producto} producto - El producto del menú que se está pidiendo.
 * @param {number} cantidad - Cantidad de unidades solicitadas.
 * @param {number} precioUnitario - Precio por unidad al momento del pedido.
 * @param {EstadoCocina} estado - Estado del ítem en cocina (por defecto: PENDIENTE).
 */
export default class ItemComanda {
  constructor(
    producto,
    cantidad,
    precioUnitario,
    estado = EstadoCocina.PENDIENTE,
  ) {
    this.producto = producto;
    this.cantidad = cantidad;
    this.precioUnitario = precioUnitario;
    this.estado = estado;
  }

  /**
   * Calcula el precio total de este ítem.
   * @returns {number} precio unitario multiplicado por la cantidad.
   */
  precioTotal() {
    return this.precioUnitario * this.cantidad;
  }

  /**
   * Devuelve el estado actual del ítem en cocina.
   * @returns {EstadoCocina}
   */
  getEstado() {
    return this.estado;
  }
}
