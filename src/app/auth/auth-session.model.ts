export class AuthSession {
  constructor(
    public email: string,
    public id: string,
    private _token: string,
    public refreshToken: string,
    public expirationTimestamp: number,
  ) {}

  // Immutable annotation to retrieve a private property
  get token(): string {
    if (!this.expirationTimestamp || new Date().getTime() > this.expirationTimestamp) {
      return null;
    }

    return this._token;
  }
}