import { verifyToken } from './../lib/index';
import axios from 'axios';
import { sign } from 'jsonwebtoken';
import MockAdapter from 'axios-mock-adapter';

const fakeRsaPrivateKey: string = `-----BEGIN RSA PRIVATE KEY-----
MIICWwIBAAKBgQDdlatRjRjogo3WojgGHFHYLugdUWAY9iR3fy4arWNA1KoS8kVw
33cJibXr8bvwUAUparCwlvdbH6dvEOfou0/gCFQsHUfQrSDv+MuSUMAe8jzKE4qW
+jK+xQU9a03GUnKHkkle+Q0pX/g6jXZ7r1/xAK5Do2kQ+X5xK9cipRgEKwIDAQAB
AoGAD+onAtVye4ic7VR7V50DF9bOnwRwNXrARcDhq9LWNRrRGElESYYTQ6EbatXS
3MCyjjX2eMhu/aF5YhXBwkppwxg+EOmXeh+MzL7Zh284OuPbkglAaGhV9bb6/5Cp
uGb1esyPbYW+Ty2PC0GSZfIXkXs76jXAu9TOBvD0ybc2YlkCQQDywg2R/7t3Q2OE
2+yo382CLJdrlSLVROWKwb4tb2PjhY4XAwV8d1vy0RenxTB+K5Mu57uVSTHtrMK0
GAtFr833AkEA6avx20OHo61Yela/4k5kQDtjEf1N0LfI+BcWZtxsS3jDM3i1Hp0K
Su5rsCPb8acJo5RO26gGVrfAsDcIXKC+bQJAZZ2XIpsitLyPpuiMOvBbzPavd4gY
6Z8KWrfYzJoI/Q9FuBo6rKwl4BFoToD7WIUS+hpkagwWiz+6zLoX1dbOZwJACmH5
fSSjAkLRi54PKJ8TFUeOP15h9sQzydI8zJU+upvDEKZsZc/UhT/SySDOxQ4G/523
Y0sz/OZtSWcol/UMgQJALesy++GdvoIDLfJX5GBQpuFgFenRiRDabxrE9MNUZ2aP
FaFp+DyAe+b4nDwuJaW2LURbr8AEZga7oQj0uYxcYw==
-----END RSA PRIVATE KEY-----`

const fakeRegion = 'fake-region';

const fakePoolId = 'fakePoolId';

const correctJwtDecoded: object = {
  "sub": "username",
  "aud": "5hinvqat4h8n3d5j6ud0a6d7cl",
  "email_verified": true,
  "event_id": "xxxxxxxxx",
  "token_use": "id",
  "auth_time": 1614362797,
  "iss": `https://cognito-idp.${fakeRegion}.amazonaws.com/${fakePoolId}`,
  "cognito:username": "username",
  "iat": 1614362797,
  "email": "foo.bar@fake.io"
}

const expiredTokenDecoded: object = {
  "sub": "username",
  "aud": "5hinvqat4h8n3d5j6ud0a6d7cl",
  "email_verified": true,
  "event_id": "xxxxxxxxx",
  "token_use": "id",
  "auth_time": 1614362797,
  "exp": 1614362797, 
  "iss": `https://cognito-idp.${fakeRegion}.amazonaws.com/${fakePoolId}`,
  "cognito:username": "username",
  "iat": 1614362797,
  "email": "foo.bar@fake.io"
}

const mock = new MockAdapter(axios);

// Look https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html here for more details
mock.onGet(`https://cognito-idp.${fakeRegion}.amazonaws.com/${fakePoolId}/.well-known/jwks.json`).reply(200,{
  "keys": [
    {
      "kid": "test",
      "kty": "RSA",
      "n": "3ZWrUY0Y6IKN1qI4BhxR2C7oHVFgGPYkd38uGq1jQNSqEvJFcN93CYm16_G78FAFKWqwsJb3Wx-nbxDn6LtP4AhULB1H0K0g7_jLklDAHvI8yhOKlvoyvsUFPWtNxlJyh5JJXvkNKV_4Oo12e69f8QCuQ6NpEPl-cSvXIqUYBCs",
      "e": "AQAB",
      "use": "sig",
    }
  ]
});

const correctToken = sign(correctJwtDecoded, fakeRsaPrivateKey, { algorithm: "RS256", header: { "kid": "test" } });
const expiredToken = sign(expiredTokenDecoded, fakeRsaPrivateKey, { algorithm: "RS256", header: { "kid": "test" } });

test('Verify token hydrating cache', () => {
  return verifyToken(fakeRegion, fakePoolId, correctToken).then(decodedPayload => {
    expect(decodedPayload).toMatchObject(correctJwtDecoded);
  })
});

test('Verify expired token hydrating cache', () => {
  return verifyToken(fakeRegion, fakePoolId, correctToken).then(decodedPayload => {
    expect(decodedPayload).toMatchObject(correctJwtDecoded);
  })
});
