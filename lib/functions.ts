import axios from 'axios';
import AwsKeyResponse from './interfaces/aws-keys-response';
import { RSA } from 'jwk-to-pem';
import jwkToPem = require('jwk-to-pem');
import KeyValueDict from './interfaces/key-value-dict';
import { Algorithm, decode, JsonWebTokenError, verify } from 'jsonwebtoken';
import TokenHeader from './interfaces/token-header';

export async function fetchPems(awsRegion: string, userPoolId: string): Promise<KeyValueDict> {
  const pems: KeyValueDict = {};
  const jwksUrl: string = `https://cognito-idp.${awsRegion}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
  const jwkResponse = await axios.get<AwsKeyResponse>(jwksUrl);
  jwkResponse.data.keys.forEach((rsa: RSA & { kid: string }) => {
    const pem: string = jwkToPem(rsa);
    pems[rsa.kid] = pem;
  });
  return pems;
}

export async function verifyToken(
  awsRegion: string,
  userPoolId: string,
  token: string,
  appClientId: string,
  pems: KeyValueDict,
  isDev: boolean = false,
): Promise<object> {
  const decodedToken = decode(token, { complete: true });
  if (decodedToken == null) {
    throw new JsonWebTokenError('Decoded token is null');
  }
  const header: TokenHeader = (decodedToken as { header: TokenHeader }).header;

  const pem: string = pems[header.kid];
  const decodedPayload = verify(token, pem, {
    algorithms: [header.alg as Algorithm],
    ignoreExpiration: isDev,
  }) as object;
  const aud: string = (decodedPayload as { aud: string }).aud;
  const iss: string = (decodedPayload as { iss: string }).iss;
  if (aud !== appClientId) {
    throw new JsonWebTokenError('App client id does not correspond to the one encoded in the token');
  }
  if (iss !== `https://cognito-idp.${awsRegion}.amazonaws.com/${userPoolId}`) {
    throw new JsonWebTokenError('Issuer does not correspond to the one encoded in the token');
  }
  return decodedPayload;
}
