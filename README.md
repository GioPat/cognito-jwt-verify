# Cognito JWT Verify utility

Minimal AWS Cognito JWT token verify utilities built in Typescript.

[![node version][node-image]][node-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coverage-image]][coverage-url]


[node-image]:     https://img.shields.io/badge/node.js-%3E=_12.0.0-green.svg?style=flat-square
[node-url]:       http://nodejs.org/download/
[travis-image]:   https://travis-ci.org/GioPat/cognito-jwt-verify.svg?branch=master
[travis-url]:     https://travis-ci.org/github/GioPat/cognito-jwt-verify
[coverage-image]: https://coveralls.io/repos/github/GioPat/cognito-jwt-verify/badge.svg?branch=master
[coverage-url]:   https://coveralls.io/github/GioPat/cognito-jwt-verify?branch=master

## Description
This package is intended to validate the JWTs tokens (id token and access token) released by cognito upon authenticating the user.
The validation follows the official [AWS documentation](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html)

## Installation
**Make sure you have Node >= 12.0.0 installed**

`npm install cognito-jwt-verify`

## Usage
The library is very simple and minimal to use: 

```ts
import { verifyCognitoToken } from './../lib/index';

// Pass the token that the Cognito API has given to you (either id or access one)
verifyCognitoToken('eu-south-1', 'cognitoUserPoolId', token).then(decodedToken => {
  // Here you have your decoded token
}).catch(error => {
  // Error while verifying the token
})
```
Or using the async-await construct

```ts
import { verifyCognitoToken } from './../lib/index';

var token = await verifyCognitoToken('eu-south-1', 'cognitoUserPoolId', token);
```

## Features

- Validate token as per AWS documentation.
- Cache JWK for subsequent token validations.
- Handle errors.

## Contributing

Keep the unit test coverage to 100!

Run:

```sh
npm run format
npm run lint
npm run test
```

Feel free to submit issues and enhancement requests 🚀🚀!.

## License
MIT license, for more information pelase read LICENSE file
