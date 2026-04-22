import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { loadEnvFile } from "node:process";
import { connectToDB } from "./src/app/db.js";
import { configureMenuRoutes } from "./src/routes/MenuRoutes.js";
import { configureMesasRoutes } from "./src/routes/MesasRoutes.js";
import { configurePedidosRoutes } from "./src/routes/PedidosRoutes.js";
import { configureReservasRoutes } from "./src/routes/ReservasRoutes.js";
import { configureAuthRoutes, configureUserRoutes } from "./src/routes/AuthRoutes.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import { buildAppContext } from "./src/app/context.js";

loadEnvFile();

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

const startServer = async () => {
  await connectToDB();

  const { userController, menuController, mesasController, pedidosController, reservasController } =
    buildAppContext();

  app.use("/api/auth", configureAuthRoutes(userController));
  app.use("/api/users", configureUserRoutes(userController));
  app.use("/api/menu", configureMenuRoutes(menuController));
  app.use("/api/mesas", configureMesasRoutes(mesasController, pedidosController));
  app.use("/api/pedidos", configurePedidosRoutes(pedidosController));
  app.use("/api/reservas", configureReservasRoutes(reservasController));

  // Fix #14: el handler 404 debe ir ANTES del errorHandler para que las rutas
  // no encontradas retornen JSON y no el HTML por defecto de Express.
  app.use((req, res) => {
    res.status(404).json({
      estado: "error",
      tipo: "NotFound",
      mensaje: `La ruta ${req.method} ${req.originalUrl} no existe`,
    });
  });

  app.use(errorHandler);

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor RestoMaster escuchando en el puerto ${PORT}`);
  });
};

startServer();
