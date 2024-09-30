import express from "express";
import serverless from "serverless-http";
import routes from "./configuration/routes.config";
import { ClienteUseCases } from './domains/cliente/core/applications/usecases/cliente.usecases';
import { ClienteDatabase } from './domains/cliente/adapter/driven/infra/database/cliente.database';
import { Identity } from './domains/cliente/adapter/driven/infra/identity/identity';

console.log("Starting handler.ts");
const app = express();
app.use(express.json());
app.use("/", routes);

export const api = serverless(app);

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const autenticaCliente: (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult> = async (event) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Invalid request: body is null',
      }),
    };
  }
  const { cpf, email } = JSON.parse(event.body);
  const database = new ClienteDatabase(); // Assuming you have a way to instantiate ClienteDatabase
  const identity = new Identity(); // Assuming you have a way to instantiate Identity
  const autenticacao = new ClienteUseCases(database, identity);

  try {
    const authResult = await autenticacao.autenticacao(cpf, email);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Autenticação bem-sucedida',
        token: authResult, // Assuming `authenticate` returns a token string
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
