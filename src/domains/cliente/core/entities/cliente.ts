import { ClienteVersao } from "./cliente.versao";

export class Cliente {
  constructor(
    cpf: string,
    nome: string,
    email: string,
    identity: string | null = null,
    versao: ClienteVersao | null = null
  ) {
    this.nome = nome;
    this.cpf = cpf;
    this.email = email;
    (this.versao = versao), (this.identity = identity);
  }

  private versao: ClienteVersao | null;
  public getVersao(): ClienteVersao | null {
    return this.versao;
  }

  private nome: string;
  public getNome(): string {
    return this.nome;
  }

  private cpf: string;
  public getCpf(): string {
    return this.cpf;
  }

  private email: string;
  public getEmail(): string {
    return this.email;
  }

  private identity: string | null;
  public getIdentity(): string | null {
    return this.identity;
  }
  public setIdentity(uid: string | null) {
    this.identity = uid;
  }

  /**
   *
   * @param comparable
   * @returns boolean
   */
  public equals(comparable: Cliente): boolean {
    /** Não gostei de fazer essa lógica, deve ter alguma forma menos custosa */

    const comparable1: any = JSON.parse(JSON.stringify(this));
    const comparable2: any = JSON.parse(JSON.stringify(comparable));

    delete comparable1.versao;
    delete comparable2.versao;

    return (
      JSON.stringify(comparable1).toLowerCase() ===
      JSON.stringify(comparable2).toLowerCase()
    );
  }
}
