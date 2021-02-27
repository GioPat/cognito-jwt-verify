import axios from 'axios';
import { Algorithm, decode, JsonWebTokenError, verify } from 'jsonwebtoken';
import { RSA } from 'jwk-to-pem';
import jwkToPem = require('jwk-to-pem');

import KeyValueDict from './interfaces/key-value-dict';
import TokenHeader from './interfaces/token-header';
import AwsKeyResponse from './interfaces/aws-keys-response';

let cachedPems: KeyValueDict | undefined;

async function hydratePemCache(awsRegion: string, userPoolId: string): Promise<void> {
  cachedPems = {};
  const jwksUrl: string = `https://cognito-idp.${awsRegion}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
  await axios.get<AwsKeyResponse>(jwksUrl).then((response) => {
    response.data.keys.forEach((rsa: RSA & { kid: string }) => {
      const pem: string = jwkToPem(rsa);
      (cachedPems as KeyValueDict)[rsa.kid] = pem;
    });
  });
}

export async function verifyCognitoToken(
  awsRegion: string,
  userPoolId: string,
  token: string,
  app_client_id: string,
): Promise<object> {
  const decodedToken = decode(token, { complete: true });
  if (decodedToken == null) {
    throw new JsonWebTokenError('Decoded token is null');
  }
  const header: TokenHeader = (decodedToken as { header: TokenHeader }).header;
  if (cachedPems === undefined) {
    await hydratePemCache(awsRegion, userPoolId);
  }
  const pem: string = (cachedPems as KeyValueDict)[header.kid];
  try {
    const decodedPayload = verify(token, pem, { algorithms: [header.alg as Algorithm] }) as object;
    const aud: string = (decodedPayload as { aud: string}).aud;
    const iss: string = (decodedPayload as { iss: string }).iss;
    if (aud !== app_client_id) {
      throw new JsonWebTokenError('App client id does not correspond to the one encoded in the token');
    }
    if (iss !== `https://cognito-idp.${awsRegion}.amazonaws.com/${userPoolId}`) {
      throw new JsonWebTokenError('Issuer does not correspond to the one encoded in the token');
    }
    return decodedPayload;
  } catch (error) {
    throw error;
  }
}
