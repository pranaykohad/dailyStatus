import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  constructor(private wsrService: WsrService, private cdrf: ChangeDetectorRef) {
    this.initDates();
  }

  ngOnInit(): void {
    this.alert = new Alert(null, null);
  }

  getFile(event: any) {
    this.file = event.target.files[0];
    if (this.file) {
      this.wsrService.uploadLeaveReport(this.file).subscribe((res) => {});
    }
  }

  getSheetNames(event: any) {
    this.file = event.target.files[0];
    if (this.file) {
      this.wsrService.getSheetNames(this.file).subscribe((res) => {
        if (res['status'] === 'SUCCESS') {
          this.sheetNames = res['data'];
          this.selectedSheetName = this.sheetNames[0];
          console.log(this.sheetNames, this.selectedSheetName);
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

  createWSRReport() {
    if (this.file && this.selectedSheetName) {
      this.wsrService
        .createWSRReport(this.file, this.selectedSheetName)
        .subscribe((res) => {
          if (res['status'] === 'SUCCESS') {
            // this.sheetNames = res['data'];
            // this.selectedSheetName = this.sheetNames[0];
            // console.log(this.sheetNames, this.selectedSheetName);
            // this.cdrf.markForCheck();
          } else {
            this.alert = {
              message: res['description'],
              type: 'fail',
            };
          }
        });
    }
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
