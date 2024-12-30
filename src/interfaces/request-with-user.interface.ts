import { User } from '@users/schemas/users.schema';

export default interface RequestWithUserInterface extends Request {
  readonly user: User;
}
