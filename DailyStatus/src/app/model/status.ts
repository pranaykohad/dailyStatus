import { User } from './user';

export interface Status {
  // statusId: number;
  ticketId: string;
  description: string;
  state: string;
  date: string;
  user: User;
}
export class Status {
  constructor(
    // public statusId: number,
    public ticketId: string,
    public description: string,
    public state: string,
    public date: string,
    public user: User
  ) {}
}
