import { Component, Input, OnInit } from '@angular/core';
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
  startDate: DatePicker;
  endDate: DatePicker;
  today: DatePicker;
  blob: Blob;

  constructor(
    private statusService: StatusService,
    private userService: UserService
  ) {
    this.blob = new Blob(['hello, I an pranay kohad!!!!!!!!!!!!!!'], {
      type: 'text/plain',
    });
    const today = new Date();
    this.startDate = new DatePicker(
      today.getMonth() + 1,
      today.getDate(),
      today.getFullYear()
    );
    this.endDate = new DatePicker(
      today.getMonth() + 1,
      today.getDate(),
      today.getFullYear()
    );
    this.today = new DatePicker(
      today.getMonth() + 1,
      today.getDate(),
      today.getFullYear()
    );
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

  myThisWeekReport() {}

  myThisMonthReport() {}

  customizedReport() {}
}
