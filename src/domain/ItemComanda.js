import { EstadoCocina } from "./enums/EstadoCocina.js";

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

  precioTotal() {
    return this.precioUnitario * this.cantidad;
  }

  getEstado() {
    return this.estado;
  }
}
