export interface ILeave {
  leaveId: number;
  title: string;
  start: string;
  updatedStart: string;
}
export class Leave implements ILeave {
  leaveId: number;
  title: string;
  start: string;
  updatedStart: string;
}

export interface IHoliday {
  title: string;
  start: string;
}
export class Holiday implements IHoliday {
  title: string;
  start: string;
}