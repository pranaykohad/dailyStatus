import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EventApi } from '@fullcalendar/core';
import { FullCalendarComponent } from 'src/app/full-calendar/full-calendar.component';
import { DatePicker } from 'src/app/model/datePicker';
import { DateUtilService } from 'src/services/date-util.service';
import { HolidayService } from 'src/services/holiday.service';
import { LeaveService } from 'src/services/leave.service';
import { LocalStorageService } from 'src/services/local-storage.service';
import { StatusService } from 'src/services/status.service';
import { UserService } from 'src/services/user.service';
import { UtilService } from 'src/services/util.service';
import {
  DEFAULT_USER_TYPE,
  FULL_DAY_LABEL,
  HALF_DAY_LABEL,
  stateList,
} from '../app.constant';
import { DefaulterListComponent } from '../modal/defaulter-list/defaulter-list.component';
import { CustomReportComponent } from '../modal/report/custom-report.component';
import { Attachment } from '../model/attachment';
import { User } from '../model/user';
import { numOfStatus } from './../app.constant';
import { Alert } from './../model/alert';
import { IHoliday, ILeave } from './../model/leave';
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
  addedItems: ILeave[];
  removedItems: ILeave[];
  selectedItem: EventApi;
  loggedUserName: string;
  editMode = false;
  DEFAULT_USER_TYPE = DEFAULT_USER_TYPE;
  holidays: IHoliday[];
  currrentMonth: string;
  @ViewChild('defComp') defComp: DefaulterListComponent;
  @ViewChild('fullCalendar') fullCalendar: FullCalendarComponent;
  @ViewChild('customReportComp') customReportComp: CustomReportComponent;

  constructor(
    private statusService: StatusService,
    private userService: UserService,
    private localStoreService: LocalStorageService,
    private router: Router,
    private utilService: UtilService,
    private leaveService: LeaveService,
    private holidayService: HolidayService,
    private dateUtilService: DateUtilService
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
    this.setCurrentMonth();
    this.addedItems = [];
    this.removedItems = [];
  }

  ngOnInit(): void {
    if (!this.userService.getLocalUserName()) {
      this.router.navigateByUrl('/');
    } else {
      this.setRecentDate();
      this.getRecentStatus();
      this.getUsersByUserType(this.DEFAULT_USER_TYPE);
      this.initHolidays();
      this.initHalfDayLeaves(this.currrentMonth);
      this.initFullDayLeaves(this.currrentMonth);
    }
  }

  changeState(index: number, row: Status) {
    row.state = this.stateList[index];
  }

  submitForm(): void {
    if (this.editLeavePlan) {
      this.submitLeaves();
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
        message: 'Cannot submit with empty description',
        type: 'fail',
      });
    }
  }

  resetStatusList() {
    if (this.editLeavePlan) {
      this.addedItems = [];
      this.removedItems = [];
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
          this.dateUtilService.formatSlashDate(date),
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

  getUsersByUserType(userType) {
    if (this.customReportComp) {
      this.customReportComp.selUserType = userType;
    }
    this.userList = [];
    this.userService.getUsersByUserType(userType).subscribe((res) => {
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
    if (leave.leaveId) {
      // add item in removed-item list, so that we can remove those from existing object
      const temp = this.removedItems;
      this.removedItems = [];
      this.removedItems = this.removedItems.concat(temp).concat(leave);
    } else {
      // remove item from added-items list.
      this.fullCalendar.updateAddedItems(
        this.selectedItem._instance.range.start
      );
    }
    // remove card from UI
    this.selectedItem.remove();
    this.selectedItem = null;
  }

  addedItemsHandler(leaves: ILeave[]) {
    this.addedItems = leaves;
  }

  selectedItemHandler(selectedItem: EventApi) {
    this.selectedItem = selectedItem;
  }

  userTypeHandler(userType: string) {
    this.getUsersByUserType(userType);
  }

  monthHandler(month: string) {
    this.leaveService.getLeaves(FULL_DAY_LABEL, month).subscribe((res) => {
      if (res['status'] === 'SUCCESS') {
        this.fullDayLeaves = res['data'];
      }
    });
    this.leaveService.getLeaves(HALF_DAY_LABEL, month).subscribe((res) => {
      if (res['status'] === 'SUCCESS') {
        this.halfDayLeaves = res['data'];
      }
    });
  }

  loggedInUserUpdateHandler() {
    this.user = this.localStoreService.getUser();
  }

  updateUserListHandler() {
    this.getUsersByUserType(DEFAULT_USER_TYPE);
  }

  private submitLeaves() {
    if (this.addedItems.length) {
      this.addLeaves();
    }
    this.deleteLeaves();
  }

  private addLeaves() {
    const addedItems = this.addedItems;
    addedItems.forEach((item) => {
      item.start = this.dateUtilService.formatCalDateToDate(
        new Date(item.start)
      );
    });
    this.leaveService.addLeaves(addedItems).subscribe((res) => {
      this.addedItems.length = 0;
      this.alertHandler({
        message: res['description'],
        type: res['status'],
      });
      this.reInitFullCalendar();
    });
  }

  private deleteLeaves() {
    const leavesIds: number[] = [];
    this.removedItems.forEach((item) => {
      leavesIds.push(item.leaveId);
    });
    if (leavesIds.length) {
      this.leaveService.deleteLeaves(leavesIds).subscribe((res) => {
        this.removedItems.length = 0;
        this.alertHandler({
          message: res['description'],
          type: res['status'],
        });
        this.reInitFullCalendar();
      });
    }
  }

  private reInitFullCalendar() {
    this.initHalfDayLeaves(this.currrentMonth);
    this.initFullDayLeaves(this.currrentMonth);
    this.resetStatusList();
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

  private initHolidays(): void {
    this.holidays = [];
    this.holidayService.getAllHolidays().subscribe((res) => {
      if (res['status'] === 'SUCCESS') {
        this.holidays = res['data'];
      }
    });
  }

  // private getThreeMonthHalfDayLeaves() {
  //   const dateArray: string[] = this.dateUtilService.getYMSlashFromDate();
  //   const previousMonth = dateArray[0];
  //   const currentMonth = dateArray[1];
  //   const nextMonth = dateArray[2];
  //   let halfDayLeaves: ILeave[] = [];
  //   forkJoin(
  //     this.leaveService.getLeaves(HALF_DAY_LABEL, previousMonth),
  //     this.leaveService.getLeaves(HALF_DAY_LABEL, currentMonth),
  //     this.leaveService.getLeaves(HALF_DAY_LABEL, nextMonth)
  //   ).subscribe((res) => {
  //     halfDayLeaves = halfDayLeaves.concat(res[0]['data']);
  //     halfDayLeaves = halfDayLeaves.concat(res[1]['data']);
  //     halfDayLeaves = halfDayLeaves.concat(res[2]['data']);
  //     this.halfDayLeaves = halfDayLeaves;
  //   });
  // }

  private initHalfDayLeaves(currrentMonth: string) {
    this.halfDayLeaves = [];
    this.leaveService
      .getLeaves(HALF_DAY_LABEL, currrentMonth)
      .subscribe((res) => {
        if (res['status'] === 'SUCCESS') {
          this.halfDayLeaves = res['data'];
        }
      });
  }

  private initFullDayLeaves(currrentMonth: string): void {
    this.fullDayLeaves = [];
    this.leaveService
      .getLeaves(FULL_DAY_LABEL, currrentMonth)
      .subscribe((res) => {
        if (res['status'] === 'SUCCESS') {
          this.fullDayLeaves = res['data'];
        }
      });
  }

  private setCurrentMonth() {
    const date = new Date();
    this.currrentMonth = this.dateUtilService.formatHyphenDate(
      date.getFullYear() + '-' + (date.getMonth() + 1)
    );
  }
}
