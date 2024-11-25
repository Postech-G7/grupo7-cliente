import { ClienteUseCases } from "../domains/cliente/core/applications/usecases/cliente.usecases";
import { ClienteDatabase } from "../domains/cliente/adapter/driven/infra/database/cliente.database";
import { Identity } from "../domains/cliente/adapter/driven/infra/identity/identity";
import { Cliente } from "../domains/cliente/core/entities/cliente";
import { ClienteVersao } from "../domains/cliente/core/entities/cliente.versao";
import { CustomError } from "../domains/suporte/entities/custom.error";
import { UserRecord } from "firebase-admin/auth";

jest.mock("../domains/cliente/adapter/driven/infra/database/cliente.database");
jest.mock("../domains/cliente/adapter/driven/infra/identity/identity");

describe("ClienteUseCases", () => {
  let clienteUseCases: ClienteUseCases;
  let mockDatabase: jest.Mocked<ClienteDatabase>;
  let mockIdentity: jest.Mocked<Identity>;

  beforeEach(() => {
    mockDatabase = new ClienteDatabase() as jest.Mocked<ClienteDatabase>;
    mockIdentity = new Identity() as jest.Mocked<Identity>;
    clienteUseCases = new ClienteUseCases(mockDatabase, mockIdentity);
  });

  describe("adiciona", () => {
    it("should throw an error if a client with the same CPF already exists", async () => {
      const cliente = new Cliente(
        "11111111111",
        "Marina Altoé",
        "marina@gmail.com"
      );
      mockDatabase.buscaUltimaVersao.mockResolvedValue(cliente);

      await expect(clienteUseCases.adiciona(cliente)).rejects.toThrow(
        CustomError
      );
      await expect(clienteUseCases.adiciona(cliente)).rejects.toThrow(
        "Já existe cliente para esse CPF"
      );
    });

    it("should add a new client if no client with the same CPF exists", async () => {
      const cliente = new Cliente(
        "12345678900",
        "Marina Altoé",
        "marina@gmail.com"
      );

      const user = {
        uid: "5wOrQ6aX94fudFwC32cFaPnVgP73",
        email: "marina@gmail.com",
        emailVerified: false,
        displayName: "Marina",
        photoURL: undefined,
        phoneNumber: undefined,
        disabled: false,
        metadata: {
          creationTime: "Sun, 24 Nov 2024 23:43:21 GMT",
          lastSignInTime: null,
          lastRefreshTime: null,
        },
        providerData: [
          {
            uid: "marina@gmail.com",
            displayName: "Marina",
            email: "marina@gmail.com",
            photoURL: undefined,
            providerId: "password",
            phoneNumber: undefined,
          },
        ],
        passwordHash: undefined,
        passwordSalt: undefined,
        tokensValidAfterTime: "Sun, 24 Nov 2024 23:43:21 GMT",
        tenantId: undefined,
      } as unknown as UserRecord;

      const clienteVersao = new ClienteVersao(
        "6743ba1bb8b15c02a34b0341",
        "2024-11-24T23:30:52.000Z" as unknown as Date
      );

      mockDatabase.buscaUltimaVersao.mockResolvedValue(null);
      mockIdentity.createUser.mockResolvedValue(user);
      mockDatabase.adiciona.mockResolvedValue(clienteVersao);

      const result = await clienteUseCases.adiciona(cliente);

      expect(result).toBe(clienteVersao);
      expect(mockDatabase.buscaUltimaVersao).toHaveBeenCalledWith(
        cliente.getCpf()
      );
      expect(mockIdentity.createUser).toHaveBeenCalledWith(cliente);
      expect(mockDatabase.adiciona).toHaveBeenCalledWith(cliente);
      expect(cliente.getIdentity()).toBe(user.uid);
    });
  });

  describe("atualiza", () => {
    it("should throw an error if no client with the given CPF exists", async () => {
      const cliente = new Cliente(
        "12345678900",
        "Marina Altoé",
        "marina@gmail.com"
      );
      mockDatabase.buscaUltimaVersao.mockResolvedValue(null);

      await expect(clienteUseCases.atualiza(cliente)).rejects.toThrow(
        CustomError
      );
      await expect(clienteUseCases.atualiza(cliente)).rejects.toThrow(
        "Cliente não encontrado"
      );
    });

    it("should throw an error if no information is updated", async () => {
      const cliente = new Cliente(
        "12345678900",
        "Marina Altoé",
        "marina@gmail.com"
      );
      mockDatabase.buscaUltimaVersao.mockResolvedValue(cliente);

      await expect(clienteUseCases.atualiza(cliente)).rejects.toThrow(
        CustomError
      );
      await expect(clienteUseCases.atualiza(cliente)).rejects.toThrow(
        "Nenhuma informação para atualizar"
      );
    });

    it("should update the client if information is different", async () => {
      const cliente = new Cliente(
        "12345678900",
        "Marina Altoé",
        "marina@gmail.com"
      );
      const updatedCliente = new Cliente(
        "12345678900",
        "Marina Altoé",
        "marina_updated@gmail.com"
      );
      const clienteVersao = new ClienteVersao(
        "6743ba1bb8b15c02a34b0341",
        new Date()
      );

      mockDatabase.buscaUltimaVersao.mockResolvedValue(cliente);
      mockDatabase.atualiza.mockResolvedValue(clienteVersao);

      const result = await clienteUseCases.atualiza(updatedCliente);

      expect(result).toBe(clienteVersao);
      expect(mockDatabase.buscaUltimaVersao).toHaveBeenCalledWith(
        updatedCliente.getCpf()
      );
      expect(mockDatabase.atualiza).toHaveBeenCalledWith(updatedCliente);
    });
  });

  describe("buscaUltimaVersao", () => {
    it("should return the latest version of the client if it exists", async () => {
      const cliente = new Cliente(
        "12345678900",
        "Marina Altoé",
        "marina@gmail.com"
      );
      mockDatabase.buscaUltimaVersao.mockResolvedValue(cliente);

      const result = await clienteUseCases.buscaUltimaVersao(cliente.getCpf());

      expect(result).toBe(cliente);
      expect(mockDatabase.buscaUltimaVersao).toHaveBeenCalledWith(
        cliente.getCpf()
      );
    });

    it("should throw an error if the client does not exist", async () => {
      mockDatabase.buscaUltimaVersao.mockResolvedValue(null);

      await expect(
        clienteUseCases.buscaUltimaVersao("12345678900")
      ).rejects.toThrow(CustomError);
      await expect(
        clienteUseCases.buscaUltimaVersao("12345678900")
      ).rejects.toThrow("Cliente não encontrado com o CPF informado");
    });
  });

  describe("autenticacao", () => {
    it("should throw an error if the client does not exist", async () => {
      mockDatabase.buscaUltimaVersao.mockResolvedValue(null);

      await expect(
        clienteUseCases.autenticacao("marina@gmail.com", "12345678900")
      ).rejects.toThrow(CustomError);
      await expect(
        clienteUseCases.autenticacao("marina@gmail.com", "12345678900")
      ).rejects.toThrow("Cliente não encontrado com o CPF informado");
    });

    it("should throw an error if the email does not match", async () => {
      const cliente = new Cliente(
        "12345678900",
        "Marina Altoé",
        "marina@gmail.com"
      );
      mockDatabase.buscaUltimaVersao.mockResolvedValue(cliente);

      await expect(
        clienteUseCases.autenticacao("wrongemail@gmail.com", "12345678900")
      ).rejects.toThrow(CustomError);
      await expect(
        clienteUseCases.autenticacao("wrongemail@gmail.com", "12345678900")
      ).rejects.toThrow("Cliente não encontrado com o CPF informado");
    });

    it("should return a token if the client exists and email matches", async () => {
      const cliente = new Cliente(
        "12345678900",
        "Marina Altoé",
        "marina@gmail.com"
      );
      const token = "mockToken";
      mockDatabase.buscaUltimaVersao.mockResolvedValue(cliente);
      mockIdentity.createCustomToken.mockResolvedValue(token);

      const result = await clienteUseCases.autenticacao(
        "marina@gmail.com",
        "12345678900"
      );

      expect(result).toBe(token);
      expect(mockDatabase.buscaUltimaVersao).toHaveBeenCalledWith(
        "12345678900"
      );
      expect(mockIdentity.createCustomToken).toHaveBeenCalledWith(
        cliente,
        expect.any(Object)
      );
    });
  });

  describe("buscaAutenticado", () => {
    it("should return the client if the token is valid", async () => {
      const cliente = new Cliente(
        "12345678900",
        "Marina Altoé",
        "marina@gmail.com"
      );
      mockIdentity.verifyIdToken.mockResolvedValue(cliente);

      const result = await clienteUseCases.buscaAutenticado("Bearer mockToken");

      expect(result).toBe(cliente);
      expect(mockIdentity.verifyIdToken).toHaveBeenCalledWith("mockToken");
    });

    it("should throw an error if the token is invalid", async () => {
      mockIdentity.verifyIdToken.mockRejectedValue(new Error());

      await expect(
        clienteUseCases.buscaAutenticado("Bearer mockToken")
      ).rejects.toThrow(CustomError);
      await expect(
        clienteUseCases.buscaAutenticado("Bearer mockToken")
      ).rejects.toThrow("Cliente não está autenticado");
    });
  });
});
