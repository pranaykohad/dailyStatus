export interface User {
  userId: string;
  userName: string;
  password: string;
  moduleName: string;
  firstName: string;
  lastName: string;
  role: string;
  type: string;
}
export class User {
  constructor(
    public userId: string,
    public userName: string,
    public password: string,
    public moduleName: string,
    public firstName: string,
    public lastName: string,
    public role: string,
    public type: string
  ) {}
}
