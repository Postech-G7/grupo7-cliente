import dotenv from 'dotenv';
import { accessSecretVersion } from './secret-manager';
const NODE_ENV = process.env?.NODE_ENV ?? process.env?.GCP_ENV ?? "";
const ENVS = ["DATABASE_HOST", "DATABASE_PORT", "DATABASE_USER", "DATABASE_PASSWORD", "DATABASE_NAME", "SERVICE_ACCOUNT"]

if (!NODE_ENV) { 
    for (const env of ENVS) {
        accessSecretVersion(env)
            .then((secret) => {
                console.log('Segredo carregado:', secret);
                process.env[env] = secret;
        })
        .catch((err) => console.error('Erro ao acessar segredo:', err));
    }
}
    
console.log("Ambiente configurado:", NODE_ENV ?? "GCP");
export const Environment = () => {
    if (NODE_ENV) {
        dotenv.config({path: `src/configuration/environments/${NODE_ENV}.env`})
        return;
    }
    return;
} 

