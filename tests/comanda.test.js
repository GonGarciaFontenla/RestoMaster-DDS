import Comanda from "../src/domain/Comanda.js";
import ItemComanda from "../src/domain/ItemComanda.js";
import { EstadoCocina } from "../src/domain/enums/EstadoCocina.js";
import BusinessRuleError from "../src/errors/BusinessError.js";

describe("Comanda - Lógica de Negocio", () => {

  describe("calcularTotal()", () => {
    test("devuelve 0 si la comanda no tiene ítems", () => {
      const comanda = new Comanda("Mozo 1", { numero: 5 });

      expect(comanda.calcularTotal()).toBe(0);
    });

    test("calcula correctamente el total con un solo ítem", () => {
      const comanda = new Comanda("Mozo 1", { numero: 5 });
      const item = new ItemComanda({ nombre: "Pizza" }, 2, 1500);

      comanda.items.push(item);

      expect(comanda.calcularTotal()).toBe(3000);
    });

    test("suma correctamente los precios de múltiples ítems", () => {
      const comanda = new Comanda("Mozo 1", { numero: 5 });
      const item1 = new ItemComanda({ nombre: "Pizza" }, 1, 1000);
      const item2 = new ItemComanda({ nombre: "Cerveza" }, 2, 500);

      comanda.items.push(item1, item2);

      // item1: 1 * 1000 = 1000
      // item2: 2 * 500 = 1000
      // total = 2000
      expect(comanda.calcularTotal()).toBe(2000);
    });
  });

  describe("cerrarComanda()", () => {
    test("cierra exitosamente una comanda sin ítems en cocina", () => {
      const comanda = new Comanda("Mozo 1", { numero: 5 });
      // Sin ítems, la comanda puede cerrarse directamente
      expect(() => comanda.cerrarComanda()).not.toThrow();
      expect(comanda.estado).toBe("CERRADA");
    });

    test("cierra exitosamente cuando todos los ítems están SERVIDOS", () => {
      const comanda = new Comanda("Mozo 1", { numero: 5 });
      const item = new ItemComanda({ nombre: "Pizza" }, 1, 1000, EstadoCocina.SERVIDO);

      comanda.items.push(item);

      expect(() => comanda.cerrarComanda()).not.toThrow();
      expect(comanda.estado).toBe("CERRADA");
    });

    test("lanza BusinessRuleError si hay ítems EN_COCINA", () => {
      const comanda = new Comanda("Mozo 1", { numero: 5 });
      const item = new ItemComanda({ nombre: "Pizza" }, 1, 1000); // estado por defecto: PENDIENTE
      item.estado = EstadoCocina.EN_COCINA; // simulamos que está siendo preparado

      comanda.items.push(item);

      expect(() => comanda.cerrarComanda()).toThrow(BusinessRuleError);
    });

    test("el mensaje del error es descriptivo", () => {
      const comanda = new Comanda("Mozo 1", { numero: 5 });
      const item = new ItemComanda({ nombre: "Pizza" }, 1, 1000);
      item.estado = EstadoCocina.EN_COCINA;

      comanda.items.push(item);

      expect(() => comanda.cerrarComanda()).toThrow(
        "No se puede cerrar la comanda: hay platos aún en preparación."
      );
    });
  });

});
