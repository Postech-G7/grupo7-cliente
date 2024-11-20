import {
  post_cliente,
  put_cliente,
} from "../domains/cliente/adapter/driver/rest/swagger/acesso.swagger";

export const swagger = {
  swagger: "2.0",
  info: {
    version: "1.0.0",
    title: "Tech Challenge Fiap",
    description: "Conjuntos dde recursos e operações do Tech Challenge da FIAP",
  },
  host: `localhost:31300`,
  tags: [
    {
      name: "Cliente",
      description: "APIs do domínio de Clientes",
    },
  ],
  definitions: {
    post_cliente,
    put_cliente,
  },
};

export default swagger;
