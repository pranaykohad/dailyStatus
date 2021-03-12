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
  email: string;
}
export class User implements IUser {
  userId: number;
  userName: string;
  password: string;
  moduleName: string;
  firstName: string;
  lastName: string;
  role: string;
  type: string;
  defCount: number;
  email: string;
}
