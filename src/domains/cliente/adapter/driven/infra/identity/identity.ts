import { Cliente } from "../../../../core/entities/cliente";
import { ClienteVersao } from "../../../../core/entities/cliente.versao";
import admin from "firebase-admin";
import { Auth, CreateRequest, UserRecord } from "firebase-admin/auth";
import jwt from "jsonwebtoken";

export class Identity {
  app!: admin.app.App;
  serviceAccount: any;

  constructor() {
    try {
      this.serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT!);

      const firebaseConfig = {
        apiKey: "AIzaSyAAQ1eNMCemVmi0cQOc7XStpMx0r5EgRlM",
        authDomain: "grupo7-cliente.firebaseapp.com",
        projectId: "grupo7-cliente",
        storageBucket: "grupo7-cliente.firebasestorage.app",
        messagingSenderId: "1041965577757",
        appId: "1:1041965577757:web:2fc5714a6b782359ca38f4"
      };

      const cert = {
        projectId: this.serviceAccount.project_id,
        clientEmail: this.serviceAccount.client_email,
        privateKey: this.serviceAccount.private_key,
      };

      this.app =
        admin.apps[0] ||
      admin.initializeApp(
        {
          credential: admin.credential.cert(cert),
          databaseURL: "https://grupo7-cliente.firebaseio.com",
        }
        );
    } catch (error) {
      console.error(error);
    }
  }

  getIdentity(): Auth {
    return this.app?.auth();
  }

  createUser(cliente: Cliente): Promise<UserRecord> {
    const payload: CreateRequest = {
      email: cliente.getEmail(),
      emailVerified: false,
      password: cliente.getCpf(),
      displayName: cliente.getNome(),
      disabled: false,
    };

    return this.getIdentity().createUser(payload);
  }

  createCustomToken(cliente: Cliente, claims: any): Promise<string> {
    return this.getIdentity().createCustomToken(cliente.getIdentity()!, claims);
  }

  async verifyIdToken(token: string): Promise<Cliente> {
    const verified: jwt.JwtPayload = jwt.verify(
      token,
      this.serviceAccount.private_key
    ) as jwt.JwtPayload;

    return new Cliente(
      verified?.claims.cpf,
      verified?.claims.nome,
      verified?.claims.email!,
      verified?.uid,
      new ClienteVersao(verified?.claims.versao, verified?.claims.dataCadastro)
    );
  }
}
