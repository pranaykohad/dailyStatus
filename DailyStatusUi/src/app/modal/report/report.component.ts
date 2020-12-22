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
  alert: Alert;
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
    this.alert = new Alert(null, null);
  }

  ngOnInit(): void {
    this.getAllUser();
  }

  todaysReport() {
    this.statusService
      .getTodaysReport(
        `${this.today.month}/${this.today.day}/${this.today.year}`
      )
      .subscribe((res) => {
        this.downloadReport(res);
      });
  }

  getAllUser() {
    this.userService.gteAllUser().subscribe((res) => {
      if (res['status'] === 'FAILURE') {
        this.setAlertMsg(res['description'], res['status']);
        this.alertEmitter.emit(this.alert);
      } else {
        this.userList = res['data'];
      }
    });
  }

  thisWeekReport(userId: string) {
    if (new Date().getDay() === 0 || this.currentMondayDate.day <= 0) {
      this.setAlertMsg('Invalid option. Please try custom dates', 'fail');
      this.alertEmitter.emit(this.alert);
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
    const startDate: string = `${this.customStartDate.month}/${this.customStartDate.day}/${this.customStartDate.year}`;
    const endDate: string = `${this.customEndDate.month}/${this.customEndDate.day}/${this.customEndDate.year}`;
    this.statusService
      .getDailyStsByUserIdAndDaterange(userId, startDate, endDate, 'Custom')
      .subscribe((res) => {
        this.downloadReport(res);
      });
  }

  private setAlertMsg(msg: string, type: string) {
    this.alert.message = msg;
    this.alert.type = type;
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
        this.downloadReport(res);
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

  private downloadReport(res: any) {
    if (res['data']) {
      const data = res['data'];
      const attachment: Attachment = new Attachment(
        data['filename'],
        data['fileContent'],
        data['mimeType']
      );
      this.statusService.downloadFile(attachment);
      this.setAlertMsg('Status is downloaded successfully.', 'success');
      this.alertEmitter.emit(this.alert);
    } else {
      this.setAlertMsg(res['description'], res['status']);
      this.alertEmitter.emit(this.alert);
    }
    this.initDates();
  }
}