import { Router, Request, Response } from "express";
import { ClienteController } from "../controllers/cliente.controller";
import { body, param } from "express-validator";
import { ClienteUseCases } from "../../../../core/applications/usecases/cliente.usecases";
import { ClienteDatabase } from "../../../driven/infra/database/cliente.database";
import { Identity } from "../../../driven/infra/identity/identity";
import { Repository } from "../../../../../suporte/infra/database/repository";

const router = Router();

router.post(
  "/v1",
  body("cpf").trim().isLength({ min: 11, max: 11 }).notEmpty(),
  body("nome").trim().isLength({ min: 4, max: 60 }),
  body("email").trim().isEmail().notEmpty(),
  async (request: Request, response: Response) => {
    /**
        @Swagger
        #swagger.auto = true
        #swagger.summary = 'Cria um novo cliente'
        #swagger.description = 'Cria um novo cliente a partir das informações básicas'
        #swagger.operationId = 'postcliente'
        #swagger.deprecated = false
        #swagger.tags = ['Cliente']
        #swagger.parameters['body'] = { 
                in: 'body', 
                'schema': { $ref: '#/definitions/post_cliente' }
        }
    */
    const repository = new Repository({
      host: process.env.DATABASE_HOST!,
      port: Number(process.env.DATABASE_PORT),
      user: process.env.DATABASE_USER!,
      password: process.env.DATABASE_PASSWORD!,
      database: process.env.DATABASE_NAME!,
    });

    const clienteDatabase = new ClienteDatabase(repository);
    const identity = new Identity();
    const service = new ClienteUseCases(clienteDatabase, identity);
    const controller = new ClienteController(service);
    const clienteCriado = await controller.adiciona(request);

    return response.status(clienteCriado.statusCode).json({
      message: clienteCriado.message,
      data: clienteCriado.content,
    });
  }
);

router.put(
  "/v1/:cpf",
  param("cpf").trim().isLength({ min: 11, max: 11 }).notEmpty(),
  body("nome").trim().isLength({ min: 4, max: 60 }),
  body("email").trim().isEmail().notEmpty(),
  async (request: Request, response: Response) => {
    /**
        @Swagger
        #swagger.auto = true
        #swagger.summary = 'Atualiza um novo cliente'
        #swagger.description = 'Atualiza os dados de um cliente pelo CPF'
        #swagger.operationId = 'postcliente'
        #swagger.deprecated = false
        #swagger.tags = ['Cliente']
        #swagger.parameters['body'] = { 
                in: 'body', 
                'schema': { $ref: '#/definitions/post_cliente' }
        }
    */

    const repository = new Repository({
      host: process.env.DATABASE_HOST!,
      port: Number(process.env.DATABASE_PORT),
      user: process.env.DATABASE_USER!,
      password: process.env.DATABASE_PASSWORD!,
      database: process.env.DATABASE_NAME!,
    });

    const clienteDatabase = new ClienteDatabase(repository);
    const identity = new Identity();
    const service = new ClienteUseCases(clienteDatabase, identity);
    const controller = new ClienteController(service);
    const clienteAtualizado = await controller.atualiza(request).then();
    return response.status(clienteAtualizado.statusCode).json({
      message: clienteAtualizado.message,
      data: clienteAtualizado.content,
    });
  }
);

router.get(
  "/v1/:cpf",
  param("cpf").trim().isLength({ min: 11, max: 11 }).notEmpty(),
  async (request: Request, response: Response) => {
    /**
        @Swagger
        #swagger.auto = true
        #swagger.summary = 'Busca um cliente pelo CPF'
        #swagger.description = 'Busca os dados de clientes pelo CPF'
        #swagger.operationId = 'getcliente'
        #swagger.deprecated = false
        #swagger.tags = ['Cliente']
    */

    const repository = new Repository({
      host: process.env.DATABASE_HOST!,
      port: Number(process.env.DATABASE_PORT),
      user: process.env.DATABASE_USER!,
      password: process.env.DATABASE_PASSWORD!,
      database: process.env.DATABASE_NAME!,
    });

    const clienteDatabase = new ClienteDatabase(repository);
    const identity = new Identity();
    const service = new ClienteUseCases(clienteDatabase, identity);
    const controller = new ClienteController(service);
    const cliente = await controller.buscaUltimaVersao(request);

    return response
      .status(cliente.statusCode)
      .json({ message: cliente.message, data: cliente.content });
  }
);

router.post(
  "/v1/autenticacao",
  body("cpf").trim().isLength({ min: 11, max: 11 }).notEmpty(),
  body("email").trim().isEmail().notEmpty(),
  async (request: Request, response: Response) => {
    /**
      @Swagger
      #swagger.auto = true
      #swagger.summary = 'Autentica um usuário através do CPF e email'
      #swagger.description = 'Autentica um usuário através do CPF e email'
      #swagger.operationId = 'postclienteautenticacao'
      #swagger.deprecated = false
      #swagger.security = [{
        "JWT": []
      }]          
      #swagger.tags = ['Cliente']
      #swagger.parameters['body'] = { 
              in: 'body', 
              'schema': { $ref: '#/definitions/post_cliente_autenticacao' }
      }      
  */

    const repository = new Repository({
      host: process.env.DATABASE_HOST!,
      port: Number(process.env.DATABASE_PORT),
      user: process.env.DATABASE_USER!,
      password: process.env.DATABASE_PASSWORD!,
      database: process.env.DATABASE_NAME!,
    });

    const clienteDatabase = new ClienteDatabase(repository);
    const identity = new Identity();
    const service = new ClienteUseCases(clienteDatabase, identity);
    const controller = new ClienteController(service);

    const tokenCriado = await controller.autentica(request).then();
    return response
      .status(tokenCriado.statusCode)
      .json({ message: tokenCriado.message, data: tokenCriado.content });
  }
);

router.get("/v1", async (request: Request, response: Response) => {
  /**
      @Swagger
      #swagger.auto = true
      #swagger.summary = 'Busca dos dados de um cliente autenticado'
      #swagger.description = 'Busca os dados de clientes autenticados'
      #swagger.operationId = 'getclienteautenticado'
      #swagger.deprecated = false
      #swagger.security = [{
        "JWT": []
      }]
      #swagger.tags = ['Cliente']
  */

  const repository = new Repository({
    host: process.env.DATABASE_HOST!,
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER!,
    password: process.env.DATABASE_PASSWORD!,
    database: process.env.DATABASE_NAME!,
  });

  const clienteDatabase = new ClienteDatabase(repository);
  const identity = new Identity();
  const service = new ClienteUseCases(clienteDatabase, identity);
  const controller = new ClienteController(service);

  const cliente = await controller.buscaAutenticado(request).then();
  return response.status(cliente.statusCode).json({
    message: cliente.message,
    data: cliente.content,
  });
});

export default router;
