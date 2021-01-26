import { User } from './user';

export interface Status {
  statusId: number;
  ticketId: string;
  description: string;
  state: string;
  dDate: string;
  user: User;
  delete: boolean;
}
export class Status {
  constructor(
    public ticketId: string,
    public description: string,
    public state: string,
    public dDate: string,
    public user: User
  ) {}
}
