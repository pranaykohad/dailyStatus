import { Injectable } from '@angular/core';
import { CalendarOptions, EventApi } from '@fullcalendar/angular';
import {
  FULLDAY_LIST,
  FULL_DAY_LEAVE_INDEX,
  HALFDAY_LIST,
  HALF_DAY_LEAVE_INDEX,
} from 'src/app/app.constant';
import { ILeave } from 'src/app/model/leave';
import { DateUtilService } from './date-util.service';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root',
})
export class FullCalendarUtil {
  constructor(
    private utilService: UtilService,
    private dateUtilService: DateUtilService
  ) {}

  mergeLeaves(
    calendarOptions: CalendarOptions,
    oldLeaves: ILeave[],
    newLeaves: ILeave[],
    index: number
  ) {
    oldLeaves = oldLeaves.concat(newLeaves);
    calendarOptions.eventSources[index][
      'events'
    ] = this.utilService.removeDupliFrmList(oldLeaves);
  }

  checkItemLeaves(leaveList: ILeave[], leave: ILeave): boolean {
    return leaveList.some((item2) => {
      return leave.leaveId === item2.leaveId;
    });
  }

  isValidUser(draggedEvent: any, loggedUserName: string): boolean {
    const draggedUserName = draggedEvent._def.title.split(':')[0];
    return draggedUserName.toUpperCase() === loggedUserName.toUpperCase();
  }

  isInNewLeaves(newMDYSlashDate: string, addedItems: ILeave[]): boolean {
    if (!addedItems.length) {
      return false;
    }
    return addedItems.some((item) => {
      const date = new Date(item.start);
      const exitsingMDYSlashDate = this.dateUtilService.formatSlashDate(
        `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
      );
      return (
        JSON.stringify(newMDYSlashDate) === JSON.stringify(exitsingMDYSlashDate)
      );
    });
  }

  isInExistingLeaves(
    newYMDHyphenDate: string,
    calendarOptions: CalendarOptions,
    loggedUserName: string
  ): boolean {
    return (
      this.isInExistingList(
        newYMDHyphenDate,
        calendarOptions,
        FULLDAY_LIST,
        loggedUserName
      ) ||
      this.isInExistingList(
        newYMDHyphenDate,
        calendarOptions,
        HALFDAY_LIST,
        loggedUserName
      )
    );
  }

  isInRemovedLeaves(leaveDate: string, removedItems): boolean {
    return removedItems.some((item) => {
      const date = new Date(item.start);
      const formattedDate = this.dateUtilService.formatSlashToHyphenDate(
        `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
      );
      return JSON.stringify(formattedDate) === JSON.stringify(leaveDate);
    });
  }

  isInHolidays(
    formattedDate: string,
    leaveType: number,
    calendarOptions: CalendarOptions
  ): boolean {
    let isExists = false;
    calendarOptions.eventSources[leaveType]['events'].forEach((item) => {
      if (JSON.stringify(formattedDate) === JSON.stringify(item.start)) {
        isExists = true;
      }
    });
    // if (isExists) {
    //   const alert: Alert = {
    //     message: 'You cannot add leave on holiday',
    //     type: 'FAILURE',
    //   };
    //   this.alertEmitter.emit(alert);
    // }
    return isExists;
  }

  checkItemInEventSource(
    removedItems: ILeave[],
    calendarOptions: CalendarOptions
  ) {
    let oldFullDayLeaves: ILeave[] =
      calendarOptions.eventSources[FULL_DAY_LEAVE_INDEX]['events'];

    let oldHalfDayLeaves: ILeave[] =
      calendarOptions.eventSources[HALF_DAY_LEAVE_INDEX]['events'];

    removedItems.forEach((item) => {
      if (this.checkItemLeaves(oldFullDayLeaves, item)) {
        calendarOptions.eventSources[FULL_DAY_LEAVE_INDEX][
          'events'
        ] = oldFullDayLeaves.filter((i) => {
          return i.leaveId !== item.leaveId;
        });
      } else {
        if (this.checkItemLeaves(oldHalfDayLeaves, item)) {
          calendarOptions.eventSources[HALF_DAY_LEAVE_INDEX][
            'events'
          ] = oldHalfDayLeaves.filter((i) => {
            return i.leaveId !== item.leaveId;
          });
        }
      }
    });
  }

  eventAllow(draggedEvent: EventApi, loggedUserName: string): boolean {
    return (
      this.isValidUser(draggedEvent, loggedUserName) &&
      !draggedEvent._def.extendedProps.leaveId
    );
  }

  private isInExistingList(
    newYMDHyphenDate: string,
    calendarOptions: CalendarOptions,
    leaveType: number,
    loggedUserName: string
  ): boolean {
    return calendarOptions.eventSources[leaveType]['events'].some((item) => {
      return (
        JSON.stringify(newYMDHyphenDate) === JSON.stringify(item.start) &&
        loggedUserName.toUpperCase() === item.title.split(':')[0].toUpperCase()
      );
    });
  }
}
