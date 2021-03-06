export interface ICalEvent {
  eventId: number;
  title: string;
  start: string;
  end: string;
}
export class CalEvent implements ICalEvent {
  eventId: number;
  title: string;
  start: string;
  end: string;
}
