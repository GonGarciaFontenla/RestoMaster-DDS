import express from "express";
import cors from "cors";
import { configureMenuRoutes } from "./src/routes/MenuRoutes.js";
import { configureMesasRoutes } from "./src/routes/MesasRoutes.js";
import { configurePedidosRoutes } from "./src/routes/PedidosRoutes.js";
import { configureReservasRoutes } from "./src/routes/ReservasRoutes.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import { buildAppContext } from "./src/app/context.js";

const app = express();

app.use(cors());
app.use(express.json());

/*
 * Middleware temporal: inyecta un restauranteId fijo en cada request.
 * Cuando se implemente la autenticación (Bonus), este bloque
 * será reemplazado por el middleware JWT que extrae el restauranteId del token.
 */
app.use((req, res, next) => {
  req.restauranteId = "restaurante-demo";
  next();
});

const { menuController, mesasController, pedidosController, reservasController } =
  buildAppContext();

app.use("/api/menu", configureMenuRoutes(menuController));
app.use("/api/mesas", configureMesasRoutes(mesasController, pedidosController));
app.use("/api/pedidos", configurePedidosRoutes(pedidosController));
app.use("/api/reservas", configureReservasRoutes(reservasController));

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor RestoMaster escuchando en el puerto ${PORT}`);
});
