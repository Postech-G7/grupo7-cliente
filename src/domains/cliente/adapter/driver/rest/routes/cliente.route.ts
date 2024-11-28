import { Router, Request, Response } from "express";
import { ClienteController } from "../controllers/cliente.controller";
import { body, param } from "express-validator";
import { ClienteUseCases } from "../../../../core/applications/usecases/cliente.usecases";
import { ClienteDatabase } from "../../../driven/infra/database/cliente.database";
import { Identity } from "../../../driven/infra/identity/identity";

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

    const database = new ClienteDatabase();
    const identity = new Identity();
    const service = new ClienteUseCases(database, identity);
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

    const database = new ClienteDatabase();
    const identity = new Identity();
    const service = new ClienteUseCases(database, identity);
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

    const database = new ClienteDatabase();
    const identity = new Identity();
    const service = new ClienteUseCases(database, identity);
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
    console.log("Entrou no post autenticacao, ", request.body);
    console.log(process.env.DATABASE_URL);
    console.log(process.env.MERCADO_PAGO_URL);
    console.log(process.env.MERCADO_PAGO_USERID);
    console.log(process.env.MERCADO_PAGO_TOKEN);
    console.log(process.env.MERCADO_PAGO_POS);
    console.log(process.env.MERCADO_PAGO_WEBHOOK_URL);
    console.log(process.env.SERVICE_ACCOUNT);

    const database = new ClienteDatabase();
    const identity = new Identity();
    console.log("aqui1");
    const service = new ClienteUseCases(database, identity);
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

  const database = new ClienteDatabase();
  const identity = new Identity();
  const service = new ClienteUseCases(database, identity);
  const controller = new ClienteController(service);

  const cliente = await controller.buscaAutenticado(request).then();
  return response.status(cliente.statusCode).json({
    message: cliente.message,
    data: cliente.content,
  });
});

export default router;
