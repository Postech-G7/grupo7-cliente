import {
  post_cliente,
  put_cliente,
  post_cliente_autenticacao,
} from "../domains/cliente/adapter/driver/rest/swagger/acesso.swagger";

export const swagger = {
  swagger: "2.0",
  info: {
    version: "1.0.0",
    title: "Tech Challenge Fiap",
    description: "Conjuntos de recursos e operações do Tech Challenge da FIAP",
  },
  host: `localhost:3000`,
  basePath: "/",
  tags: [
    {
      name: "Cliente",
      description: "APIs do domínio de Clientes",
    },
  ],
  schemes: ["http"],
  securityDefinitions: {
    JWT: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description: "Insira o token JWT no formato: Bearer <token>",
    },
  },
  paths: {
    "/api/clientes/v1": {
      get: {
        tags: ["Cliente"],
        summary: "Busca os dados de um cliente autenticado",
        description: "Busca os dados de clientes autenticados",
        operationId: "getclienteautenticado",
        security: [
          {
            JWT: [],
          },
        ],
        responses: {
          200: {
            description: "Cliente encontrado",
          },
          401: {
            description: "Não autorizado",
          },
        },
      },
      post: {
        tags: ["Cliente"],
        summary: "Cria um novo cliente",
        description: "Rota pública para criar um cliente",
        operationId: "postcliente",
        responses: {
          201: {
            description: "Cliente criado",
          },
        },
      },
    },
  },
  definitions: {
    post_cliente,
    put_cliente,
    post_cliente_autenticacao,
  },
};

export default swagger;
