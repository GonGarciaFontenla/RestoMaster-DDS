import MenuController from "../controllers/MenuController.js";
import MesasController from "../controllers/MesasController.js";
import PedidosController from "../controllers/PedidosController.js";
import ReservasController from "../controllers/ReservasController.js";
import UserController from "../controllers/UserController.js";
import { MenuService } from "../services/MenuService.js";
import { MesasService } from "../services/MesasService.js";
import { PedidosService } from "../services/PedidosService.js";
import { ReservasService } from "../services/ReservasService.js";
import { UserService } from "../services/UserService.js";
import { MenuRepository } from "../repositories/MenuRepository.js";
import { MesasRepository } from "../repositories/MesasRepository.js";
import { PedidosRepository } from "../repositories/PedidosRepository.js";
import { ReservasRepository } from "../repositories/ReservasRepository.js";
import { UserRepository } from "../repositories/UserRepository.js";

export const buildAppContext = () => {
  const userRepository = new UserRepository();
  const menuRepository = new MenuRepository();
  const mesasRepository = new MesasRepository();
  const pedidosRepository = new PedidosRepository();
  const reservasRepository = new ReservasRepository();

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
