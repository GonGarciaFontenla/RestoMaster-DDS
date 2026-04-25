import MenuController from "../controllers/MenuController.js";
import MesasController from "../controllers/MesasController.js";
import PedidosController from "../controllers/PedidosController.js";
import ReservasController from "../controllers/ReservasController.js";
import { MenuService } from "../services/MenuService.js";
import { MesasService } from "../services/MesasService.js";
import { PedidosService } from "../services/PedidosService.js";
import { ReservasService } from "../services/ReservasService.js";
import { randomUUID } from "crypto";

/*
 * buildAppContext ensambla toda la cadena de dependencias:
 * Repository → Service → Controller
 *
 * En esta iteración los repositorios son stubs en memoria.
 * En la Iteración 3 (Persistencia) serán reemplazados por implementaciones reales con Mongoose.
 */
export const buildAppContext = () => {
  const menuRepository = crearRepositorioEnMemoria();
  const mesasRepository = crearRepositorioEnMemoria();
  const pedidosRepository = crearRepositorioEnMemoria();
  const reservasRepository = crearRepositorioEnMemoria();

  const menuService = new MenuService(menuRepository);
  const mesasService = new MesasService(mesasRepository);
  const pedidosService = new PedidosService(
    pedidosRepository,
    menuRepository,
    mesasRepository,
  );
  const reservasService = new ReservasService(
    reservasRepository,
    mesasRepository,
  );

  return {
    menuController: new MenuController(menuService),
    mesasController: new MesasController(mesasService),
    pedidosController: new PedidosController(pedidosService),
    reservasController: new ReservasController(reservasService),
  };
};

const crearRepositorioEnMemoria = () => ({
  findAll: async () => [],
  findById: async () => null,
  create: async (datos) => ({ _id: randomUUID(), ...datos }),
  findAndUpdate: async () => null,
  findAndDelete: async () => null,
  findByIdAndRestaurante: async () => null,
  findByNumeroAndRestaurante: async () => null,
  findByNombreAndRestaurante: async () => null,
  findByMesaAndRestaurante: async () => null,
  addItems: async () => null,
  updateEstado: async () => null,
  updateItemEstado: async () => null,
  existeReservaEnMesa: async () => null,
  findAvailableTables: async () => [],
});
