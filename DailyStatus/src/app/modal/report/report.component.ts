import { Component, Input, OnInit } from '@angular/core';
import { DatePicker } from 'src/app/model/datePicker';
import { User } from 'src/app/model/user';
import { StatusService } from 'src/services/status.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {
  @Input() user: User;
  startDate: DatePicker;
  endDate: DatePicker;
  blob: Blob;

  constructor(private statusService: StatusService) {
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
  }

  ngOnInit(): void {}

  generateReport() {
    this.statusService
      .getStatus(
        this.user.userId,
        `${this.startDate.month}/${this.startDate.day}/${this.startDate.year}`,
        `${this.endDate.month}/${this.endDate.day}/${this.endDate.year}`
      )
      .subscribe((res) => {
        if (res['data']) {
          //success
          //console.log(res['data]);
        } else {
          //failrue
          //console.log(res['descrition']);
          //console.log(res['status']);
        }
      });
  }
}
