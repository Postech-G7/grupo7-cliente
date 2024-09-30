export class ClienteVersao {
  issuedAt: Date;
  expiresAt: Date;

  constructor(issuedAt: Date, expiresAt: Date) {
    this.issuedAt = issuedAt;
    this.expiresAt = expiresAt;
  }

    public getVersao(): string {
        return '1.0.0'
    }

    public getDataCriacao(): Date {
        return this.issuedAt
    }

    public getDataExpiracao(): Date {
        return this.expiresAt
    }
}