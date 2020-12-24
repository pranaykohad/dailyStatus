import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Alert } from 'src/app/model/alert';
import { Attachment } from 'src/app/model/attachment';
import { DatePicker } from 'src/app/model/datePicker';
import { User } from 'src/app/model/user';
import { StatusService } from 'src/services/status.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
})
export class ReportComponent implements OnInit {
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
    private userService: UserService
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

  thisWeekReport(userId: string) {
    if (new Date().getDay() === 0 || this.currentMondayDate.day <= 0) {
      const alert = {
        message: 'Invalid option. Please try custom dates',
        type: 'fail',
      };
      this.alertEmitter.emit(alert);
    } else {
      const startDate: string = `${this.currentMondayDate.month}/${this.currentMondayDate.day}/${this.currentMondayDate.year}`;
      const endDate: string = `${this.today.month}/${this.today.day}/${this.today.year}`;
      this.getStatus(userId, startDate, endDate, 'Weekly');
    }
  }

  thisMonthReport(userId: string) {
    const startDate: string = `${this.currentMonthFirstDate.month}/${this.currentMonthFirstDate.day}/${this.currentMonthFirstDate.year}`;
    const endDate: string = `${this.today.month}/${this.today.day}/${this.today.year}`;
    this.getStatus(userId, startDate, endDate, 'Monthly');
  }

  customReport(userId: string) {
    if (this.isCustDateInvalid()) {
      const alert = {
        message: 'Start Date cannot be greater than End Date',
        type: 'fail',
      };
      this.alertEmitter.emit(alert);
      return;
    }
    const startDate: string = `${this.customStartDate.month}/${this.customStartDate.day}/${this.customStartDate.year}`;
    const endDate: string = `${this.customEndDate.month}/${this.customEndDate.day}/${this.customEndDate.year}`;
    this.statusService
      .getDailyStsByUserIdAndDaterange(userId, startDate, endDate, 'Custom')
      .subscribe((res) => {
        const alert = this.downloadReport(res);
        this.alertEmitter.emit(alert);
        this.initDates();
      });
  }

  private isCustDateInvalid() {
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
    userId: string,
    startDate: string,
    endDate: string,
    reportType: string
  ) {
    this.statusService
      .getDailyStsByUserIdAndDaterange(userId, startDate, endDate, reportType)
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
    lastMonday.setDate(lastMonday.getDate() - (today.getDay() - 1));
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
    this.customEndDate = new DatePicker(
      today.getMonth() + 1,
      today.getDate(),
      today.getFullYear()
    );
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
      this.statusService.downloadFile(attachment);

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
}
