import { Component, OnInit } from '@angular/core';
import { Alert } from 'src/app/model/alert';
import { DatePicker } from 'src/app/model/datePicker';

@Component({
  selector: 'app-res-utility',
  templateUrl: './resource-utility.component.html',
  styleUrls: ['./resource-utility.component.scss'],
})
export class ResourceUilityComponent implements OnInit {
  alert: Alert;
  customStartDate: DatePicker;
  customEndDate: DatePicker;
  enableWSRButton = false;
  constructor() {
    this.initDates();
  }

  ngOnInit(): void {
    this.alert = new Alert(null, null);
  }

  private initDates() {
    const today = new Date();
    this.customStartDate = new DatePicker(
      today.getMonth() + 1,
      today.getDate(),
      today.getFullYear()
    );
    this.customEndDate = this.customStartDate;
  }
}
