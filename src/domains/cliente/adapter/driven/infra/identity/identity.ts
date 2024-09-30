import { Cliente } from "../../../../../../domains/cliente/core/entities/cliente";
import { ClienteVersao } from "../../../../../../domains/cliente/core/entities/cliente.versao";
import * as AWS from 'aws-sdk';
import jwt from "jsonwebtoken";

export class Identity {
  private cognitoidentityserviceprovider: AWS.CognitoIdentityServiceProvider;
  private userPoolId: string;
  private clientId: string;
  private region: string;

  constructor() {
    this.userPoolId = process.env.USER_POOL_ID!;
    this.clientId = process.env.CLIENT_ID!;
    this.region = process.env.REGION!;

    this.cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
      region: this.region,
    });
  }

  async createUser(cliente: Cliente): Promise<AWS.CognitoIdentityServiceProvider.AdminCreateUserResponse> {
    if (!cliente || !cliente.getEmail()) {
      throw new Error('Invalid cliente object');
    }

    const params: AWS.CognitoIdentityServiceProvider.Types.AdminCreateUserRequest = {
      UserPoolId: this.userPoolId,
      Username: cliente.getEmail(),
      UserAttributes: [
        {
          Name: 'email',
          Value: cliente.getEmail(),
        },
        {
          Name: 'email_verified',
          Value: 'true',
        },
      ],
      MessageAction: 'SUPPRESS',
    };

    try {
      return await this.cognitoidentityserviceprovider.adminCreateUser(params).promise();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createCustomToken(cliente: Cliente, claims: any): Promise<string> {
    if (!cliente || !cliente.getEmail()) {
      throw new Error('Invalid cliente object');
    }

    try {
      const user = await this.cognitoidentityserviceprovider.adminGetUser({
        UserPoolId: this.userPoolId,
        Username: cliente.getEmail(),
      }).promise();

      const token = jwt.sign({
        sub: user.UserAttributes?.find(attr => attr.Name === 'sub')?.Value ?? '',
        email: user.UserAttributes?.find(attr => attr.Name === 'email')?.Value ?? '',
        ...claims,
      }, process.env.SECRET_KEY!, {
        expiresIn: '1h',
      });

      return token;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async verifyIdToken(token: string): Promise<Cliente> {
    try {
      const verified = jwt.verify(token, process.env.SECRET_KEY!) as jwt.JwtPayload;

      return new Cliente(
        verified.email,
        '',
        verified.email,
        verified.sub,
        new ClienteVersao(
          verified.iat ? new Date(verified.iat * 1000) : new Date(),
          verified.exp ? new Date(verified.exp * 1000) : new Date()
        ) // Adjust these Date values to match your requirements
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}