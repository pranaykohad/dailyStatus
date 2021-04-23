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
  FULL_DAY_LABEL,
  FULL_DAY_LEAVE_INDEX,
  HALF_DAY_COLOR,
  HALF_DAY_LABEL,
  HALF_DAY_LEAVE_INDEX,
  HOLIDAY_COLOR,
  HOLIDAY_LIST,
} from 'src/app/app.constant';
import { IHoliday } from 'src/app/model/leave';
import { User } from 'src/app/model/user';
import { DateUtilService } from 'src/services/date-util.service';
import { FullCalendarUtil } from 'src/services/full-calendar-util.service';
import { LeaveService } from 'src/services/leave.service';
import { LocalStorageService } from 'src/services/local-storage.service';
import { UtilService } from 'src/services/util.service';
import * as calConfig from '../../assets/full-calendar-config.json';
import { Alert } from '../model/alert';
import { environment } from './../../environments/environment';
import { ILeave } from './../model/leave';

@Component({
  selector: 'app-full-calendar',
  templateUrl: './full-calendar.component.html',
  styleUrls: ['./full-calendar.component.scss'],
})
export class FullCalendarComponent implements OnInit {
  calendarOptions: CalendarOptions;
  selectedItem: EventApi;
  loggedUserName: string;
  @Input() holidays: IHoliday[];
  @Output() selectedItemEmitter = new EventEmitter<EventApi>();
  @Output() alertEmitter = new EventEmitter<Alert>();
  @Output() resetEmitter = new EventEmitter();
  @ViewChild('fullCalendar') fullCalendar: FullCalendar;
  private fullDayLeaves: ILeave[];
  private halfDayLeaves: ILeave[];

  constructor(
    private localStoreService: LocalStorageService,
    private utilService: UtilService,
    private dateUtilService: DateUtilService,
    private fullCalendarUtil: FullCalendarUtil,
    private leaveService: LeaveService
  ) {
    const user: User = this.localStoreService.getUser();
    this.loggedUserName = user.firstName.trim() + ' ' + user.lastName.trim();
    this.setCurrentMonth();
  }

  ngOnInit(): void {
    const currentMonth: string = this.localStoreService.getCurrentMonth();
    if (!currentMonth) {
      return;
    }
    this.initHalfDayLeaves(currentMonth);
    this.initFullDayLeaves(currentMonth);
    this.initCalendarOptions();
    this.registerExternalDragEvent();
    setTimeout(() => {
      this.registerButtonEvents();
      this.fullCalendar.calendar.gotoDate(currentMonth);
    });
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
        this.getFullDayLeaves(),
        this.getHalfDayLeaves(),
        this.getHolidays(),
      ],
      eventAllow: (dropInfo, draggedEvent) => {
        return this.fullCalendarUtil.eventAllow(
          draggedEvent,
          this.loggedUserName
        );
      },
      eventDrop: (info) => {
        // this.internalDrop(info);
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

  addLeave(leave: ILeave) {
    leave.start = this.dateUtilService.formatCalDateToDate(
      new Date(leave.start)
    );
    this.leaveService.addLeaves(leave).subscribe((res) => {
      this.alertEmitter.emit({
        message: res['description'],
        type: res['status'],
      });
      this.resetEmitter.emit();
    });
  }

  private externalDrop(info: any) {
    const leave: ILeave = {
      leaveId: null,
      title: info.draggedEl.id,
      start: info.date.toString(),
      type: this.dateUtilService.getLeaveType(info.date.toString()),
    };
    const date = new Date(leave.start);
    const dataStr = `${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()}`;
    const ymdHyphenDate = this.dateUtilService.formatSlashToHyphenDate(dataStr);
    if (
      this.fullCalendarUtil.isInExistingLeaves(
        ymdHyphenDate,
        this.calendarOptions,
        this.loggedUserName
      ) ||
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
      this.addLeave(leave);
    }
  }

  private eventClick(info) {
    this.selectedItem = null;
    if (this.fullCalendarUtil.isValidUser(info.event, this.loggedUserName)) {
      this.selectedItem = info.event;
    }
    this.selectedItemEmitter.emit(this.selectedItem);
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
    const currentDate: Date = new Date(this.fullCalendar.calendar.getDate());
    const currentMonth: string = this.dateUtilService.extractYearAndMonth(
      currentDate
    );
    this.localStoreService.setCurrentMonth(currentMonth);
    this.initHalfDayLeaves(currentMonth);
    this.initFullDayLeaves(currentMonth);
  }

  private setCurrentMonth() {
    const oldMonth: string = this.localStoreService.getCurrentMonth();
    if (oldMonth) {
      return;
    }
    const date: Date = new Date();
    const currentMonth: string = this.dateUtilService.formatHyphenDateToYM(
      date.getFullYear() + '-' + (date.getMonth() + 1)
    );
    this.localStoreService.setCurrentMonth(currentMonth);
  }

  private initHalfDayLeaves(currrentMonth: string) {
    this.halfDayLeaves = [];
    this.leaveService
      .getLeaves(HALF_DAY_LABEL, currrentMonth)
      .subscribe((res) => {
        if (res['status'] === 'SUCCESS') {
          this.halfDayLeaves = res['data'];
          this.updateHalfDayLeaves();
        }
      });
  }

  private updateHalfDayLeaves() {
    let oldHalfDayLeaves: ILeave[] = this.calendarOptions.eventSources[
      HALF_DAY_LEAVE_INDEX
    ]['events'];
    const oldHalfDayLeavesLen = oldHalfDayLeaves.length;

    //update object
    this.fullCalendarUtil.mergeLeaves(
      this.calendarOptions,
      oldHalfDayLeaves,
      this.halfDayLeaves,
      HALF_DAY_LEAVE_INDEX
    );

    const newHalfDayLeavesLen = this.calendarOptions.eventSources[
      HALF_DAY_LEAVE_INDEX
    ]['events'].length;

    if (oldHalfDayLeavesLen !== newHalfDayLeavesLen) {
      //update UI
      this.fullCalendar.calendar.addEventSource({
        events: this.halfDayLeaves,
        color: HALF_DAY_COLOR,
      });
    }
  }

  private initFullDayLeaves(currrentMonth: string): void {
    this.fullDayLeaves = [];
    this.leaveService
      .getLeaves(FULL_DAY_LABEL, currrentMonth)
      .subscribe((res) => {
        if (res['status'] === 'SUCCESS') {
          this.fullDayLeaves = res['data'];
          this.updateFullDayLeaves();
        }
      });
  }

  private updateFullDayLeaves() {
    let oldFullDayLeaves: ILeave[] = this.calendarOptions.eventSources[
      FULL_DAY_LEAVE_INDEX
    ]['events'];

    const oldFullDayLeavesLen = oldFullDayLeaves.length;
    //update object
    this.fullCalendarUtil.mergeLeaves(
      this.calendarOptions,
      oldFullDayLeaves,
      this.fullDayLeaves,
      FULL_DAY_LEAVE_INDEX
    );

    const newFullDayLeavesLen = this.calendarOptions.eventSources[
      FULL_DAY_LEAVE_INDEX
    ]['events'].length;

    if (oldFullDayLeavesLen !== newFullDayLeavesLen) {
      //update UI
      this.fullCalendar.calendar.addEventSource({
        events: this.fullDayLeaves,
        color: FULL_DAY_COLOR,
      });
    }
  }

  private getFullDayLeaves() {
    return {
      events: this.fullDayLeaves,
      color: FULL_DAY_COLOR,
    };
  }

  private getHalfDayLeaves() {
    return {
      events: this.halfDayLeaves,
      color: HALF_DAY_COLOR,
    };
  }

  private getHolidays() {
    return {
      events: this.holidays,
      color: HOLIDAY_COLOR,
    };
  }
}
