import { Component } from '@angular/core';
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
import { DatePicker } from 'src/app/model/datePicker';
import { User } from 'src/app/model/user';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-defaulter-list',
  templateUrl: './defaulter-list.component.html',
  styleUrls: ['./defaulter-list.component.scss'],
})
export class DefaulterListComponent {
  today: DatePicker;
  message: string = '';
  defaulterList: User[];
  datesOfWeek: DatePicker[];
  callForWeek = false;
  TOP_DEF_COUNT = TOP_DEF_COUNT;

  constructor(private userService: UserService) {
    const today = new Date();
    this.today = new DatePicker(
      today.getMonth() + 1,
      today.getDate(),
      today.getFullYear()
    );
    this.datesOfWeek = [];
    this.setCurrentWeeksDate();
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

  getDefaultersListOfWeek() {
    this.defaulterList = [];
    const dateList = [];
    this.datesOfWeek.forEach((date) => {
      dateList.push(`${date.month}/${date.day}/${date.year}`);
    });
    this.userService.getDefaultersListOfWeek(dateList).subscribe((res) => {
      if (res['data']) {
        this.defaulterList = res['data'];
        this.callForWeek = true;
      } else {
        this.message = 'No Defaulter for this Week';
      }
    });
  }

  private setCurrentWeeksDate() {
    const today = new Date();
    if (today.getDay() >= MONDAY) {
      this.addDate(MONDAY);
    }
    if (today.getDay() >= TUESDAY) {
      this.addDate(TUESDAY);
    }
    if (today.getDay() >= WEDNESDAY) {
      this.addDate(WEDNESDAY);
    }
    if (today.getDay() >= THRUSDAY) {
      this.addDate(THRUSDAY);
    }
    if (today.getDay() >= FRIDAY) {
      this.addDate(FRIDAY);
    }
  }

  private addDate(day: number) {
    const today = new Date();
    const counterDate = new Date();
    counterDate.setDate(today.getDate() - (today.getDay() - day));
    const currentTuesdayDate: DatePicker = new DatePicker(
      counterDate.getMonth() + 1,
      counterDate.getDate(),
      counterDate.getFullYear()
    );
    this.datesOfWeek.push(currentTuesdayDate);
  }
}
