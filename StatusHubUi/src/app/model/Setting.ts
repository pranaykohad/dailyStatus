export interface ISetting {
  settingId: number;
  key: string;
  value: string;
}
export class Setting implements ISetting {
  settingId: number;
  key: string;
  value: string;
}
