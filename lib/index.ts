import KeyValueDict from './interfaces/key-value-dict';
import { fetchPems, verifyToken } from './functions';
import CognitoJwtVerifier from './cognitoVerifier';

let cachedPems: KeyValueDict | undefined;

async function hydratePemCache(awsRegion: string, userPoolId: string): Promise<void> {
  cachedPems = await fetchPems(awsRegion, userPoolId);
}

export async function verifyCognitoToken(
  awsRegion: string,
  userPoolId: string,
  token: string,
  appClientId: string,
): Promise<object> {
  if (cachedPems === undefined) {
    await hydratePemCache(awsRegion, userPoolId);
  }
  try {
    return await verifyToken(awsRegion, userPoolId, token, appClientId, cachedPems as KeyValueDict);
  } catch (error) {
    throw error;
  }
}

export { CognitoJwtVerifier };
