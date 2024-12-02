import dotenv from 'dotenv';
import { accessSecretVersion } from './secret-manager';
const NODE_ENV = process.env?.NODE_ENV;
const ENVS = ["DATABASE_HOST", "DATABASE_PORT", "DATABASE_USER", "DATABASE_PASSWORD", "DATABASE_NAME", "SERVICE_ACCOUNT"]

if (!process.env.NODE_ENV) {
    // Carregar segredos se NODE_ENV não estiver definido
    (async () => {
      try {
        console.log('Iniciando o carregamento de segredos...');
        const secretPromises = ENVS.map(async (env) => {
          try {
            const secret = await accessSecretVersion(env);
            console.log(`Segredo ${env} carregado: ${secret}`);
            process.env[env] = secret; // Adicionar ao process.env
          } catch (error) {
            console.error(`Erro ao acessar segredo ${env}:`, error);
          }
        });
  
        // Aguarda que todos os segredos sejam carregados
        await Promise.all(secretPromises);
        console.log('Todos os segredos foram carregados.');
      } catch (err) {
        console.error('Erro geral ao carregar segredos:', err);
      }
    })();
  }
    
console.log("Ambiente configurado:", NODE_ENV ?? "GCP")
export const Environment = () => {
    if (NODE_ENV) {
        dotenv.config({path: `src/configuration/environments/${NODE_ENV}.env`})
        return;
    }
    return;
} 

