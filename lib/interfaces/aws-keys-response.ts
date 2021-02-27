import { RSA } from 'jwk-to-pem';

export default interface AwsKeyResponse {
  keys: (RSA & { kid: string })[];
}
