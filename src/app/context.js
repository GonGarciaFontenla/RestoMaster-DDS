import MenuController from "../controllers/MenuController.js";
import MesasController from "../controllers/MesasController.js";
import PedidosController from "../controllers/PedidosController.js";
import ReservasController from "../controllers/ReservasController.js";
import UserController from "../controllers/UserController.js";
import MenuService from "../services/MenuService.js";
import { MesasService } from "../services/MesasService.js";
import { PedidosService } from "../services/PedidosService.js";
import { ReservasService } from "../services/ReservasService.js";
import { UserService } from "../services/UserService.js";

/*
 * buildAppContext ensambla la cadena de dependencias:
 * Repository → Service → Controller
 *
 * Los repositorios son stubs en memoria. En la Iteración 3 serán
 * reemplazados por implementaciones reales con Mongoose.
 */
export const buildAppContext = () => {
  const userRepository = crearRepositorioEnMemoria();
  const menuRepository = crearRepositorioEnMemoria();
  const mesasRepository = crearRepositorioEnMemoria();
  const pedidosRepository = crearRepositorioEnMemoria();
  const reservasRepository = crearRepositorioEnMemoria();

  const userService = new UserService(userRepository);
  const menuService = new MenuService(menuRepository);
  const mesasService = new MesasService(mesasRepository);
  const pedidosService = new PedidosService(pedidosRepository, menuRepository, mesasRepository);
  const reservasService = new ReservasService(reservasRepository, mesasRepository);

  return {
    userController: new UserController(userService),
    menuController: new MenuController(menuService),
    mesasController: new MesasController(mesasService),
    pedidosController: new PedidosController(pedidosService),
    reservasController: new ReservasController(reservasService),
  };
};

const crearRepositorioEnMemoria = () => ({
  findAll: async () => [],
  findById: async () => null,
  findByEmail: async () => null,
  create: async (datos) => ({ _id: "stub-id", ...datos }),
  update: async () => null,
  delete: async () => null,
  findAndUpdate: async () => null,
  findAndDelete: async () => null,
  findByIdAndRestaurante: async () => null,
  findByNumeroAndRestaurante: async () => null,
  findByNombreAndRestaurante: async () => null,
  findByMesaAndRestaurante: async () => null,
  findActivos: async () => [],
  addItems: async () => null,
  updateEstado: async () => null,
  updateItemEstado: async () => null,
  existeReservaEnMesa: async () => null,
  findAvailableTables: async () => [],
});
