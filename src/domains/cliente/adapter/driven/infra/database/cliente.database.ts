import { Cliente } from "../../../../core/entities/cliente";
import { Repository } from "../../../../../suporte/infra/database/repository";
import { ICliente } from "../../../../core/applications/ports/cliente.port";
import { ClienteVersao } from "../../../../core/entities/cliente.versao";

export class ClienteDatabase implements ICliente {
  private repository: Repository;

  constructor(repository: Repository) {
    this.repository = repository;
  }

  async adiciona(cliente: Cliente): Promise<ClienteVersao | null> {
    const sql = `INSERT INTO clientes (cpf, nome, email, identity) VALUES (?, ?, ?, ?)`;
    const result: any = await this.repository.query(sql, [
      cliente.getCpf(),
      cliente.getNome(),
      cliente.getEmail(),
      cliente.getIdentity(),
    ]);

    if (!result || !result.insertId) {
      throw new Error("Falha ao inserir cliente");
    }

    return new ClienteVersao(result.insertId.toString(), new Date());
  }

  async atualiza(cliente: Cliente): Promise<ClienteVersao | null> {
    const sql = `UPDATE clientes SET nome = ?, email = ?, identity = ? WHERE cpf = ?`;
    const result: any = await this.repository.query(sql, [
      cliente.getNome(),
      cliente.getEmail(),
      cliente.getIdentity(),
      cliente.getCpf(),
    ]);

    if (!result || result.affectedRows === 0) {
      throw new Error("Falha ao atualizar cliente");
    }

    return new ClienteVersao(cliente.getCpf(), new Date());
  }

  async buscaUltimaVersao(cpf: string): Promise<Cliente | null> {
    const sql = `SELECT * FROM clientes WHERE cpf = ? ORDER BY id DESC LIMIT 1`;
    const results: any = await this.repository.query(sql, [cpf]);

    if (results.length === 0) {
      return null;
    }

    const data = results[0];
    return new Cliente(
      data.cpf,
      data.nome,
      data.email,
      data.identity,
      new ClienteVersao(data.id.toString(), new Date(data.created_at))
    );
  }
}
