import { Component, EventEmitter, Output } from '@angular/core';
import { Alert } from 'src/app/model/alert';
import { DatePicker } from 'src/app/model/datePicker';
import { User } from 'src/app/model/user';
import { DateUtilService } from 'src/services/date-util.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-defaulter-list',
  templateUrl: './defaulter-list.component.html',
  styleUrls: ['./defaulter-list.component.scss'],
})
export class DefaulterListComponent {
  today: DatePicker;
  customStartDate: DatePicker;
  customEndDate: DatePicker;
  message = '';
  defaulterList: User[];
  callForWeek = false;
  dateList = [];
  alert: Alert;
  @Output() alertEmitter = new EventEmitter<Alert>();

  constructor(
    private userService: UserService,
    private dateUtilService: DateUtilService
  ) {
    this.alert = new Alert(null, null);
    this.defaulterList = [];
    this.initDates();
  }

  initDates() {
    const today = new Date();
    this.today = new DatePicker(
      today.getMonth() + 1,
      today.getDate(),
      today.getFullYear()
    );
    this.customStartDate = new DatePicker(
      today.getMonth() + 1,
      today.getDate(),
      today.getFullYear()
    );
    this.customEndDate = this.customStartDate;
  }

  getDefaulterList() {
    this.defaulterList = [];
    this.message = 'Waiting for results...';
    this.userService
      .defaultersList(
        `${this.today.month}/${this.today.day}/${this.today.year}`
      )
      .subscribe((res) => {
        if (res['data']) {
          this.defaulterList = res['data'];
          this.callForWeek = false;
        } else {
          this.message = 'No Defaulter for today';
        }
      });
  }

  getCustomDefaultersList() {
    this.defaulterList = [];
    this.message = 'Waiting for results...';
    const dateList: string[] = this.buildDateList();
    if (!dateList) {
      this.alert = {
        message: 'Start Date cannot be greater than End Date',
        type: 'fail',
      };
      return;
    }
    this.userService.getCustomDefaulters(dateList).subscribe((res) => {
      if (res['data'].length) {
        this.defaulterList = res['data'];
        this.callForWeek = true;
      } else {
        this.message = 'No Defaulter for selected dates';
      }
    });
  }

  private buildDateList(): string[] {
    const start = new Date(
      `${this.customStartDate.month}/${this.customStartDate.day}/${this.customStartDate.year}`
    );
    const end = new Date(
      `${this.customEndDate.month}/${this.customEndDate.day}/${this.customEndDate.year}`
    );
    const dateList: string[] = this.dateUtilService.buildCustomDates(
      start,
      end
    );
    return dateList;
  }
}
