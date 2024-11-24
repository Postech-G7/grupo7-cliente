import { Cliente } from "../../../../core/entities/cliente";
import { Repository } from "../../../../../suporte/infra/database/repository";
import { ICliente } from "../../../../core/applications/ports/cliente.port";
import { ClienteVersao } from "../../../../core/entities/cliente.versao";

export class ClienteDatabase extends Repository implements ICliente {
  constructor() {
    super(process.env.DATABASE_URL!);
  }

  async adiciona(cliente: Cliente): Promise<ClienteVersao | null> {
    const clienteRef = await this.getCollection(
      "lanchonete",
      "clientes"
    ).then();
    const result = await clienteRef.insertOne({
      cpf: cliente.getCpf(),
      nome: cliente.getNome(),
      email: cliente.getEmail(),
      identity: cliente.getIdentity(),
    });

    return new ClienteVersao(
      result.insertedId.toString(),
      result.insertedId.getTimestamp()
    );
  }

  async atualiza(cliente: Cliente): Promise<ClienteVersao | null> {
    console.log("entrou no atualiza", cliente);
    return this.adiciona(cliente);
  }

  async buscaUltimaVersao(cpf: string): Promise<Cliente | null> {
    const clienteRef = await this.getCollection(
      "lanchonete",
      "clientes"
    ).then();
    const cursor = clienteRef
      .find(
        { $and: [{ cpf }] },
        {
          sort: { _id: "desc" },
        }
      )
      .limit(1);

    let data;

    for await (const doc of cursor) {
      data = doc;
    }

    if (!data) {
      return null;
    }

    return new Cliente(
      data?.cpf,
      data?.nome,
      data?.email,
      data?.identity,
      new ClienteVersao(data?._id.toString(), data?._id.getTimestamp())
    );
  }
}
