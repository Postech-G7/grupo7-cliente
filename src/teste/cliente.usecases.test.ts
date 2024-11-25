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
});
