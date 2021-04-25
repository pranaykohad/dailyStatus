import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EventApi } from '@fullcalendar/angular';
import { DatePicker } from 'src/app/model/datePicker';
import { DateUtilService } from 'src/services/date-util.service';
import { HolidayService } from 'src/services/holiday.service';
import { LeaveService } from 'src/services/leave.service';
import { LocalStorageService } from 'src/services/local-storage.service';
import { StatusService } from 'src/services/status.service';
import { UserService } from 'src/services/user.service';
import { UtilService } from 'src/services/util.service';
import { STATE_LIST, STATUS_ROW_COUNT } from '../app.constant';
import { CustomReportComponent } from '../modal/custom-report/custom-report.component';
import { DefaulterListComponent } from '../modal/defaulter-list/defaulter-list.component';
import { DeleteUserComponent } from '../modal/delete-user/delete-user.component';
import { Attachment } from '../model/attachment';
import { User } from '../model/user';
import { Alert } from './../model/alert';
import { IHoliday, ILeave, Leave } from './../model/leave';
import { Status } from './../model/status';

@Component({
  selector: 'main-root',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  alert: Alert = new Alert(null, null);
  user: User;
  stateList = STATE_LIST;
  statusList: Status[];
  recentStatus: Status[] = [];
  message: string;
  editStatus = false;
  editLeavePlan = false;
  removedItem: ILeave = new Leave();
  selectedItem: EventApi;
  isTimeUp: boolean = true;
  countDown: string;
  holidays: IHoliday[];
  startHour: number;
  endHour: number;
  @ViewChild('defComp') defComp: DefaulterListComponent;
  @ViewChild('delUserComp') delUserComp: DeleteUserComponent;
  @ViewChild('customReportComp') customReportComp: CustomReportComponent;
  private recentDate: DatePicker;
  private alertTimeout: any;
  private today: DatePicker;

  constructor(
    private statusService: StatusService,
    private userService: UserService,
    private localStoreService: LocalStorageService,
    private router: Router,
    private utilService: UtilService,
    private leaveService: LeaveService,
    private dateUtilService: DateUtilService,
    private cdrf: ChangeDetectorRef,
    private holidayService: HolidayService
  ) {
    this.user = this.localStoreService.getUser();
    const startHour = Number(
      this.localStoreService.getSettingByKey('START_HOUR')
    );
    this.startHour = startHour ? startHour : 8;
    const endHour = Number(this.localStoreService.getSettingByKey('END_HOUR'));
    this.endHour = endHour ? endHour : 17;
    this.resetStatusList();
    this.initHolidays();
    const today = new Date();
    this.today = new DatePicker(
      today.getMonth() + 1,
      today.getDate(),
      today.getFullYear()
    );
    this.registerTimer();
  }

  private initHolidays(): void {
    this.holidays = [];
    this.holidayService.getAllHolidays().subscribe((res) => {
      if (res['status'] === 'SUCCESS') {
        this.holidays = res['data'];
      }
    });
  }

  ngOnInit(): void {
    if (!this.userService.getLocalUserName()) {
      this.router.navigateByUrl('/');
    } else {
      this.setRecentDate();
      this.getRecentStatus();
    }
  }

  changeState(index: number, row: Status) {
    row.state = this.stateList[index];
  }

  submitForm(): void {
    if (!this.statusList.length || this.isTimeUp) {
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
      this.removedItem = new Leave();
      this.selectedItem = null;
    }
    this.statusList = [];
    this.message = null;
    this.editStatus = false;
    this.editLeavePlan = false;
    const date = new Date().toLocaleDateString();
    for (let row = 1; row <= STATUS_ROW_COUNT; row++) {
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

  showLeavePlan(): void {
    this.editStatus = false;
    this.editLeavePlan = true;
  }

  addRemovedItem() {
    if (!this.selectedItem) {
      this.removedItem = new Leave();
      return;
    }
    const leave: ILeave = {
      leaveId: this.selectedItem._def.extendedProps.leaveId,
      title: this.selectedItem._def.title,
      start: this.selectedItem._instance.range.start.toString(),
      type: null,
    };
    this.removedItem = leave;
  }

  selectedItemHandler(selectedItem: EventApi) {
    this.selectedItem = selectedItem;
    this.addRemovedItem();
  }

  loggedInUserUpdateHandler() {
    this.user = this.localStoreService.getUser();
  }

  deleteLeaves() {
    if (this.removedItem.leaveId) {
      this.leaveService
        .deleteLeaves(this.removedItem.leaveId)
        .subscribe((res) => {
          this.removedItem = new Leave();
          this.alertHandler({
            message: res['description'],
            type: res['status'],
          });
          // remove card from UI
          this.selectedItem.remove();
          this.selectedItem = null;
          this.resetCalendar();
        });
    }
  }

  resetCalendar() {
    this.editLeavePlan = false;
    this.cdrf.detectChanges();
    this.editLeavePlan = true;
    this.cdrf.detectChanges();
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
        status.description = this.utilService.removeCommaAndNewLine(
          status.description
        );
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

  private registerTimer() {
    setInterval(() => {
      const date: Date = new Date();
      const currentHour: number = date.getHours();
      this.isTimeUp = !(
        currentHour >= this.startHour && currentHour < this.endHour
      );
      if (this.isTimeUp) {
        this.countDown = null;
      } else {
        this.countDown = `${this.endHour - (currentHour + 1)}h ${
          60 - (date.getMinutes() + 1)
        }m ${60 - (date.getSeconds() + 1)}s`;
      }
    }, 1000);
  }
}
