import { Request } from "express";
import { validationResult } from "express-validator";
import { CustomError } from "../../../../../../domains/suporte/entities/custom.error";
import { CustomResponse } from "../../../../../../domains/suporte/entities/custom.response";
import { ClienteUseCases } from "../../../../../../domains/cliente/core/applications/usecases/cliente.usecases";
import { Cliente } from "../../../../../../domains/cliente/core/entities/cliente";

export class ClienteController {
  constructor(private readonly service: ClienteUseCases) {}

  async adiciona(request: Request): Promise<CustomResponse | CustomError> {
    try {
      const result = validationResult(request);
      if (!result.isEmpty()) {
        throw new CustomError(
          "Parâmetros inválidos. Por favor, verifique as informações enviadas.",
          400,
          false,
          result.array()
        );
      }

      const { cpf, nome, email } = request.body;
      return new CustomResponse(
        200,
        "Cliente adicionado",
        await this.service.adiciona(new Cliente(cpf, nome, email))
      );
    } catch (err) {
      return new CustomError(
        "Ops, algo deu errado na operação",
        500,
        false,
        err
      );
    }
  }
  async atualiza(request: Request): Promise<CustomResponse | CustomError> {
    try {
      const result = validationResult(request);

      if (!result.isEmpty()) {
        throw new CustomError(
          "Parâmetros inválidos. Por favor, verifique as informações enviadas.",
          400,
          false,
          result.array()
        );
      }

      const { nome, email } = request.body;
      return new CustomResponse(
        200,
        "Cliente atualizado",
        await this.service.atualiza(
          new Cliente(request.params.cpf, nome, email)
        ),
        true
      );
    } catch (err) {
      return new CustomError(
        "Ops, algo deu errado na operação",
        500,
        false,
        err
      );
    }
  }

  async buscaUltimaVersao(
    request: Request
  ): Promise<CustomResponse | CustomError> {
    try {
      const result = validationResult(request);
      if (!result.isEmpty()) {
        throw new CustomError(
          "Parâmetros inválidos. Por favor, verifique as informações enviadas.",
          400,
          false,
          result.array()
        );
      }

      const { cpf } = request.params;
      const cliente = await this.service.buscaUltimaVersao(cpf);
      return new CustomResponse(200, "Cliente encontrado", cliente, true);
    } catch (err) {
      return new CustomError(
        "Ops, algo deu errado na operação",
        500,
        false,
        err
      );
    }
  }

  async autentica(request: Request): Promise<CustomResponse | CustomError> {
    try {
      const result = validationResult(request);

      if (!result.isEmpty()) {
        throw new CustomError(
          "Parâmetros inválidos. Por favor, verifique as informações enviadas.",
          400,
          false,
          result.array()
        );
      }

      const { email, cpf } = request.body;
      const response = await this.service.autenticacao(email, cpf);
      return new CustomResponse(200, "sucesso", response, true);
    } catch (err) {
      console.error(err);
      return new CustomError(
        "Ops, algo deu errado na operação",
        401,
        true,
        err
      );
    }
  }

  async buscaAutenticado(
    request: Request
  ): Promise<CustomResponse | CustomError> {
    try {
      const result = validationResult(request);

      if (!result.isEmpty()) {
        throw new CustomError(
          "Parâmetros inválidos. Por favor, verifique as informações enviadas.",
          400,
          false,
          result.array()
        );
      }

      const token: string = (request.header("X-Forwarded-Authorization") ||
        request.header("Authorization") ||
        "") as string;

      return new CustomResponse(
        200,
        "Cliente encontrado",
        await this.service.buscaAutenticado(token)
      );
    } catch (err) {
      return new CustomError(
        "Ops, algo deu errado na operação",
        500,
        false,
        err
      );
    }
  }
}
