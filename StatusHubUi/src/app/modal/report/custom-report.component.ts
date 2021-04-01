import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SATURDAY, SUNDAY } from 'src/app/app.constant';
import { Alert } from 'src/app/model/alert';
import { Attachment } from 'src/app/model/attachment';
import { DatePicker } from 'src/app/model/datePicker';
import { User } from 'src/app/model/user';
import { StatusService } from 'src/services/status.service';
import { UtilService } from 'src/services/util.service';

@Component({
  selector: 'app-custom-report',
  templateUrl: './custom-report.component.html',
})
export class CustomReportComponent {
  @Input() user: User;
  @Input() userList: User[];
  @Output() alertEmitter = new EventEmitter<Alert>();
  today: DatePicker;
  currentMondayDate: DatePicker;
  currentMonthFirstDate: DatePicker;
  customStartDate: DatePicker;
  customEndDate: DatePicker;
  selectedUser = [];

  constructor(
    private statusService: StatusService,
    private utilService: UtilService
  ) {
    this.initDates();
  }

  thisWeekReport(selectedUsrList: HTMLCollectionOf<HTMLOptionElement>) {
    const userIdList = this.buildSelectedUserList(selectedUsrList);
    if (this.isSatOrSun() || this.currentMondayDate.day <= 0) {
      alert('Invalid Operation!');
      return;
    } else {
      this.getStatus(userIdList, this.currentMondayDate, this.today, 'Weekly');
    }
  }

  thisMonthReport(selectedUsrList: HTMLCollectionOf<HTMLOptionElement>) {
    const userIdList = this.buildSelectedUserList(selectedUsrList);
    this.getStatus(
      userIdList,
      this.currentMonthFirstDate,
      this.today,
      'Monthly'
    );
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
    this.getStatus(
      userIdList,
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

  private isStartDateGreater() {
    const endDate = new Date(
      this.customEndDate.year,
      this.customEndDate.month - 1,
      this.customEndDate.day
    );
    const startDate = new Date(
      this.customStartDate.year,
      this.customStartDate.month - 1,
      this.customStartDate.day
    );
    return endDate.getTime() - startDate.getTime() < 0;
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

  private buildSelectedUserList(
    selectedUsrList: HTMLCollectionOf<HTMLOptionElement>
  ) {
    const userIdList = [];
    Array.from(selectedUsrList).forEach((element) => {
      userIdList.push(element.value);
    });
    return userIdList;
  }

  private isSatOrSun(): boolean {
    const today = new Date();
    return today.getDay() === SATURDAY || today.getDay() === SUNDAY;
  }
}
