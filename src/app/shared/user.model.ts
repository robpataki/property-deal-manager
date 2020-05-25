export class User {
  constructor(
    public uid: string,
    public private_profile: {
      firstName: string,
      lastName: string,
      email: string
    }, public public_profile: {
      displayName: string,
      photoUrl?: string
    }
  ) {}
}