import { User } from '../shared/user.model';
import { Organisation } from '../shared/organisation.model';

export class Account {
  constructor(
    public user: User,
    public organisation: Organisation
  )  {}

  get userId(): string {
    return this.user.uid;
  }

  get organisationId(): string {
    return this.organisation.uid;
  }
}