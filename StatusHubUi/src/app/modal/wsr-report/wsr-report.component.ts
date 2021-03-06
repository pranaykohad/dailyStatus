import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SATURDAY, SUNDAY } from 'src/app/app.constant';
import { Alert } from 'src/app/model/alert';
import { DatePicker } from 'src/app/model/datePicker';
import { WsrService } from 'src/services/wsr.service';

@Component({
  selector: 'app-wsr-report',
  templateUrl: './wsr-report.component.html',
  styleUrls: ['./wsr-report.component.scss'],
})
export class WsrReportComponent implements OnInit {
  file: File;
  sheetNames = [];
  selectedSheetName;
  alert: Alert;
  customStartDate: DatePicker;
  customEndDate: DatePicker;
  enableWSRButton = false;
  constructor(private wsrService: WsrService, private cdrf: ChangeDetectorRef) {
    this.initDates();
  }

  ngOnInit(): void {
    this.alert = new Alert(null, null);
  }

  getSheetNames(event: any) {
    this.enableWSRButton = false;
    this.file = event.target.files[0];
    if (this.file) {
      this.wsrService.getSheetNames(this.file).subscribe((res) => {
        if (res['status'] === 'SUCCESS') {
          this.sheetNames = res['data'];
          this.selectedSheetName = this.sheetNames[0];
          this.cdrf.markForCheck();
        } else {
          this.alert = {
            message: res['description'],
            type: 'fail',
          };
        }
      });
    }
  }

  uploadLeaveReport() {
    if (this.isStartDateGreater() || this.isSatOrSun()) {
      this.alert = {
        message: 'Invalid Date',
        type: 'fail',
      };
      return;
    }
    if (this.file && this.selectedSheetName) {
      this.wsrService
        .uploadLeaveReport(
          this.file,
          this.selectedSheetName,
          this.customStartDate.day,
          this.customEndDate.day
        )
        .subscribe((res) => {
          if (res['status'] === 'SUCCESS') {
            this.alert = {
              message: res['description'],
              type: 'success',
            };
            this.enableWSRButton = true;
            this.cdrf.markForCheck();
          } else {
            this.alert = {
              message: res['description'],
              type: 'fail',
            };
          }
        });
    }
  }

  createWSRReport() {}

  private isStartDateGreater() {
    const endDate1 = new Date(
      this.customEndDate.month,
      this.customEndDate.day,
      this.customEndDate.year
    );
    const startDate1 = new Date(
      this.customStartDate.month,
      this.customStartDate.day,
      this.customStartDate.year
    );
    return endDate1.getTime() - startDate1.getTime() < 0;
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

  private isSatOrSun(): boolean {
    const today = new Date();
    return today.getDay() === SATURDAY || today.getDay() === SUNDAY;
  }
}
