import { Component, Input, OnInit } from '@angular/core';
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
          //success
          //console.log(res['data]);
        } else {
          //failrue
          //console.log(res['descrition']);
          //console.log(res['status']);
        }
      });
  }

  getAllUser() {
    this.userService.gteAllUser().subscribe((res) => {
      if (res['status'] === 'FAILURE') {
        //fail
      } else {
        this.userList = res['data'];
      }
    });
  }

  myThisWeekReport() {
    this.statusService
      .getDailyStsByUserIdAndDaterange(
        this.user.userId,
        this.currentMondayDate.month +
          '/' +
          this.currentMondayDate.day +
          '/' +
          this.currentMondayDate.year,
        this.today.month + '/' + this.today.day + '/' + this.today.year
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
          //success
        } else {
          //failrue
        }
      });
  }

  myThisMonthReport() {}

  customizedReport() {}

  showResetMsg(msg: string, type: string) {
    this.alert.message = msg;
    this.alert.type = type;
  }
}
