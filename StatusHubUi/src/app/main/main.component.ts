import { RowComponent } from './../row/row/row.component';
import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { DatePicker } from 'src/app/model/datePicker';
import { LocalStorageService } from 'src/services/local-storage.service';
import { StatusService } from 'src/services/status.service';
import { UserService } from 'src/services/user.service';
import { UtilService } from 'src/services/util.service';
import { stateList } from '../app.constant';
import { Attachment } from '../model/attachment';
import { User } from '../model/user';
import { numOfStatus } from './../app.constant';
import { Alert } from './../model/alert';
import { Status } from './../model/status';

@Component({
  selector: 'main-root',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  alert: Alert;
  user: User;
  stateList;
  statusList: Status[];
  recentDate: DatePicker;
  recentStatus: Status[];
  alertTimeout: any;
  today: DatePicker;
  defaulterList: User[];
  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;
  rowComponent: RowComponent;
  rowComponentArray: RowComponent[];
  componentRef: any;
  index = 0;

  constructor(
    private statusService: StatusService,
    private userService: UserService,
    private localStoreService: LocalStorageService,
    private router: Router,
    private utilService: UtilService,
    private compFactoryresolver: ComponentFactoryResolver
  ) {
    this.alert = new Alert(null, null);
    this.user = this.localStoreService.getUser();
    this.stateList = stateList;
    this.recentStatus = [];
    const today = new Date();
    this.today = new DatePicker(
      today.getMonth() + 1,
      today.getDate(),
      today.getFullYear()
    );
    this.rowComponentArray = [];
  }

  ngOnInit(): void {
    if (!this.userService.getLocalUserName()) {
      this.router.navigateByUrl('/');
    } else {
      this.setRecentDate();
      this.getRecentStatus();
      setTimeout(() => {
        const status = this.getDefaultStatus();
        this.addRow(this.index++, status);

        // this.resetStatusList();
      }, 0);
    }
  }

  ngOnDestroy(): void {
    this.componentRef.destroy();
  }

  addRow(index: number, status: Status) {
    const rowCompFactory = this.compFactoryresolver.resolveComponentFactory(
      RowComponent
    );
    const rowCompRef = this.container.createComponent(rowCompFactory);
    const rowComp = rowCompRef.instance;
    rowComp.index = index;
    rowComp.status = status;
    this.rowComponentArray.push(rowComp);
  }

  addNextRow() {
    const status = this.getDefaultStatus();
    this.addRow(this.index++, status);
  }

  changeState(index: number, row: Status) {
    row.state = this.stateList[index];
  }

  submitStatus() {
    const statusList: Status[] = [];
    let isStsLenCorrect = true;
    isStsLenCorrect = this.buildStatusList(isStsLenCorrect, statusList);
    if (!isStsLenCorrect) {
      return;
    } else if (statusList.length) {
      this.statusService.saveStatus(statusList).subscribe((res) => {
        if (res['description'] === 'Status is saved successfully.') {
          this.resetStatusList();
        }
        this.alertHandler({ message: res['description'], type: res['status'] });
      });
    } else {
      this.alertHandler({
        message: 'You cannot submit status with empty Ticket Id.',
        type: 'fail',
      });
    }
  }

  resetStatusList() {}

  alertHandler(alert: Alert) {
    this.alert = {
      message: alert.message,
      type: alert.type,
    };
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
    this.alertTimeout = setTimeout(() => {
      this.alert = new Alert(null, '');
    }, 5000);
  }

  logout() {
    this.localStoreService.resetLocalStorage();
    this.router.navigateByUrl('/');
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
        }
      });
  }

  todaysReport() {
    this.statusService
      .getTodaysReport(
        `${this.today.month}/${this.today.day}/${this.today.year}`
      )
      .subscribe((res) => {
        const alert = this.downloadReport(res);
        this.alertHandler(alert);
      });
  }

  private setRecentDate() {
    const recentDate = new Date();
    const todaysDay = new Date().getDay();
    if (todaysDay === 1) {
      recentDate.setDate(recentDate.getDate() - 3);
    } else if (todaysDay === 0) {
      recentDate.setDate(recentDate.getDate() - 2);
    } else {
      recentDate.setDate(recentDate.getDate() - 1);
    }
    this.recentDate = new DatePicker(
      recentDate.getMonth() + 1,
      recentDate.getDate(),
      recentDate.getFullYear()
    );
  }

  private getRecentStatus() {
    const yesterday: string = `${this.recentDate.month}/${this.recentDate.day}/${this.recentDate.year}`;
    this.statusService
      .getRecentStatus(yesterday, this.user.userId)
      .subscribe((res) => {
        if (res['data']) {
          this.recentStatus = res['data'];
        }
      });
  }

  private buildStatusList(
    isStsLenCorrect: boolean,
    statusList: Status[]
  ): boolean {
    this.rowComponentArray.forEach((row) => {
      if (row.status.ticketId.trim().length) {
        row.status.description = row.status.description.trim();
        row.status.ticketId = row.status.ticketId.trim();
        if (row.status.description.length > 250) {
          this.alertHandler({
            message: 'Description cannot be more than 250 characters.',
            type: 'fail',
          });
          isStsLenCorrect = false;
        }
        statusList.push(row.status);
      }
    });
    return isStsLenCorrect;
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
        message: 'Status is downloaded successfully.',
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

  private getDefaultStatus() {
    const date = new Date().toLocaleDateString();
    return new Status(
      '',
      '',
      'In progress',
      this.utilService.formatToTwoDigit(date),
      this.user
    );
  }
}
