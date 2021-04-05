import { HolidayService } from 'src/services/holiday.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EventApi } from '@fullcalendar/core';
import { FullCalendarComponent } from 'src/app/full-calendar/full-calendar.component';
import { DatePicker } from 'src/app/model/datePicker';
import { LeaveService } from 'src/services/leave.service';
import { LocalStorageService } from 'src/services/local-storage.service';
import { StatusService } from 'src/services/status.service';
import { UserService } from 'src/services/user.service';
import { UtilService } from 'src/services/util.service';
import { DEFAULT_USER_TYPE, stateList } from '../app.constant';
import { DefaulterListComponent } from '../modal/defaulter-list/defaulter-list.component';
import { WsrReportComponent } from '../modal/wsr-report/wsr-report.component';
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
  updatedItems: ILeave[];
  selectedItem: EventApi;
  loggedUserName: string;
  editMode = false;
  DEFAULT_USER_TYPE = DEFAULT_USER_TYPE;
  holidays: IHoliday[];
  currrentMonth: string;
  @ViewChild('defComp') defComp: DefaulterListComponent;
  @ViewChild('wsrReportComp') wsrReportComp: WsrReportComponent;
  @ViewChild('fullCalendar') fullCalendar: FullCalendarComponent;
  @ViewChild('customReportComp') customReportComp: CustomReportComponent;

  constructor(
    private statusService: StatusService,
    private userService: UserService,
    private localStoreService: LocalStorageService,
    private router: Router,
    private utilService: UtilService,
    private leaveService: LeaveService,
    private holidayService: HolidayService
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
    this.updatedItems = [];
  }

  ngOnInit(): void {
    if (!this.userService.getLocalUserName()) {
      this.router.navigateByUrl('/');
    } else {
      this.setRecentDate();
      this.getRecentStatus();
      this.getUsersByUserType(this.DEFAULT_USER_TYPE);
      this.initHolidays();
      this.initHalfDayLeaves();
      this.initFullDayLeaves();
    }
  }

  changeState(index: number, row: Status) {
    row.state = this.stateList[index];
  }

  submitStatus() {
    if (this.editLeavePlan) {
      return this.submitLeaves();
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

  private submitLeaves() {
    if (this.addedItems.length) {
      this.leaveService.addLeaves(this.addedItems).subscribe((res) => {
        this.addedItems.length = 0;
      });
    }
    const leavesIds: number[] = [];
    this.removedItems.forEach((item) => {
      leavesIds.push(item.leaveId);
    });
    if (leavesIds.length) {
      this.leaveService.deleteLeaves(leavesIds).subscribe((res) => {
        this.removedItems.length = 0;
      });
    }
    return;
  }
  userTypeHandler(userType: string) {
    this.getUsersByUserType(userType);
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
      this.holidays = res['data'];
    });
  }

  private initHalfDayLeaves(): void {
    this.halfDayLeaves = [];
    this.leaveService
      .getLeaves('half-day', this.currrentMonth)
      .subscribe((res) => {
        this.halfDayLeaves = res['data'];
      });
  }

  private initFullDayLeaves(): void {
    this.fullDayLeaves = [];
    this.leaveService
      .getLeaves('full-day', this.currrentMonth)
      .subscribe((res) => {
        this.fullDayLeaves = res['data'];
      });
  }

  private setCurrentMonth() {
    const date = new Date();
    this.currrentMonth = this.utilService.formatToTwoDigit3(
      date.getFullYear() + '-' + (date.getMonth() + 1)
    );
  }
}
