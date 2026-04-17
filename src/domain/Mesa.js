import { EstadoMesa } from "./enums/EstadoMesa.js";
import { Ubicacion } from "./enums/Ubicacion.js";

export default class Mesa {
  constructor(numero, capacidad, ubicacion, estado = EstadoMesa.LIBRE) {
    this.numero = numero;
    this.capacidad = capacidad;
    this.ubicacion = ubicacion;
    this.estado = estado;
  }
}
