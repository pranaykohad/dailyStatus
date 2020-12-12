export interface User {
  userId: string;
  userName: string;
  password: string;
  moduleName: string;
}
export class User {
  constructor(
    public userId: string,
    public userName: string,
    public password: string,
    public moduleName: string
  ) {}
}
