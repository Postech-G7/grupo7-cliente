import { Cliente } from "../../../../../domains/cliente/core/entities/cliente";
import { ClienteVersao } from "../../../../../domains/cliente/core/entities/cliente.versao";
import { ClienteDatabase } from "../../../../../domains/cliente/adapter/driven/infra/database/cliente.database";
import { CustomError } from "../../../../../domains/suporte/entities/custom.error";
import { Identity } from "../../../../../domains/cliente/adapter/driven/infra/identity/identity";

export class ClienteUseCases {
  constructor(
    private readonly database: ClienteDatabase,
    private readonly identity: Identity
  ) {
    this.database = database;
    this.identity = identity;
  }

  async adiciona(cliente: Cliente): Promise<ClienteVersao> {
    const ultimaVersao = await this.database.buscaUltimaVersao(
      cliente.getCpf()
    );

    if (ultimaVersao) {
      throw new CustomError("Já existe cliente para esse CPF", 400, false, []);
    }

    const user = await this.identity.createUser(cliente) as { uid: string }; // cria o usuário no firebase

    cliente.setIdentity(user.uid); // seta o uid do firebase no cliente

    return await this.database.adiciona(cliente).then();
  }

  async atualiza(cliente: Cliente): Promise<ClienteVersao> {
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

    return await this.database.atualiza(cliente).then();
  }

  async buscaUltimaVersao(cpf: string): Promise<Cliente> {
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
  }

  async autenticacao(email: string, cpf: string): Promise<string> {

    console.info('autenticacao')
    const ultimaVersao: Cliente | null = await this.database.buscaUltimaVersao(cpf) //verifica se o cliente existe no banco e retorna a ultima versao

    if (!ultimaVersao || email?.toLowerCase() !== ultimaVersao.getEmail().toLowerCase()) {
      throw new CustomError('Cliente não encontrado com o CPF informado', 401, false, [])
    }

    console.info('vai criar o token')
    return this.identity.createCustomToken(ultimaVersao, { //cria o token de autenticação
      cpf,
      nome: ultimaVersao.getNome(),
      email,
      versao: ultimaVersao.getVersao()?.getVersao(),
      dataCadastro: ultimaVersao.getVersao()?.getDataCriacao(),
    })
  }

  async buscaAutenticado(token: string): Promise<Cliente> {
    let cliente: Cliente | null = null;
    try {
      cliente = await this.identity.verifyIdToken(token.replace('Bearer ', ''))
    } catch (error) {
      console.error(error)
    }

    if (cliente) {
      return cliente
    } else {
      throw new CustomError('Cliente não está autenticado', 404, false, [])
    }
  }
}
