import { Cliente } from "../../../../core/entities/cliente";
import { Repository } from "../../../../../suporte/infra/database/repository";
import { ICliente } from "../../../../core/applications/ports/cliente.port";
import { ClienteVersao } from "../../../../core/entities/cliente.versao";

export class ClienteDatabase extends Repository implements ICliente {
  constructor() {
    const config = {
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    };
    super(config);
  }

  async adiciona(cliente: Cliente): Promise<ClienteVersao | null> {
    const sql = `INSERT INTO clientes (cpf, nome, email, identity) VALUES (?, ?, ?, ?)`;
    const result: any = await this.query(sql, [
      cliente.getCpf(),
      cliente.getNome(),
      cliente.getEmail(),
      cliente.getIdentity(),
    ]);

    if (!result || !result.insertId) {
      throw new Error('Failed to insert cliente');
    }

    return new ClienteVersao(result.insertId.toString(), new Date());
  }

  async atualiza(cliente: Cliente): Promise<ClienteVersao | null> {
    const sql = `UPDATE clientes SET nome = ?, email = ?, identity = ? WHERE cpf = ?`;
    const result: any = await this.query(sql, [
      cliente.getNome(),
      cliente.getEmail(),
      cliente.getIdentity(),
      cliente.getCpf(),
    ]);

    if (!result || result.affectedRows === 0) {
      throw new Error('Failed to update cliente');
    }

    return new ClienteVersao(cliente.getCpf(), new Date());
  }

  async buscaUltimaVersao(cpf: string): Promise<Cliente | null> {
    const sql = `SELECT * FROM clientes WHERE cpf = ? ORDER BY id DESC LIMIT 1`;
    const results: any = await this.query(sql, [cpf]);

    if (results.length === 0) {
      return null;
    }

    const data = results[0];
    return new Cliente(
      data.cpf,
      data.nome,
      data.email,
      data.identity,
      new ClienteVersao(data.id.toString(), data.created_at)
    );
  }
}