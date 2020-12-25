import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Alert } from 'src/app/model/alert';
import { Attachment } from 'src/app/model/attachment';
import { DatePicker } from 'src/app/model/datePicker';
import { User } from 'src/app/model/user';
import { StatusService } from 'src/services/status.service';
import { UserService } from 'src/services/user.service';
import { UtilService } from 'src/services/util.service';

@Component({
  selector: 'app-custom-report',
  templateUrl: './custom-report.component.html',
})
export class CustomReportComponent implements OnInit {
  @Input() user: User;
  @Output() alertEmitter = new EventEmitter<Alert>();
  userList: User[];
  today: DatePicker;
  currentMondayDate: DatePicker;
  currentMonthFirstDate: DatePicker;
  customStartDate: DatePicker;
  customEndDate: DatePicker;

  constructor(
    private statusService: StatusService,
    private userService: UserService,
    private utilService: UtilService
  ) {
    this.initDates();
  }

  ngOnInit(): void {
    this.getAllUser();
  }

  getAllUser() {
    this.userService.gteAllUser().subscribe((res) => {
      if (res['status'] === 'FAILURE') {
        const alert = { message: res['description'], type: res['status'] };
        this.alertEmitter.emit(alert);
      } else {
        this.userList = res['data'];
      }
    });
  }

  thisWeekReport(selectedUsrList: HTMLCollectionOf<HTMLOptionElement>) {
    const userIdList = this.buildSelectedUserList(selectedUsrList);
    if (new Date().getDay() === 0 || this.currentMondayDate.day <= 0) {
      const alert = {
        message: 'Invalid option. Please try custom dates',
        type: 'fail',
      };
      this.alertEmitter.emit(alert);
    } else {
      const startDate: string = `${this.currentMondayDate.month}/${this.currentMondayDate.day}/${this.currentMondayDate.year}`;
      const endDate: string = `${this.today.month}/${this.today.day}/${this.today.year}`;
      this.getStatus(userIdList, startDate, endDate, 'Weekly');
    }
  }

  thisMonthReport(selectedUsrList: HTMLCollectionOf<HTMLOptionElement>) {
    const userIdList = this.buildSelectedUserList(selectedUsrList);
    const startDate: string = `${this.currentMonthFirstDate.month}/${this.currentMonthFirstDate.day}/${this.currentMonthFirstDate.year}`;
    const endDate: string = `${this.today.month}/${this.today.day}/${this.today.year}`;
    this.getStatus(userIdList, startDate, endDate, 'Monthly');
  }

  customReport(selectedUsrList: HTMLCollectionOf<HTMLOptionElement>) {
    const userIdList = this.buildSelectedUserList(selectedUsrList);
    if (this.isStartDateGreater()) {
      const alert = {
        message: 'Start Date cannot be greater than End Date',
        type: 'fail',
      };
      this.alertEmitter.emit(alert);
      return;
    }
    const startDate: string = `${this.customStartDate.month}/${this.customStartDate.day}/${this.customStartDate.year}`;
    const endDate: string = `${this.customEndDate.month}/${this.customEndDate.day}/${this.customEndDate.year}`;
    this.getStatus(userIdList, startDate, endDate, 'Custom');
  }

  private isStartDateGreater() {
    const endDate1 = new Date(
      this.customEndDate.month,
      this.customEndDate.day,
      this.customEndDate.year
    );
    const startDate1 = new Date(
      this.customStartDate.month,
      this.customStartDate.day,
      this.customStartDate.year
    );
    return endDate1.getTime() - startDate1.getTime() < 0;
  }

  private getStatus(
    userIdList: string[],
    startDate: string,
    endDate: string,
    reportType: string
  ) {
    this.statusService
      .getDailyStsByUserIdAndDaterange(
        userIdList,
        startDate,
        endDate,
        reportType
      )
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
        message: 'Status is downloaded successfully.',
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

  private buildSelectedUserList(
    selectedUsrList: HTMLCollectionOf<HTMLOptionElement>
  ) {
    const userIdList = [];
    Array.from(selectedUsrList).forEach((element) => {
      userIdList.push(element.value);
    });
    return userIdList;
  }
}
