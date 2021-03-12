import { User } from './user';

export interface IStatus {
  ticketId: string;
  description: string;
  state: string;
  dDate: string;
  user: User;
  delete: boolean;
}
export class Status implements IStatus {
  ticketId: string;
  description: string;
  state: string;
  dDate: string;
  user: User;
  delete: boolean;
}
