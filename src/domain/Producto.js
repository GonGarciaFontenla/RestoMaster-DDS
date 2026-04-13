import { CategoriaPlato } from "./enums/CategoriaPlato.js";

/**
 * Representa un producto del menú del restaurante.
 *
 * @param {string} nombre - Nombre del plato o bebida.
 * @param {number} precio - Precio en pesos.
 * @param {CategoriaPlato} categoria - Categoría del producto (PRINCIPAL, ENTRADA, POSTRE, BEBIDA).
 * @param {boolean} vegetariano - Indica si el producto es apto para vegetarianos (por defecto: false).
 * @param {boolean} celiaco - Indica si el producto es apto para celíacos (por defecto: false).
 */
export default class Producto {
  constructor(nombre, precio, categoria, vegetariano = false, celiaco = false) {
    this.nombre = nombre;
    this.precio = precio;
    this.categoria = categoria;
    this.vegetariano = vegetariano;
    this.celiaco = celiaco;
  }
}
