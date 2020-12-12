export interface User {
  //userId: number;
  userName: string;
  password: string;
  moduleName: string;
}
export class User {
  constructor(
    //public userId: number,
    public userName: string,
    public password: string,
    public moduleName: string
  ) {}
}
