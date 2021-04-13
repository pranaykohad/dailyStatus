import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CalendarOptions, EventApi } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import { FullCalendar } from 'primeng/fullcalendar';
import {
  DARK_GREY,
  FULL_DAY_COLOR,
  FULL_DAY_LEAVE_INDEX,
  HALF_DAY_COLOR,
  HALF_DAY_LEAVE_INDEX,
  HOLIDAY_COLOR,
  HOLIDAY_LIST,
} from 'src/app/app.constant';
import { IHoliday, ILeave } from 'src/app/model/leave';
import { User } from 'src/app/model/user';
import { DateUtilService } from 'src/services/date-util.service';
import { FullCalendarUtil } from 'src/services/full-calendar-util.service';
import { LocalStorageService } from 'src/services/local-storage.service';
import { UtilService } from 'src/services/util.service';
import * as calConfig from '../../assets/full-calendar-config.json';
import { Alert } from '../model/alert';
import { environment } from './../../environments/environment';

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
  @Input() holidays: IHoliday[];
  @Output() addedItemsEmitter = new EventEmitter<ILeave[]>();
  @Output() selectedItemEmitter = new EventEmitter<EventApi>();
  @Output() alertEmitter = new EventEmitter<Alert>();
  @Output() monthEmitter = new EventEmitter<string>();
  @ViewChild('fullCalendar') fullCalendar: FullCalendar;
  private _fullDayLeaves: ILeave[];
  private _halfDayLeaves: ILeave[];
  private _removedItems: ILeave[];

  constructor(
    private localStoreService: LocalStorageService,
    private utilService: UtilService,
    private dateUtilService: DateUtilService,
    private fullCalendarUtil: FullCalendarUtil
  ) {
    const user: User = this.localStoreService.getUser();
    this.loggedUserName = user.firstName.trim() + ' ' + user.lastName.trim();
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
    //update object
    this.fullCalendarUtil.mergeLeaves(
      this.calendarOptions,
      oldFullDayLeaves,
      fullDayLeaves,
      FULL_DAY_LEAVE_INDEX
    );

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

    //update object
    this.fullCalendarUtil.mergeLeaves(
      this.calendarOptions,
      oldHalfDayLeaves,
      halfDayLeaves,
      HALF_DAY_LEAVE_INDEX
    );

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

  @Input()
  set removedItems(removedItems: ILeave[]) {
    this._removedItems = removedItems;
    if (removedItems.length) {
      this.fullCalendarUtil.checkItemInEventSource(
        removedItems,
        this.calendarOptions
      );
    }
  }

  get removedItems() {
    return this._removedItems;
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
      weekends: !environment.production,
      editable: calConfig.editable,
      dayMaxEvents: calConfig.dayMaxEvents,
      droppable: calConfig.droppable,
      selectable: calConfig.selectable,
      showNonCurrentDates: calConfig.showNonCurrentDates,
      fixedWeekCount: calConfig.fixedWeekCount,
      eventSources: [
        this.initFullDayLeaves(),
        this.initHalfDayLeaves(),
        this.initHolidays(),
      ],
      eventAllow: (dropInfo, draggedEvent) => {
        return this.fullCalendarUtil.eventAllow(
          draggedEvent,
          this.loggedUserName
        );
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

  updateAddedItems(removeLeaveDate) {
    const date = new Date(removeLeaveDate);
    const newMDYSlashDate = this.dateUtilService.formatSlashDate(
      `${date.getMonth() - 1}/${date.getDate()}/${date.getFullYear()}`
    );
    this.addedItems = this.addedItems.filter((item) => {
      const d1 = new Date(item.start);
      const oldMDYSlashDate = this.dateUtilService.formatSlashDate(
        `${d1.getMonth() - 1}/${d1.getDate()}/${d1.getFullYear()}`
      );
      if (JSON.stringify(newMDYSlashDate) !== JSON.stringify(oldMDYSlashDate)) {
        return true;
      }
    });
    this.addedItemsEmitter.emit(this.addedItems);
  }

  private externalDrop(info: any) {
    const leave: ILeave = {
      leaveId: null,
      title: info.draggedEl.id,
      start: info.date.toString(),
      updatedStart: null,
    };
    const date = new Date(leave.start);
    const dataStr = `${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()}`;
    const mdySlashDate = this.dateUtilService.formatSlashDate(dataStr);
    const ymdHyphenDate = this.dateUtilService.formatSlashToHyphenDate(dataStr);
    if (
      this.fullCalendarUtil.isInNewLeaves(mdySlashDate, this.addedItems) ||
      (this.fullCalendarUtil.isInExistingLeaves(
        ymdHyphenDate,
        this.calendarOptions,
        this.loggedUserName
      ) &&
        !this.fullCalendarUtil.isInRemovedLeaves(
          ymdHyphenDate,
          this.removedItems
        )) ||
      this.fullCalendarUtil.isInHolidays(
        ymdHyphenDate,
        HOLIDAY_LIST,
        this.calendarOptions
      )
    ) {
      const alert: Alert = {
        message: "Leave already added or it's a holiday",
        type: 'FAILURE',
      };
      this.alertEmitter.emit(alert);
      // this.removeAddedLeave(new Date(info.start));
      info.remove();
    } else {
      this.addedItems.push(leave);
      this.addedItemsEmitter.emit(this.addedItems);
    }
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
    if (this.fullCalendarUtil.isValidUser(info.event, this.loggedUserName)) {
      this.selectedItem = info.event;
    }
    this.selectedItemEmitter.emit(this.selectedItem);
  }

  private internalDrop(info: any) {
    if (!info.oldEvent._def.extendedProps.leaveId) {
      info.event.remove();
      this.updateAddedItems(info.oldEvent._instance.range.start);
    }
    // this.internalDrop(info);
  }

  private registerExternalDragEvent() {
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
