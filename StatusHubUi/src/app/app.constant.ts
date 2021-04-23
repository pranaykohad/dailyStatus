import { environment } from '../environments/environment';

export const BASE_URL = environment.BASE_URL;
export const MODULE_LIST = [
  'OCR',
  'Connector',
  'Workbench 9.2',
  'Portal',
  'Automation',
];
export const STATE_LIST = ['In progress', 'Completed'];
export const ROLE_LIST = ['NORMAL', 'ADMIN'];
export const USER_TYPE_LIST = ['DEV', 'QA', 'AQA', 'PQA'];
export const POSITION_LIST = [
  'PgM',
  'Project Lead',
  'Sr. Architech',
  'Sr. Tech Lead',
  'Lead Developer',
  'Developer',
  'Sr. Developer',
  'Perf. Eng.',
  'Lead QA',
  'QA',
  'Sr. AQA',
  'AQA',
];
export const LEAVE_TYPE_LIST = ['All', 'Planned', 'Un-Planned'];
export const numOfStatus = 6;
export const SUNDAY = 0;
export const MONDAY = 1;
export const TUESDAY = 2;
export const WEDNESDAY = 3;
export const THRUSDAY = 4;
export const FRIDAY = 5;
export const SATURDAY = 6;
export const TOP_DEF_COUNT = 4;
export const FULLDAY_LIST = 0;
export const HALFDAY_LIST = 1;
export const HOLIDAY_LIST = 2;
export const DEFAULT_USER_TYPE = 'All';
export const PREV = 'PREV';
export const NEXT = 'NEXT';
export const FULL_DAY_COLOR = '#28a745';
export const HALF_DAY_COLOR = '#abc42d';
export const HOLIDAY_COLOR = '#f48b29';
export const DARK_GREY = '#545b62';
export const FULL_DAY_LEAVE_INDEX = 0;
export const HALF_DAY_LEAVE_INDEX = 1;
export const FULL_DAY_LABEL = 'full-day';
export const HALF_DAY_LABEL = 'half-day';
export const NOT_APPLICABLE = 'Not Applicable';
export const START_TIME = 8;
export const END_TIME = 23;
