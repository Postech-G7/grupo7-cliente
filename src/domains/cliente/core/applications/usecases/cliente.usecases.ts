import { Cliente } from "../../entities/cliente";
import { ClienteVersao } from "../../entities/cliente.versao";
import { ClienteDatabase } from "../../../adapter/driven/infra/database/cliente.database";
import { CustomError } from "../../../../suporte/entities/custom.error";
import { Identity } from "../../../adapter/driven/infra/identity/identity";

export class ClienteUseCases {
  constructor(
    private readonly database: ClienteDatabase,
    private readonly identity: Identity
  ) {
    this.database = database;
    this.identity = identity;
  }

  async adiciona(cliente: Cliente): Promise<ClienteVersao> {
    try {
      const ultimaVersao = await this.database.buscaUltimaVersao(
        cliente.getCpf()
      );

      if (ultimaVersao) {
        throw new CustomError(
          "Já existe cliente para esse CPF",
          400,
          false,
          []
        );
      }

      const user = await this.identity.createUser(cliente); // cria o usuário no firebase

      cliente.setIdentity(user.uid); // seta o uid do firebase no cliente

      const clienteVersao = await this.database.adiciona(cliente);
      if (!clienteVersao) {
        throw new CustomError("Falha ao adicionar cliente", 500, false, []);
      }
      return clienteVersao;
    } catch (error) {
      console.error("Error in adiciona:", error);
      throw new CustomError("Ops, algo deu errado na operação", 500, false, []);
    }
  }

  async atualiza(cliente: Cliente): Promise<ClienteVersao> {
    try {
      const ultimaVersao = await this.database.buscaUltimaVersao(
        cliente.getCpf()
      );

      if (ultimaVersao) {
        if (cliente.equals(ultimaVersao)) {
          throw new CustomError(
            "Nenhuma informação para atualizar",
            400,
            false,
            []
          );
        }
      } else {
        throw new CustomError("Cliente não encontrado", 404, false, []);
      }

      const clienteVersao = await this.database.atualiza(cliente);
      if (!clienteVersao) {
        throw new CustomError("Falha ao atualizar cliente", 500, false, []);
      }
      return clienteVersao;
    } catch (error) {
      console.error("Error in atualiza:", error);
      throw new CustomError("Ops, algo deu errado na operação", 500, false, []);
    }
  }

  async buscaUltimaVersao(cpf: string): Promise<Cliente> {
    try {
      const ultimaVersao = await this.database.buscaUltimaVersao(cpf);
      if (ultimaVersao) {
        return ultimaVersao;
      } else {
        throw new CustomError(
          "Cliente não encontrado com o CPF informado",
          404,
          false,
          []
        );
      }
    } catch (error) {
      console.error("Error in buscaUltimaVersao:", error);
      throw new CustomError("Ops, algo deu errado na operação", 500, false, []);
    }
  }

  async autenticacao(email: string, cpf: string): Promise<string> {
    try {
      console.info("autenticacao");
      const ultimaVersao: Cliente | null =
        await this.database.buscaUltimaVersao(cpf); //verifica se o cliente existe no banco e retorna a ultima versao

      if (
        !ultimaVersao ||
        email?.toLowerCase() !== ultimaVersao.getEmail().toLowerCase()
      ) {
        throw new CustomError(
          "Cliente não encontrado com o CPF informado",
          401,
          false,
          []
        );
      }

      console.info("vai criar o token");
      return this.identity.createCustomToken(ultimaVersao, {
        //cria o token de autenticação
        cpf,
        nome: ultimaVersao.getNome(),
        email,
        versao: ultimaVersao.getVersao()?.versao,
        dataCadastro: ultimaVersao.getVersao()?.dataCadastro,
      });
    } catch (error) {
      console.error("Error in autenticacao:", error);
      throw new CustomError("Ops, algo deu errado na operação", 500, false, []);
    }
  }

  async buscaAutenticado(token: string): Promise<Cliente> {
    try {
      let cliente: Cliente | null = null;
      try {
        cliente = await this.identity.verifyIdToken(
          token.replace("Bearer ", "")
        );
      } catch (error) {
        console.error("Error in verifyIdToken:", error);
      }

      if (cliente) {
        return cliente;
      } else {
        throw new CustomError("Cliente não está autenticado", 404, false, []);
      }
    } catch (error) {
      console.error("Error in buscaAutenticado:", error);
      throw new CustomError("Ops, algo deu errado na operação", 500, false, []);
    }
  }
}
