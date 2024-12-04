import { ClienteDatabase } from "./cliente.database";
import { Repository } from "../../../../../suporte/infra/database/repository";
import { Cliente } from "../../../../core/entities/cliente";
import { ClienteVersao } from "../../../../core/entities/cliente.versao";

jest.mock("../../../../../suporte/infra/database/repository");

describe("ClienteDatabase", () => {
  let clienteDatabase: ClienteDatabase;
  let repository: jest.Mocked<Repository>;

  beforeEach(() => {
    repository = new Repository({
      port: 3000,
    }) as jest.Mocked<Repository>;
    clienteDatabase = new ClienteDatabase(repository);
  });

  describe("adiciona", () => {
    it("should add a new cliente and return ClienteVersao", async () => {
      const cliente = new Cliente(
        "11111111111",
        "Marina Altoé",
        "marina@gmail.com",
        "id123"
      );
      repository.query.mockResolvedValue({ insertId: 1 } as any);

      const result = await clienteDatabase.adiciona(cliente);

      expect(repository.query).toHaveBeenCalledWith(
        "INSERT INTO clientes (cpf, nome, email, identity) VALUES (?, ?, ?, ?)",
        ["11111111111", "Marina Altoé", "marina@gmail.com", "id123"]
      );
      expect(result).toEqual(new ClienteVersao("1", expect.any(Date)));
    });

    it("should throw an error if insert fails", async () => {
      const cliente = new Cliente(
        "11111111111",
        "Marina Altoé",
        "marina@gmail.com",
        "id123"
      );
      repository.query.mockResolvedValue([]);

      await expect(clienteDatabase.adiciona(cliente)).rejects.toThrow(
        "Falha ao inserir cliente"
      );
    });
  });

  describe("atualiza", () => {
    it("should update an existing cliente and return ClienteVersao", async () => {
      const cliente = new Cliente(
        "11111111111",
        "Marina Altoé",
        "marina@gmail.com",
        "id123"
      );
      repository.query.mockResolvedValue({ affectedRows: 1 } as any);

      const result = await clienteDatabase.atualiza(cliente);

      expect(repository.query).toHaveBeenCalledWith(
        "UPDATE clientes SET nome = ?, email = ?, identity = ? WHERE cpf = ?",
        ["Marina Altoé", "marina@gmail.com", "id123", "11111111111"]
      );
      expect(result).toEqual(
        new ClienteVersao("11111111111", expect.any(Date))
      );
    });

    it("should throw an error if update fails", async () => {
      const cliente = new Cliente(
        "11111111111",
        "Marina Altoé",
        "marina@gmail.com",
        "id123"
      );
      repository.query.mockResolvedValue({ affectedRows: 0 } as any);

      await expect(clienteDatabase.atualiza(cliente)).rejects.toThrow(
        "Falha ao atualizar cliente"
      );
    });
  });

  describe("buscaUltimaVersao", () => {
    it("should return the latest version of a cliente", async () => {
      const cpf = "11111111111";
      const mockData = {
        cpf: "11111111111",
        nome: "Marina Altoé",
        email: "marina@gmail.com",
        identity: "id123",
        id: 1,
        created_at: "2023-01-01T00:00:00Z",
      };
      repository.query.mockResolvedValue([mockData] as any);

      const result = await clienteDatabase.buscaUltimaVersao(cpf);

      expect(repository.query).toHaveBeenCalledWith(
        "SELECT * FROM clientes WHERE cpf = ? ORDER BY id DESC LIMIT 1",
        [cpf]
      );
      expect(result).toEqual(
        new Cliente(
          "11111111111",
          "Marina Altoé",
          "marina@gmail.com",
          "id123",
          new ClienteVersao("1", new Date("2023-01-01T00:00:00Z"))
        )
      );
    });

    it("should return null if no cliente is found", async () => {
      const cpf = "11111111111";
      repository.query.mockResolvedValue([]);

      const result = await clienteDatabase.buscaUltimaVersao(cpf);

      expect(repository.query).toHaveBeenCalledWith(
        "SELECT * FROM clientes WHERE cpf = ? ORDER BY id DESC LIMIT 1",
        [cpf]
      );
      expect(result).toBeNull();
    });
  });
});
