import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
const client = new SecretManagerServiceClient();

async function accessSecretVersion(secretName: string, version = 'latest') {
  const [versionResponse] = await client.accessSecretVersion({
    name: `projects/${process.env.GCP_PROJECT_ID}/secrets/${secretName}/versions/${version}`,
  });
  return versionResponse.payload?.data?.toString() || "";
}

export { accessSecretVersion };
