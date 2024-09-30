import express from "express";
import serverless from "serverless-http";
import routes from "./configuration/routes.config";
import { autenticacao } from './domains/cliente/core/applications/usecases/cliente.usecases';

console.log("Starting handler.ts");
const app = express();
app.use(express.json());
app.use("/", routes);

export const api = serverless(app);

import { APIGatewayProxyHandler } from 'aws-lambda';

export const autenticaCliente: APIGatewayProxyHandler = async (event) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Invalid request: body is missing',
      }),
    };
  }

  const { cpf, email } = JSON.parse(event.body);

  try {
    const authResult = await autenticacao(cpf, email);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Autenticação bem-sucedida',
        token: authResult.token, // Assuming `autenticacao` returns an object with a `token` property
      }),
    };
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: 'Falha na autenticação',
        error: error.message,
      }),
    };
  }
};