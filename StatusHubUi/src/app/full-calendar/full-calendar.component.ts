import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CalendarOptions, DateSpanApi, EventApi } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import { FullCalendar } from 'primeng/fullcalendar';
import {
  DARK_GREY,
  FULLDAY_LIST,
  FULL_DAY_COLOR,
  FULL_DAY_LEAVE_INDEX,
  HALFDAY_LIST,
  HALF_DAY_COLOR,
  HALF_DAY_LEAVE_INDEX,
  HOLIDAY_COLOR,
  HOLIDAY_LIST,
} from 'src/app/app.constant';
import { IHoliday, ILeave } from 'src/app/model/leave';
import { User } from 'src/app/model/user';
import { LocalStorageService } from 'src/services/local-storage.service';
import { UtilService } from 'src/services/util.service';
import { Alert } from '../model/alert';
import * as calConfig from '../../assets/full-calendar-config.json';
import { DateUtilService } from 'src/services/date-util.service';

@Component({
  selector: 'app-full-calendar',
  templateUrl: './full-calendar.component.html',
  styleUrls: ['./full-calendar.component.scss'],
})
export class FullCalendarComponent implements OnInit {
  calendarOptions: CalendarOptions;
  selectedItem: EventApi;
  loggedUserName: string;
  @Input() addedItems: ILeave[];
  @Input() removedItems: ILeave[];
  // @Input() updatedItems: ILeave[];
  @Input() holidays: IHoliday[];
  @Output() addedItemsEmitter = new EventEmitter<ILeave[]>();
  // @Output() updatedItemsEmitter = new EventEmitter<ILeave[]>();
  @Output() selectedItemEmitter = new EventEmitter<EventApi>();
  @Output() alertEmitter = new EventEmitter<Alert>();
  @Output() monthEmitter = new EventEmitter<string>();
  @ViewChild('fullCalendar') fullCalendar: FullCalendar;
  private _fullDayLeaves: ILeave[];
  private _halfDayLeaves: ILeave[];

  constructor(
    private localStoreService: LocalStorageService,
    private utilService: UtilService,
    private dateUtilService: DateUtilService
  ) {
    const user: User = this.localStoreService.getUser();
    this.loggedUserName = `${user.firstName} ${user.lastName}`;
  }

  ngOnInit(): void {
    this.initCalendarOptions();
    this.registerExternalDragEvent();
    setTimeout(() => {
      this.registerButtonEvents();
    });
  }

  @Input()
  set fullDayLeaves(fullDayLeaves: ILeave[]) {
    this._fullDayLeaves = fullDayLeaves;
    if (!this.calendarOptions) {
      return;
    }
    let oldFullDayLeaves: ILeave[] = this.calendarOptions.eventSources[
      FULL_DAY_LEAVE_INDEX
    ]['events'];

    const oldFullDayLeavesLen = oldFullDayLeaves.length;
    this.mergeLeaves(oldFullDayLeaves, fullDayLeaves, FULL_DAY_LEAVE_INDEX);

    const newFullDayLeavesLen = this.calendarOptions.eventSources[
      FULL_DAY_LEAVE_INDEX
    ]['events'].length;

    if (oldFullDayLeavesLen !== newFullDayLeavesLen) {
      //update UI
      this.fullCalendar.calendar.addEventSource({
        events: fullDayLeaves,
        color: FULL_DAY_COLOR,
      });
    }
  }

  get fullDayLeaves(): ILeave[] {
    return this._fullDayLeaves;
  }

  @Input()
  set halfDayLeaves(halfDayLeaves: ILeave[]) {
    this._halfDayLeaves = halfDayLeaves;
    if (!this.calendarOptions) {
      return;
    }

    let oldHalfDayLeaves: ILeave[] = this.calendarOptions.eventSources[
      HALF_DAY_LEAVE_INDEX
    ]['events'];
    const oldHalfDayLeavesLen = oldHalfDayLeaves.length;

    this.mergeLeaves(oldHalfDayLeaves, halfDayLeaves, HALF_DAY_LEAVE_INDEX);

    const newHalfDayLeavesLen = this.calendarOptions.eventSources[
      HALF_DAY_LEAVE_INDEX
    ]['events'].length;

    if (oldHalfDayLeavesLen !== newHalfDayLeavesLen) {
      //update UI
      this.fullCalendar.calendar.addEventSource({
        events: halfDayLeaves,
        color: HALF_DAY_COLOR,
      });
    }
  }

  get halfDayLeaves(): ILeave[] {
    return this._halfDayLeaves;
  }

  initCalendarOptions(): void {
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      themeSystem: calConfig.themeSystem,
      headerToolbar: {
        left: calConfig.headerToolbar.left,
        center: calConfig.headerToolbar.center,
        right: calConfig.headerToolbar.right,
      },
      buttonText: {
        prev: calConfig.buttonText.prev,
        today: calConfig.buttonText.today,
        next: calConfig.buttonText.next,
        month: calConfig.buttonText.month,
      },
      initialView: calConfig.initialView,
      weekends: calConfig.weekends,
      editable: calConfig.editable,
      dayMaxEvents: calConfig.dayMaxEvents,
      droppable: calConfig.droppable,
      selectable: calConfig.selectable,
      eventSources: [
        this.initFullDayLeaves(),
        this.initHalfDayLeaves(),
        this.initHolidays(),
      ],
      eventAllow: (dropInfo, draggedEvent) => {
        return this.eventAllow(dropInfo, draggedEvent);
      },
      eventDrop: (info) => {
        this.internalDrop(info);
      },
      drop: (info) => {
        this.externalDrop(info);
      },
      eventClick: (info) => {
        this.eventClick(info);
      },
      dateClick: () => {
        this.selectedItem = null;
        this.selectedItemEmitter.emit(this.selectedItem);
      },
    };
  }

  private externalDrop(info: any) {
    const leave: ILeave = {
      leaveId: null,
      title: info.draggedEl.id,
      start: info.date.toString(),
      updatedStart: null,
    };

    const date = new Date(leave.start);
    const formattedDate1 = this.dateUtilService.formatSlashDate(
      `${date.getMonth() - 1}/${date.getDate()}/${date.getFullYear()}`
    );
    const formattedDate2 = this.dateUtilService.formatSlashToHyphenDate(
      `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
    );

    if (
      this.isInNewLeaves(formattedDate1) ||
      (this.isInExistingLeaves(formattedDate2) &&
        !this.isInRemovedLeaves(formattedDate2)) ||
      this.isInHolidays(formattedDate2, HOLIDAY_LIST)
    ) {
      // this.removeAddedLeave(new Date(info.start));
      info.remove();
    } else {
      this.addedItems.push(leave);
      this.addedItemsEmitter.emit(this.addedItems);
    }
  }

  private isInHolidays(formattedDate: string, leaveType: number): boolean {
    let isExists = false;
    this.calendarOptions.eventSources[leaveType]['events'].forEach((item) => {
      if (JSON.stringify(formattedDate) === JSON.stringify(item.start)) {
        isExists = true;
      }
    });
    if (isExists) {
      const alert: Alert = {
        message: 'You cannot add leave on holiday',
        type: 'FAILURE',
      };
      this.alertEmitter.emit(alert);
    }
    return isExists;
  }

  private isInExistingLeaves(formattedDate: string): boolean {
    const isExists: boolean =
      this.isInExistingList(formattedDate, FULLDAY_LIST) ||
      this.isInExistingList(formattedDate, HALFDAY_LIST);
    if (isExists) {
      const alert: Alert = {
        message: 'Leave Already Added',
        type: 'FAILURE',
      };
      this.alertEmitter.emit(alert);
    }
    return isExists;
  }

  private isInExistingList(formattedDate: string, leaveType: number) {
    let isExists = false;
    this.calendarOptions.eventSources[leaveType]['events'].forEach((item) => {
      if (
        JSON.stringify(formattedDate) === JSON.stringify(item.start) &&
        this.loggedUserName.toUpperCase() ===
          item.title.split(':')[0].toUpperCase()
      ) {
        isExists = true;
      }
    });
    return isExists;
  }

  private isInNewLeaves(formattedDate: string): boolean {
    return this.addedItems.some((item) => {
      const date1 = new Date(item.start);
      const date2 = this.dateUtilService.formatSlashDate(
        `${date1.getMonth() - 1}/${date1.getDate()}/${date1.getFullYear()}`
      );
      const isExists: boolean =
        JSON.stringify(formattedDate) === JSON.stringify(date2);
      if (isExists) {
        const alert: Alert = {
          message: 'Leave Already Added',
          type: 'FAILURE',
        };
        this.alertEmitter.emit(alert);
      }
      return isExists;
    });
  }

  private isInRemovedLeaves(leaveDate: string): boolean {
    return this.removedItems.some((item) => {
      const date = new Date(item.start);
      const formattedDate = this.dateUtilService.formatSlashToHyphenDate(
        `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
      );
      return JSON.stringify(formattedDate) === JSON.stringify(leaveDate);
    });
  }

  private isValidUser(draggedEvent: any): boolean {
    const draggedUserName = draggedEvent._def.title.split(':')[0];
    return draggedUserName.toUpperCase() === this.loggedUserName.toUpperCase();
  }

  removeAddedLeave(date) {
    const date1 = new Date(date);
    const date2 = this.dateUtilService.formatSlashDate(
      `${date1.getMonth() - 1}/${date1.getDate()}/${date1.getFullYear()}`
    );
    this.addedItems = this.addedItems.filter((item) => {
      const d1 = new Date(item.start);
      const d2 = this.dateUtilService.formatSlashDate(
        `${d1.getMonth() - 1}/${d1.getDate()}/${d1.getFullYear()}`
      );
      if (JSON.stringify(date2) !== JSON.stringify(d2)) {
        return true;
      }
    });
    this.addedItemsEmitter.emit(this.addedItems);
  }

  // private internalDrop(info: any) {
  //   const leave: ILeave = {
  //     leaveId: info.oldEvent._def.extendedProps.leaveId,
  //     title: info.oldEvent._def.title,
  //     start: info.oldEvent._instance.range.start,
  //     updatedStart: info.event._instance.range.start,
  //   };
  //   const existingIndex = this.updatedItems.findIndex(
  //     (item) => item.leaveId === leave.leaveId
  //   );
  //   if (existingIndex !== -1) {
  //     this.updatedItems[existingIndex].updatedStart = leave.updatedStart;
  //   } else {
  //     this.updatedItems.push(leave);
  //   }
  // }

  private eventClick(info) {
    this.selectedItem = null;
    if (this.isValidUser(info.event)) {
      this.selectedItem = info.event;
    }
    this.selectedItemEmitter.emit(this.selectedItem);
  }

  private eventAllow(dropInfo: DateSpanApi, draggedEvent: EventApi): boolean {
    return (
      this.isValidUser(draggedEvent) && !draggedEvent._def.extendedProps.leaveId
    );
  }

  private internalDrop(info: any) {
    if (!info.oldEvent._def.extendedProps.leaveId) {
      info.event.remove();
      this.removeAddedLeave(info.oldEvent._instance.range.start);
    }
    // this.internalDrop(info);
  }

  private registerExternalDragEvent() {
    // this.cdrf.detectChanges();
    var containerEl = document.getElementById('external');
    new Draggable(containerEl, {
      itemSelector: '.draggable',
      eventData: (event) => {
        return {
          title: event.id,
        };
      },
    });
  }

  private registerButtonEvents(): void {
    const prevBtn: HTMLButtonElement = document.querySelector(
      'button.fc-prev-button.fc-button.fc-button-primary'
    );
    if (prevBtn) {
      this.utilService.changeElementBGColor(prevBtn, DARK_GREY);
      prevBtn.addEventListener('click', () => {
        this.emitClickedMonth();
      });
    }
    const nextBtn: HTMLButtonElement = document.querySelector(
      'button.fc-next-button.fc-button.fc-button-primary'
    );
    if (nextBtn) {
      this.utilService.changeElementBGColor(nextBtn, DARK_GREY);
      nextBtn.addEventListener('click', () => {
        this.emitClickedMonth();
      });
    }
  }

  private emitClickedMonth() {
    const currentDate = new Date(this.fullCalendar.calendar.getDate());
    const finalDate = this.dateUtilService.extractYearAndMonth(currentDate);
    this.monthEmitter.emit(finalDate);
  }

  private mergeLeaves(oldLeaves: ILeave[], newLeaves: ILeave[], index: number) {
    oldLeaves = oldLeaves.concat(newLeaves);
    this.calendarOptions.eventSources[index][
      'events'
    ] = this.utilService.removeDupliFrmList(oldLeaves);
  }

  private initFullDayLeaves() {
    return {
      events: this.fullDayLeaves,
      color: FULL_DAY_COLOR,
    };
  }

  private initHalfDayLeaves() {
    return {
      events: this.halfDayLeaves,
      color: HALF_DAY_COLOR,
    };
  }

  private initHolidays() {
    return {
      events: this.holidays,
      color: HOLIDAY_COLOR,
    };
  }
}
