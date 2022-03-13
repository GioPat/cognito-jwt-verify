import { fetchPems, verifyToken } from './functions';
import KeyValueDict from './interfaces/key-value-dict';

export default class CognitoJwtVerifier {
  private pems: KeyValueDict | undefined;
  private awsRegion: string;
  private userPoolId: string;
  private appClientId: string;
  private isDev: boolean;

  constructor(awsRegion: string, userPoolId: string, appClientId: string, isDev: boolean) {
    this.awsRegion = awsRegion;
    this.userPoolId = userPoolId;
    this.appClientId = appClientId;
    this.isDev = isDev;
  }

  public async verify(token: string): Promise<object> {
    if (this.pems === undefined) {
      this.pems = await fetchPems(this.awsRegion, this.userPoolId);
    }
    return verifyToken(this.awsRegion, this.userPoolId, token, this.appClientId, this.pems, this.isDev);
  }
}
