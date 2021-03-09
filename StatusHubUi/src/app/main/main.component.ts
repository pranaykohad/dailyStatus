import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarOptions, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import { FullCalendar } from 'primeng/fullcalendar';
import { DatePicker } from 'src/app/model/datePicker';
import { FullCalendarComponent } from 'src/full-calendar/full-calendar.component';
import { LocalStorageService } from 'src/services/local-storage.service';
import { StatusService } from 'src/services/status.service';
import { UserService } from 'src/services/user.service';
import { UtilService } from 'src/services/util.service';
import { stateList } from '../app.constant';
import { DefaulterListComponent } from '../modal/defaulter-list/defaulter-list.component';
import { WsrReportComponent } from '../modal/wsr-report/wsr-report.component';
import { Attachment } from '../model/attachment';
import { User } from '../model/user';
import { numOfStatus } from './../app.constant';
import { Alert } from './../model/alert';
import { ILeave } from './../model/leave';
import { Status } from './../model/status';

@Component({
  selector: 'main-root',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  alert: Alert;
  user: User;
  stateList;
  statusList: Status[];
  recentDate: DatePicker;
  recentStatus: Status[];
  alertTimeout: any;
  today: DatePicker;
  userList: User[];
  todaysStatus: Status[];
  message: string;
  editStatus = false;
  editLeavePlan = false;
  fullDayLeaves: ILeave[];
  halfDayLeaves: ILeave[];
  calendarOptions: CalendarOptions;
  addedItems: ILeave[];
  removedItems: ILeave[];
  updatedItems: ILeave[];
  selectedItem: EventApi;
  loggedUserName: string;
  @ViewChild('defComp') defComp: DefaulterListComponent;
  @ViewChild('wsrReportComp') wsrReportComp: WsrReportComponent;
  @ViewChild('fullCalendar') fullCalendar: FullCalendarComponent;

  constructor(
    private statusService: StatusService,
    private userService: UserService,
    private localStoreService: LocalStorageService,
    private router: Router,
    private utilService: UtilService,
    private cdrf: ChangeDetectorRef
  ) {
    this.alert = new Alert(null, null);
    this.user = this.localStoreService.getUser();
    this.stateList = stateList;
    this.recentStatus = [];
    this.resetStatusList();
    const today = new Date();
    this.today = new DatePicker(
      today.getMonth() + 1,
      today.getDate(),
      today.getFullYear()
    );
    this.loggedUserName = this.user.firstName + ' ' + this.user.lastName;
    this.addedItems = [];
    this.removedItems = [];
    this.updatedItems = [];
    this.fullDayLeaves = [];
    this.halfDayLeaves = [];
  }

  ngOnInit(): void {
    if (!this.userService.getLocalUserName()) {
      this.router.navigateByUrl('/');
    } else {
      this.setRecentDate();
      this.getRecentStatus();
      this.getAllUser();
    }
  }

  changeState(index: number, row: Status) {
    row.state = this.stateList[index];
  }

  submitStatus() {
    if (this.editLeavePlan) {
      console.log(this.addedItems);
      console.log(this.updatedItems);
      console.log(this.removedItems);
      return;
    }
    if (!this.statusList.length) {
      return;
    }
    const statusList: Status[] = [];
    let isStsLenCorrect = true;
    isStsLenCorrect = this.buildStatusList(isStsLenCorrect, statusList);
    if (!isStsLenCorrect) {
      return;
    } else if (statusList.length) {
      this.statusService.updateStatus(statusList).subscribe((res) => {
        if (res['description'] === 'Status saved successfully') {
          this.resetStatusList();
        }
        this.alertHandler({ message: res['description'], type: res['status'] });
      });
    } else {
      this.alertHandler({
        message: 'Cannot submit. Empty description',
        type: 'fail',
      });
    }
  }

  resetStatusList() {
    if (this.editLeavePlan) {
      this.addedItems.length = 0;
      this.updatedItems.length = 0;
      this.removedItems.length = 0;
      this.selectedItem = null;
    }
    this.statusList = [];
    this.message = null;
    this.editStatus = false;
    this.editLeavePlan = false;
    const date = new Date().toLocaleDateString();
    for (let row = 1; row <= numOfStatus; row++) {
      this.statusList.push(
        new Status(
          '',
          '',
          'In progress',
          this.utilService.formatToTwoDigit(date),
          this.user
        )
      );
    }
  }

  alertHandler(alert: Alert) {
    this.alert = {
      message: alert.message,
      type: alert.type,
    };
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
    this.alertTimeout = setTimeout(() => {
      this.alert = new Alert(null, '');
    }, 5000);
  }

  logout() {
    this.localStoreService.resetLocalStorage();
    this.router.navigateByUrl('/');
  }

  todaysReport() {
    this.statusService
      .getTodaysReport(
        `${this.today.month}/${this.today.day}/${this.today.year}`
      )
      .subscribe((res) => {
        const alert = this.downloadReport(res);
        this.alertHandler(alert);
      });
  }

  getAllUser() {
    this.userList = [];
    this.userService.getAllUser().subscribe((res) => {
      if (res['status'] === 'FAILURE') {
        const alert = { message: res['description'], type: res['status'] };
        this.alertHandler(alert);
      } else {
        this.userList = res['data'];
      }
    });
  }

  getTodaysStatus() {
    if (this.editStatus) {
      return;
    }
    this.statusList = [];
    this.editStatus = true;
    this.editLeavePlan = false;
    const today: string = `${this.today.month}/${this.today.day}/${this.today.year}`;
    this.statusService
      .statusByDateAndUserId(today, this.user.userId)
      .subscribe((res) => {
        if (res['data']) {
          this.statusList = res['data'];
          this.message = null;
        } else {
          this.message = 'No Status Found';
        }
      });
  }

  initDefList() {
    this.defComp.defaulterList = [];
    this.defComp.message = '';
  }

  clearLeaveReport() {
    const a: HTMLInputElement = document.querySelector('#leaveReport');
    if (a) {
      a.value = null;
    }
    this.wsrReportComp.selectedSheetName = null;
    this.wsrReportComp.sheetNames = [];
  }

  showLeavePlan(): void {
    this.editStatus = false;
    this.editLeavePlan = true;
  }

  deleteLeave() {
    if (!this.selectedItem) {
      return;
    }
    const leave: ILeave = {
      leaveId: this.selectedItem._def.extendedProps.leaveId
        ? this.selectedItem._def.extendedProps.leaveId
        : null,
      title: this.selectedItem._def.title,
      start: this.selectedItem._instance.range.start.toString(),
      updatedStart: null,
    };
    this.selectedItem.remove();
    if (leave.leaveId) {
      this.removedItems.push(leave);
    } else {
      this.fullCalendar.removeAddedLeave(
        this.selectedItem._instance.range.start
      );
    }
    this.selectedItem = null;
  }

  addedItemsHandler(leaves: ILeave[]) {
    this.addedItems = leaves;
  }

  updatedItemsHandler(leaves: ILeave[]) {
    this.updatedItems = leaves;
  }

  selectedItemHandler(selectedItem: EventApi) {
    this.selectedItem = selectedItem;
  }

  // removeAddedLeave(date) {
  //   const date1 = new Date(date);
  //   const date2 = this.utilService.formatToTwoDigit(
  //     `${date1.getMonth() - 1}/${date1.getDate()}/${date1.getFullYear()}`
  //   );
  //   this.addedItems = this.addedItems.filter((item) => {
  //     const d1 = new Date(item.start);
  //     const d2 = this.utilService.formatToTwoDigit(
  //       `${d1.getMonth() - 1}/${d1.getDate()}/${d1.getFullYear()}`
  //     );
  //     if (JSON.stringify(date2) !== JSON.stringify(d2)) {
  //       return true;
  //     }
  //   });
  // }

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

  private externalDrop(info: any) {
    const leave: ILeave = {
      leaveId: null,
      title: info.draggedEl.id,
      start: info.date,
      updatedStart: null,
    };
    if (this.isInNewLeaves(leave) || this.isInExistingLeaves(leave)) {
      // this.removeAddedLeave(new Date(info.start));
      info.remove();
    } else {
      this.addedItems.push(leave);
    }
  }

  private isInNewLeaves(info: ILeave): boolean {
    const date1 = new Date(info.start);
    const date2 = this.utilService.formatToTwoDigit(
      `${date1.getMonth() - 1}/${date1.getDate()}/${date1.getFullYear()}`
    );
    return this.addedItems.some((item) => {
      const d1 = new Date(item.start);
      const d2 = this.utilService.formatToTwoDigit(
        `${d1.getMonth() - 1}/${d1.getDate()}/${d1.getFullYear()}`
      );
      return JSON.stringify(date2) === JSON.stringify(d2);
    });
  }

  private isInExistingLeaves(leave: ILeave): boolean {
    const date = new Date(leave.start);
    const formattedDate = this.utilService.formatToTwoDigit2(
      `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
    );
    let isExists = false;
    this.calendarOptions.eventSources.forEach((event) => {
      event['events'].forEach((item) => {
        if (
          JSON.stringify(formattedDate) === JSON.stringify(item.start) &&
          this.loggedUserName.toUpperCase() ===
            item.title.split(':')[0].toUpperCase() &&
          !this.isInRemovedLeaves(formattedDate)
        ) {
          isExists = true;
        }
      });
    });
    return isExists;
  }

  private isInRemovedLeaves(leaveDate: string): boolean {
    return this.removedItems.some((item) => {
      const date = new Date(item.start);
      const formattedDate = this.utilService.formatToTwoDigit2(
        `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
      );
      if (JSON.stringify(formattedDate) === JSON.stringify(leaveDate)) {
        return true;
      }
    });
  }

  private isValidUser(draggedEvent: any): boolean {
    const draggedUser = draggedEvent._def.title.split(':')[0];
    const isValid =
      draggedUser.toUpperCase() === this.loggedUserName.toUpperCase();
    return isValid;
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

  private setRecentDate() {
    const recentDate = new Date();
    const todaysDay = new Date().getDay();
    if (todaysDay === 1) {
      recentDate.setDate(recentDate.getDate() - 3);
    } else if (todaysDay === 0) {
      recentDate.setDate(recentDate.getDate() - 2);
    } else {
      recentDate.setDate(recentDate.getDate() - 1);
    }
    this.recentDate = new DatePicker(
      recentDate.getMonth() + 1,
      recentDate.getDate(),
      recentDate.getFullYear()
    );
  }

  private getRecentStatus() {
    const yesterday: string = `${this.recentDate.month}/${this.recentDate.day}/${this.recentDate.year}`;
    this.statusService
      .statusByDateAndUserId(yesterday, this.user.userId)
      .subscribe((res) => {
        if (res['data']) {
          this.recentStatus = res['data'];
        }
      });
  }

  private buildStatusList(
    isStsLenCorrect: boolean,
    statusList: Status[]
  ): boolean {
    this.statusList.forEach((status) => {
      if (status.description.trim().length) {
        status.description = status.description.trim();
        status.description = this.utilService.removeComma(status.description);
        status.ticketId = status.ticketId ? status.ticketId.trim() : null;
        if (status.description.length > 250) {
          this.alertHandler({
            message: 'Description cannot be more than 250 characters',
            type: 'fail',
          });
          isStsLenCorrect = false;
        }
        statusList.push(status);
      } else if (!status.description.trim().length && this.editStatus) {
        statusList = [];
        isStsLenCorrect = true;
      }
    });
    return isStsLenCorrect;
  }

  private downloadReport(res: any): Alert {
    let alert = null;
    if (res['data']) {
      const data = res['data'];
      const attachment: Attachment = new Attachment(
        data['filename'],
        data['fileContent'],
        data['mimeType']
      );
      this.utilService.downloadFile(attachment);
      alert = {
        message: 'Report downloaded successfully',
        type: 'success',
      };
    } else {
      alert = {
        message: res['description'],
        type: res['status'],
      };
    }
    return alert;
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
}
