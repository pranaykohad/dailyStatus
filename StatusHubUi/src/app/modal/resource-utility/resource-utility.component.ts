import { Component, EventEmitter, Output } from '@angular/core';
import { LEAVE_TYPE_LIST } from 'src/app/app.constant';
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
  LEAVE_TYPE_LIST = LEAVE_TYPE_LIST;
  selectedType = 'All';
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
      const alert: Alert = {
        message: 'Start Date cannot be greater than End Date',
        type: 'fail',
      };
      this.alertEmitter.emit(alert);
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

  tyChange(type: string) {
    this.selectedType = type;
  }

  getLeaveReport() {
    let selectedType = 'All';
    if (this.selectedType === 'Planned') {
      selectedType = 'P';
    } else if (this.selectedType === 'Un-Planned') {
      selectedType = 'UP';
    }
    const startStrDate: string = `${this.customStartDate.year}-${this.customStartDate.month}-${this.customStartDate.day}`;
    const endStrDate: string = `${this.customEndDate.year}-${this.customEndDate.month}-${this.customEndDate.day}`;
    if (
      this.dateUtilService.isStartDateGreater(
        this.customStartDate,
        this.customEndDate
      )
    ) {
      const alert: Alert = {
        message: 'Start Date cannot be greater than End Date',
        type: 'fail',
      };
      this.alertEmitter.emit(alert);
      return;
    }
    this.leaveService
      .getLeaveReport(startStrDate, endStrDate, selectedType)
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
