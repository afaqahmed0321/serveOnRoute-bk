export default interface JwtTokensInterface {
  readonly access_token: string;
  readonly refresh_token: string;
  readonly roles: any;
}
