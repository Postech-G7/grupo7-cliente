import { Router } from "express";
import helthCheckRoutes from "../domains/suporte/adapter/driver/rest/routes/health-check.route";
import clienteRoutes from "../domains/cliente/adapter/driver/rest/routes/cliente.route";

const routes = Router();

routes.use("/api/clientes", clienteRoutes);
routes.use("/api/health-check", helthCheckRoutes);

export default routes;
