import { Component, EventEmitter, Output } from '@angular/core';
import {
  FRIDAY,
  MONDAY,
  SATURDAY,
  SUNDAY,
  THRUSDAY,
  TOP_DEF_COUNT,
  TUESDAY,
  WEDNESDAY,
} from 'src/app/app.constant';
import { Alert } from 'src/app/model/alert';
import { DatePicker } from 'src/app/model/datePicker';
import { User } from 'src/app/model/user';
import { UserService } from 'src/services/user.service';
import { UtilService } from 'src/services/util.service';

@Component({
  selector: 'app-defaulter-list',
  templateUrl: './defaulter-list.component.html',
  styleUrls: ['./defaulter-list.component.scss'],
})
export class DefaulterListComponent {
  today: DatePicker;
  customStartDate: DatePicker;
  customEndDate: DatePicker;
  message: string = '';
  defaulterList: User[];
  callForWeek = false;
  TOP_DEF_COUNT = TOP_DEF_COUNT;
  dateList = [];
  alert: Alert;
  @Output() alertEmitter = new EventEmitter<Alert>();

  constructor(
    private userService: UserService,
    private utilService: UtilService
  ) {
    this.alert = new Alert(null, null);
    this.initDates();
  }

  private initDates() {
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
    this.userService
      .defaultersList(
        `${this.today.month}/${this.today.day}/${this.today.year}`
      )
      .subscribe((res) => {
        if (res['data']) {
          this.defaulterList = res['data'];
          this.callForWeek = false;
        } else {
          this.message = 'No Defaulter for Today';
        }
      });
  }

  getCustomDefaultersList() {
    this.defaulterList = [];
    const start = new Date(
      `${this.customStartDate.month}/${this.customStartDate.day}/${this.customStartDate.year}`
    );
    const end = new Date(
      `${this.customEndDate.month}/${this.customEndDate.day}/${this.customEndDate.year}`
    );
    const dateList = this.utilService.buildCustomDates(start, end);
    if (!dateList) {
      this.alert = {
        message: 'Start Date cannot be greater than End Date',
        type: 'fail',
      };
      return;
    }
    this.userService.getDefaultersListOfWeek(dateList).subscribe((res) => {
      if (res['data']) {
        this.defaulterList = res['data'];
        this.callForWeek = true;
      } else {
        this.message = 'No Defaulter for this Week';
      }
    });
  }
}
