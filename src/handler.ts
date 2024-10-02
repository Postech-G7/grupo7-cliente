import express from "express";
import serverless from "serverless-http";
import routes from "./configuration/routes.config";

console.log("Starting handler.ts");
const app = express();
app.use(express.json());
app.use("/", routes);

export const api = serverless(app);
