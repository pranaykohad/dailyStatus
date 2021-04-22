export interface ILeave {
  leaveId: number;
  title: string;
  start: string;
  type: string;
}
export class Leave implements ILeave {
  leaveId: number;
  title: string;
  start: string;
  type: string;
}

export interface IHoliday {
  holidayId: number;
  title: string;
  start: string;
}
export class Holiday implements IHoliday {
  holidayId: number;
  title: string;
  start: string;
}
