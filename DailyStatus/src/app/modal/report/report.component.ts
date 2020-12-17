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
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {
  @Input() user: User;
  @Output() alertEmitter = new EventEmitter<Alert>();
  userList: User[];
  today: DatePicker;
  alert: Alert;
  currentMondayDate: DatePicker;
  currentMonthFirstDate: DatePicker;

  constructor(
    private statusService: StatusService,
    private userService: UserService
  ) {
    const today = new Date();
    this.today = new DatePicker(
      today.getMonth() + 1,
      today.getDate(),
      today.getFullYear()
    );
    this.currentMondayDate = new DatePicker(
      today.getMonth() + 1,
      today.getDate() - (today.getDay() - 1),
      today.getFullYear()
    );

    this.currentMonthFirstDate = new DatePicker(
      today.getMonth() + 1,
      1,
      today.getFullYear()
    );
    this.alert = new Alert(null, null);
  }

  ngOnInit(): void {
    this.getAllUser();
  }

  todaysReport() {
    this.statusService
      .getTodaysReport(
        `${this.today.month}/${this.today.date}/${this.today.year}`
      )
      .subscribe((res) => {
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

  myThisWeekReport(userId: string) {
    const startDate: string = `${this.currentMondayDate.month}/${this.currentMondayDate.date}/${this.currentMondayDate.year}`;
    const endDate: string = `${this.today.month}/${this.today.date}/${this.today.year}`;
    this.getStatus(userId, startDate, endDate);
  }

  myThisMonthReport(userId: string) {
    const startDate: string = `${this.currentMonthFirstDate.month}/${this.currentMonthFirstDate.date}/${this.currentMonthFirstDate.year}`;
    const endDate: string = `${this.today.month}/${this.today.date}/${this.today.year}`;
    this.getStatus(userId, startDate, endDate);
  }

  customizedReport() {}

  private setAlertMsg(msg: string, type: string) {
    this.alert.message = msg;
    this.alert.type = type;
  }

  private getStatus(userId: string, startDate: string, endDate: string) {
    this.statusService
      .getDailyStsByUserIdAndDaterange(userId, startDate, endDate)
      .subscribe((res) => {
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
      });
  }
}
