import { CategoriaPlato } from "./enums/CategoriaPlato.js";

export default class Producto {
  constructor(nombre, precio, categoria, vegetariano = false, celiaco = false) {
    this.nombre = nombre;
    this.precio = precio;
    this.categoria = categoria;
    this.vegetariano = vegetariano;
    this.celiaco = celiaco;
  }
}
