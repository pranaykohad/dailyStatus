export interface IUser {
  userId: number;
  userName: string;
  password: string;
  moduleName: string;
  firstName: string;
  lastName: string;
  role: string;
  type: string;
  defCount: number;
  position: string;
  billable: boolean;
  email: string;
  baseHour: number;
}
export class User implements IUser {
  public userId: number;
  public userName: string;
  public password: string;
  public moduleName: string;
  public firstName: string;
  public lastName: string;
  public role: string;
  public type: string;
  public defCount: number;
  public position: string;
  public billable: boolean;
  public email: string;
  public baseHour: number;
}
