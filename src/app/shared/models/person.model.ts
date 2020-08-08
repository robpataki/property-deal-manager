export class Person {
  constructor(
    public firstName: string,
    public lastName: string,
    public phone: string,
    public email: string,

    public deleted?: boolean
  ) {}
}
