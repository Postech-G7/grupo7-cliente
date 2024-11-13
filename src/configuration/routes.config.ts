import { Router } from "express";
import helthCheckRoutes from "../domains/suporte/adapter/driver/rest/routes/health-check.route";
import clienteRoutes from "../domains/cliente/adapter/driver/rest/routes/cliente.route";

const routes = Router();


routes.get("/ping", (req, res) => {
    res.status(200).send("It's working");
  });
  

routes.use("/api/clientes", clienteRoutes);
routes.use("/api/health-check", helthCheckRoutes);

export default routes;
