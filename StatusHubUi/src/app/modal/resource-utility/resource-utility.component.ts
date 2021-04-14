import { Component, EventEmitter, Output } from '@angular/core';
import {
  NgbCalendar,
  NgbDate,
  NgbInputDatepickerConfig,
} from '@ng-bootstrap/ng-bootstrap';
import { Alert } from 'src/app/model/alert';
import { Attachment } from 'src/app/model/attachment';
import { DatePicker } from 'src/app/model/datePicker';
import { DateUtilService } from 'src/services/date-util.service';
import { LeaveService } from 'src/services/leave.service';
import { UtilService } from 'src/services/util.service';

@Component({
  selector: 'app-res-utility',
  templateUrl: './resource-utility.component.html',
  styleUrls: ['./resource-utility.component.scss'],
})
export class ResourceUilityComponent {
  alert: Alert;
  customStartDate: DatePicker;
  customEndDate: DatePicker;
  enableWSRButton = false;
  isDisabled = false;
  @Output() alertEmitter = new EventEmitter<Alert>();

  constructor(
    private leaveService: LeaveService,
    private utilService: UtilService,
    private dateUtilService: DateUtilService
  ) {
    this.alert = new Alert(null, null);
    this.initDates();
  }

  getResUtilreport() {
    const startStrDate: string = `${this.customStartDate.year}-${this.customStartDate.month}-${this.customStartDate.day}`;
    const endStrDate: string = `${this.customEndDate.year}-${this.customEndDate.month}-${this.customEndDate.day}`;
    const start = new Date(
      `${this.customStartDate.year}-${this.customStartDate.month}-${this.customStartDate.day}`
    );
    const end = new Date(
      `${this.customEndDate.year}-${this.customEndDate.month}-${this.customEndDate.day}`
    );
    const dateCount: number = this.dateUtilService.buildDateCount(start, end);
    if (!dateCount) {
      this.alert = {
        message: 'Start Date cannot be greater than End Date',
        type: 'fail',
      };
      return;
    }
    this.leaveService
      .getResUtilreport(startStrDate, endStrDate, dateCount)
      .subscribe((res) => {
        const alert = this.downloadReport(res);
        this.alertEmitter.emit(alert);
        this.initDates();
      });
  }

  getLeaveReport() {
    const startStrDate: string = `${this.customStartDate.year}-${this.customStartDate.month}-${this.customStartDate.day}`;
    const endStrDate: string = `${this.customEndDate.year}-${this.customEndDate.month}-${this.customEndDate.day}`;
    this.leaveService
      .getLeaveReport(startStrDate, endStrDate)
      .subscribe((res) => {
        const alert = this.downloadReport(res);
        this.alertEmitter.emit(alert);
        this.initDates();
      });
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
      this.utilService.downloadFile(attachment);
      alert = {
        message: 'Report downloaded successfully',
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
