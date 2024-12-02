import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
const client = new SecretManagerServiceClient();

async function accessSecretVersion(secretName: string, version = 'latest'): Promise<string> {
  try {
    console.log('Acessando segredo:', secretName);
    if (!process.env.GCP_PROJECT_ID) {
      throw new Error('GCP_PROJECT_ID não está definido no process.env.');
    }

    const [versionResponse] = await client.accessSecretVersion({
      name: `projects/${process.env.GCP_PROJECT_ID}/secrets/${secretName}/versions/${version}`,
    });

    return versionResponse.payload?.data?.toString() || '';
  } catch (error) {
    console.error(`Erro ao acessar versão do segredo ${secretName}:`, error);
    throw error; // Relança o erro para tratamento acima
  }
}

export { accessSecretVersion };
