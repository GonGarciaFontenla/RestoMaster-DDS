import { EstadoComanda } from "./enums/EstadoComanda.js";
import { EstadoCocina } from "./enums/EstadoCocina.js";
import BusinessRuleError from "../errors/BusinessError.js";

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

  calcularTotal() {
    return this.items.reduce((acumulador, item) => acumulador + item.precioTotal(), 0);
  }

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
