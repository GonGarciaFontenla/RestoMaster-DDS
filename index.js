import express from "express";
import cors from "cors";
import { loadEnvFile } from "node:process";
import { connectToDB } from "./src/app/db.js";
import { configureMenuRoutes } from "./src/routes/MenuRoutes.js";
import { configureMesasRoutes } from "./src/routes/MesasRoutes.js";
import { configurePedidosRoutes } from "./src/routes/PedidosRoutes.js";
import { configureReservasRoutes } from "./src/routes/ReservasRoutes.js";
import { configureUserRoutes } from "./src/routes/UserRoutes.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import { buildAppContext } from "./src/app/context.js";

loadEnvFile();

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

const startServer = async () => {
  await connectToDB();

  const { userController, menuController, mesasController, pedidosController, reservasController } =
    buildAppContext();

  app.use("/api/users", configureUserRoutes(userController));
  app.use("/api/menu", configureMenuRoutes(menuController));
  app.use("/api/mesas", configureMesasRoutes(mesasController, pedidosController));
  app.use("/api/pedidos", configurePedidosRoutes(pedidosController));
  app.use("/api/reservas", configureReservasRoutes(reservasController));

  app.use(errorHandler);

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor RestoMaster escuchando en el puerto ${PORT}`);
  });
};

// Fix #20: sin .catch(), un error en startServer() (ej: DB_URI inválida) emite
// UnhandledPromiseRejection que puede crashear el proceso en Node.js moderno.
startServer().catch((err) => {
  console.error("❌ Error fatal al iniciar el servidor:", err.message);
  process.exit(1);
});
