import RequestUserInterface from '@interfaces/request-user.interface';

export default interface DecodedUser extends RequestUserInterface {
  readonly iat: number;
  readonly exp: number;
}
