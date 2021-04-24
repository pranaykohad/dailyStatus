import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DEFAULT_USER_TYPE } from 'src/app/app.constant';
import { Alert } from 'src/app/model/alert';
import { Attachment } from 'src/app/model/attachment';
import { DatePicker } from 'src/app/model/datePicker';
import { IUser, User } from 'src/app/model/user';
import { DateUtilService } from 'src/services/date-util.service';
import { LocalStorageService } from 'src/services/local-storage.service';
import { StatusService } from 'src/services/status.service';
import { UserService } from 'src/services/user.service';
import { UtilService } from 'src/services/util.service';

@Component({
  selector: 'app-custom-report',
  templateUrl: './custom-report.component.html',
  styleUrls: ['./custom-report.component.scss'],
})
export class CustomReportComponent {
  today: DatePicker;
  currentMondayDate: DatePicker;
  currentMonthFirstDate: DatePicker;
  customStartDate: DatePicker;
  customEndDate: DatePicker;
  selectedUser = [];
  userTypes = [];
  selUserType: string;
  isUserSelected = false;
  selUserList = [];
  userIdList = [];
  @Input() user: User;
  @Output() alertEmitter = new EventEmitter<Alert>();
  userList: IUser[];

  constructor(
    private statusService: StatusService,
    private utilService: UtilService,
    private userService: UserService,
    private dateUtilService: DateUtilService,
    private localStoreService: LocalStorageService
  ) {
    this.initUserTypes();
    this.initDates();
  }

  getUserList(userType: string) {
    this.userList = [];
    this.userService.getUsersByUserType(userType).subscribe((res) => {
      if (res['status'] === 'FAILURE') {
        const alert: Alert = {
          message: res['description'],
          type: res['status'],
        };
        this.alertEmitter.emit(alert);
      } else {
        this.userList = res['data'];
        this.setInitialSelectedUser();
      }
    });
  }

  usersChange(selectedList: HTMLOptionElement[]) {
    this.selUserList = [];
    this.userIdList = [];
    this.isUserSelected = true;
    for (let i = 0; i < selectedList.length; i++) {
      this.selUserList.push(selectedList[i].text);
      this.userIdList.push(selectedList[i].value);
    }
  }

  thisWeekReport() {
    if (!this.isUserSelected) {
      return;
    }
    if (this.utilService.isSatOrSun() || this.currentMondayDate.day <= 0) {
      alert('Invalid Operation!');
      return;
    } else {
      this.getStatus(
        this.userIdList,
        this.currentMondayDate,
        this.today,
        'Weekly'
      );
    }
  }

  thisMonthReport() {
    if (!this.isUserSelected) {
      return;
    }
    this.getStatus(
      this.userIdList,
      this.currentMonthFirstDate,
      this.today,
      'Monthly'
    );
  }

  customReport() {
    if (!this.isUserSelected) {
      return;
    }
    if (
      this.dateUtilService.isStartDateGreater(
        this.customStartDate,
        this.customEndDate
      )
    ) {
      const alert = {
        message: 'Start Date cannot be greater than End Date',
        type: 'fail',
      };
      this.alertEmitter.emit(alert);
      return;
    }
    this.getStatus(
      this.userIdList,
      this.customStartDate,
      this.customEndDate,
      'Custom'
    );
  }

  onMultiSelect(selectedUsrList: HTMLCollectionOf<HTMLOptionElement>) {
    this.selectedUser = [];
    Array.from(selectedUsrList).forEach((element) => {
      this.selectedUser.push(element.label);
    });
  }

  private getStatus(
    userIdList: string[],
    startDate: DatePicker,
    endDate: DatePicker,
    reportType: string
  ) {
    const start = `${startDate.month}/${startDate.day}/${startDate.year}`;
    const end = `${endDate.month}/${endDate.day}/${endDate.year}`;
    this.statusService
      .getDailyStsByUserIdAndDaterange(userIdList, start, end, reportType)
      .subscribe((res) => {
        const alert = this.downloadReport(res);
        this.alertEmitter.emit(alert);
        this.initDates();
      });
  }

  private initDates() {
    const today = new Date();
    this.today = new DatePicker(
      today.getMonth() + 1,
      today.getDate(),
      today.getFullYear()
    );
    const lastMonday = new Date();
    lastMonday.setDate(today.getDate() - (today.getDay() - 1));
    this.currentMondayDate = new DatePicker(
      lastMonday.getMonth() + 1,
      lastMonday.getDate(),
      lastMonday.getFullYear()
    );
    this.currentMonthFirstDate = new DatePicker(
      today.getMonth() + 1,
      1,
      today.getFullYear()
    );
    this.customStartDate = new DatePicker(
      today.getMonth() + 1,
      today.getDate(),
      today.getFullYear()
    );
    this.customEndDate = this.customStartDate;
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

  private initUserTypes() {
    this.userTypes.push(DEFAULT_USER_TYPE);
    const userTypeList: string = this.localStoreService.getSettingByKey(
      'USER_TYPE_LIST'
    );
    this.userTypes.push(...userTypeList.split(','));
  }

  private setInitialSelectedUser() {
    this.isUserSelected = false;
    this.selUserList = [];
    this.userIdList = [];
    const user: User = this.userList.find((usr) => {
      if (usr.userId === this.user.userId) {
        return usr;
      }
    });
    if (user) {
      this.selUserList.push(user.firstName + ' ' + user.lastName);
      this.userIdList.push(user.userId);
      this.isUserSelected = true;
    }
  }
}
