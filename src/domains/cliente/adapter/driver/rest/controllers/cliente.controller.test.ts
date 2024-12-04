import { Cliente } from "../../../../core/entities/cliente";
import { ClienteUseCases } from "../../../../core/applications/usecases/cliente.usecases";
import { ClienteController } from "./cliente.controller";
import { ClienteVersao } from "../../../../core/entities/cliente.versao";
import { CustomResponse } from "../../../../../suporte/entities/custom.response";
import { CustomError } from "../../../../..//suporte/entities/custom.error";

describe("ClienteController", () => {
  let clienteController: ClienteController;
  let clienteUseCases: jest.Mocked<ClienteUseCases>;

  beforeEach(() => {
    clienteUseCases = {
      adiciona: jest.fn(),
      atualiza: jest.fn(),
      buscaUltimaVersao: jest.fn(),
      autenticacao: jest.fn(),
      buscaAutenticado: jest.fn(),
    } as unknown as jest.Mocked<ClienteUseCases>;

    clienteController = new ClienteController(clienteUseCases);
  });

  describe("adiciona", () => {
    it("should return CustomResponse when valid request", async () => {
      const request = {
        body: { cpf: "11111111111", nome: "Marina", email: "marina@gmail.com" },
      } as unknown as Request;

      clienteUseCases.adiciona.mockResolvedValueOnce(
        new ClienteVersao("1", new Date("2024-12-03"))
      );

      const response = await clienteController.adiciona(request as any);

      expect(response).toBeInstanceOf(CustomResponse);
      expect(clienteUseCases.adiciona).toHaveBeenCalledWith(
        new Cliente("11111111111", "Marina", "marina@gmail.com")
      );
    });

    it("should return CustomError when validation fails", async () => {
      const request = { body: { nome: "Marina" } } as unknown as Request;

      const response = await clienteController.adiciona(request as any);

      expect(response).toBeInstanceOf(CustomError);
      expect(response).toHaveProperty(
        "message",
        "Parâmetros inválidos. Por favor, verifique as informações enviadas."
      );
    });
  });

  describe("atualiza", () => {
    it("should return CustomResponse when valid request", async () => {
      const request = {
        body: { nome: "Marina", email: "marina@gmail.com" },
        params: { cpf: "11111111111" },
      } as unknown as Request;

      clienteUseCases.atualiza.mockResolvedValueOnce(
        new ClienteVersao("2", new Date("2024-12-03"))
      );

      const response = await clienteController.atualiza(request as any);

      expect(response).toBeInstanceOf(CustomResponse);
      expect(clienteUseCases.atualiza).toHaveBeenCalledWith(
        new Cliente("11111111111", "Marina", "marina@gmail.com")
      );
    });

    it("should return CustomError when validation fails", async () => {
      const request = {
        body: { cpf: "11111111111", email: "marina@gmail.com" },
      } as unknown as Request;

      const response = await clienteController.atualiza(request as any);

      expect(response).toBeInstanceOf(CustomError);
      expect(response).toHaveProperty(
        "message",
        "Parâmetros inválidos. Por favor, verifique as informações enviadas."
      );
    });
  });

  describe("buscaUltimaVersao", () => {
    it("should return CustomResponse when valid request", async () => {
      const request = {
        params: { cpf: "11111111111" },
      } as unknown as Request;

      clienteUseCases.buscaUltimaVersao.mockResolvedValueOnce(
        new Cliente("11111111111", "Marina", "marina@gmail.com")
      );

      const response = await clienteController.buscaUltimaVersao(
        request as any
      );

      expect(response).toBeInstanceOf(CustomResponse);
      expect(clienteUseCases.buscaUltimaVersao).toHaveBeenCalledWith(
        "11111111111"
      );
    });

    it("should return CustomError when validation fails", async () => {
      const request = { params: "" } as unknown as Request;

      const response = await clienteController.buscaUltimaVersao(
        request as any
      );

      expect(response).toBeInstanceOf(CustomError);
      expect(response).toHaveProperty(
        "message",
        "Parâmetros inválidos. Por favor, verifique as informações enviadas."
      );
    });
  });

  describe("autentica", () => {
    it("should return CustomResponse when valid request", async () => {
      const request = {
        body: { email: "marina@gmail.com", cpf: "11111111111" },
      } as unknown as Request;

      clienteUseCases.autenticacao.mockResolvedValueOnce({
        token: "token",
      } as any);

      const response = await clienteController.autentica(request as any);

      expect(response).toBeInstanceOf(CustomResponse);
      expect(clienteUseCases.autenticacao).toHaveBeenCalledWith(
        "marina@gmail.com",
        "11111111111"
      );
    });

    it("should return CustomError when validation fails", async () => {
      const request = {
        body: {},
      } as unknown as Request;

      const response = await clienteController.autentica(request as any);

      expect(response).toBeInstanceOf(CustomError);
      expect(response).toHaveProperty(
        "message",
        "Parâmetros inválidos. Por favor, verifique as informações enviadas."
      );
    });
  });

  describe("buscaAutenticado", () => {
    it("should return CustomResponse when valid request", async () => {
      const request = {
        header: jest.fn().mockReturnValue("token"),
      } as unknown as Request;

      clienteUseCases.buscaAutenticado.mockResolvedValueOnce(
        new Cliente("11111111111", "Marina", "marina@gmail.com")
      );

      const response = await clienteController.buscaAutenticado(request as any);

      expect(response).toBeInstanceOf(CustomResponse);
      expect(clienteUseCases.buscaAutenticado).toHaveBeenCalledWith("token");
    });

    it("should return CustomError when validation fails", async () => {
      const request = {
        header: {},
      } as unknown as Request;

      const response = await clienteController.buscaAutenticado(request as any);

      expect(response).toBeInstanceOf(CustomError);
      expect(response).toHaveProperty(
        "message",
        "Ops, algo deu errado na operação"
      );
    });
  });
});
