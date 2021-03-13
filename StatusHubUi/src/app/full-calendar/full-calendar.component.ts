import {
  ChangeDetectorRef,
  Component,
  OnInit,
  Output,
  ViewChild,
  EventEmitter,
  Input,
} from '@angular/core';
import { CalendarOptions, DateSpanApi, EventApi } from '@fullcalendar/angular';
import { FullCalendar } from 'primeng/fullcalendar';
import { IHoliday, ILeave } from 'src/app/model/leave';
import { User } from 'src/app/model/user';
import { LocalStorageService } from 'src/services/local-storage.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import { UtilService } from 'src/services/util.service';
import { FULLDAY_LIST, HALFDAY_LIST, HOLIDAY_LIST } from 'src/app/app.constant';
import { Alert } from '../model/alert';

@Component({
  selector: 'app-full-calendar',
  templateUrl: './full-calendar.component.html',
  styleUrls: ['./full-calendar.component.scss'],
})
export class FullCalendarComponent implements OnInit {
  calendarOptions: CalendarOptions;
  fullDayLeaves: ILeave[];
  halfDayLeaves: ILeave[];
  holidays: IHoliday[];
  selectedItem: EventApi;
  loggedUserName: string;
  @Input() addedItems: ILeave[];
  @Input() removedItems: ILeave[];
  @Input() updatedItems: ILeave[];
  @ViewChild('fullCalendar') fullCalendar: FullCalendar;
  @Output() addedItemsEmitter = new EventEmitter<ILeave[]>();
  @Output() updatedItemsEmitter = new EventEmitter<ILeave[]>();
  @Output() selectedItemEmitter = new EventEmitter<EventApi>();
  @Output() alertEmitter = new EventEmitter<Alert>();

  constructor(
    private localStoreService: LocalStorageService,
    private cdrf: ChangeDetectorRef,
    private utilService: UtilService
  ) {
    const user: User = this.localStoreService.getUser();
    this.loggedUserName = `${user.firstName} ${user.lastName}`;
    this.fullDayLeaves = [];
    this.halfDayLeaves = [];
    this.holidays = [];
  }

  ngOnInit(): void {
    this.fullDayLeaves = this.initFullLeaves();
    this.halfDayLeaves = this.initHalfLeaves();
    this.holidays = this.initHolidays();
    this.initCalendar();
    this.registerExternalDragEvent();
  }

  initCalendar(): void {
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      themeSystem: 'bootstrap',
      headerToolbar: {
        left: 'dayGridMonth',
        center: 'title',
        right: 'prev,today,next',
      },
      buttonText: {
        prev: 'Previous',
        today: 'Today',
        next: 'Next',
        month: 'Month',
      },
      initialView: 'dayGridMonth',
      weekends: true,
      editable: true,
      dayMaxEvents: true,
      droppable: true,
      selectable: true,
      eventSources: [
        {
          events: this.fullDayLeaves,
          color: '#28a745',
        },
        {
          events: this.halfDayLeaves,
          color: '#17a2b8',
        },
        {
          events: this.holidays,
          color: '#f48b29',
        },
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
    const formattedDate1 = this.utilService.formatToTwoDigit(
      `${date.getMonth() - 1}/${date.getDate()}/${date.getFullYear()}`
    );
    const formattedDate2 = this.utilService.formatToTwoDigit2(
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
      const date2 = this.utilService.formatToTwoDigit(
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
      const formattedDate = this.utilService.formatToTwoDigit2(
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
    const date2 = this.utilService.formatToTwoDigit(
      `${date1.getMonth() - 1}/${date1.getDate()}/${date1.getFullYear()}`
    );
    this.addedItems = this.addedItems.filter((item) => {
      const d1 = new Date(item.start);
      const d2 = this.utilService.formatToTwoDigit(
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
    this.cdrf.detectChanges();
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

  private initFullLeaves(): ILeave[] {
    return [
      {
        leaveId: 1,
        title: 'Pranay Kohad:full-day',
        start: '2021-03-01',
        updatedStart: null,
      },
      {
        leaveId: 2,
        title: 'Bhushan Patil:full-day',
        start: '2021-03-07',
        updatedStart: null,
      },
      {
        leaveId: 3,
        title: 'Anuj Kumar:full-day',
        start: '2021-03-09',
        updatedStart: null,
      },
      {
        leaveId: 4,
        title: 'Pallavi Vehale:full-day',
        start: '2021-03-16',
        updatedStart: null,
      },
      {
        leaveId: 5,
        title: 'Pranay Kohad:full-day',
        start: '2021-03-11',
        updatedStart: null,
      },
    ];
  }

  private initHalfLeaves(): ILeave[] {
    return [
      {
        leaveId: 6,
        title: 'Pranay Kohad:half-day',
        start: '2021-03-02',
        updatedStart: null,
      },
      {
        leaveId: 7,
        title: 'Bhushan Patil:half-day',
        start: '2021-03-25',
        updatedStart: null,
      },
      {
        leaveId: 8,
        title: 'Anuj Kumar:half-day',
        start: '2021-03-12',
        updatedStart: null,
      },
    ];
  }

  private initHolidays(): IHoliday[] {
    return [
      {
        title: 'New half-day:holiday',
        start: '2021-01-01',
      },
      {
        title: 'Republic Day:holiday',
        start: '2021-01-25',
      },
      {
        title: 'Holi:holiday',
        start: '2021-03-29',
      },
      {
        title: 'Gudi Padwa:holiday',
        start: '2021-04-13',
      },
      {
        title: 'Ganesh Chaturti:holiday',
        start: '2021-09-10',
      },
      {
        title: 'Dussehra:holiday',
        start: '2021-10-15',
      },
      {
        title: 'Diwali:holiday',
        start: '2021-11-04',
      },
      {
        title: 'New half-day',
        start: '2021-11-05',
      },
    ];
  }
}
