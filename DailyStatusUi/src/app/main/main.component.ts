import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatePicker } from 'src/app/model/datePicker';
import { LocalStorageService } from 'src/services/local-storage.service';
import { ModalService } from 'src/services/modal.service';
import { StatusService } from 'src/services/status.service';
import { UserService } from 'src/services/user.service';
import { numOfStatus, stateList } from '../app.constant';
import { AddUserComponent } from '../modal/add-user/add-user.component';
import { DefaulterListComponent } from '../modal/defaulter-list/defaulter-list.component';
import { User } from '../model/user';
import { Alert } from './../model/alert';
import { Status } from './../model/status';

@Component({
  selector: 'main-root',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  alert: Alert;
  user: User;
  stateList;
  statusList: Status[];
  recentDate: DatePicker;
  recentStatus: Status[];
  alertTimeout: any;

  constructor(
    private statusService: StatusService,
    private userService: UserService,
    private localStoreService: LocalStorageService,
    private router: Router,
    private modalService: ModalService
  ) {
    this.alert = new Alert(null, null);
    this.user = this.localStoreService.getUser();
    this.stateList = stateList;
    this.recentStatus = [];
    this.resetStatusList();
  }

  ngOnInit(): void {
    if (!this.userService.getLocalUserName()) {
      this.router.navigateByUrl('/');
    } else {
      this.setRecentDate();
      this.getRecentStatus();
    }
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

  resetStatusList() {
    this.statusList = [];
    const date = new Date().toLocaleDateString();
    for (let row = 1; row <= numOfStatus; row++) {
      this.statusList.push(
        new Status(
          '',
          '',
          'In progress',
          this.statusService.formatToTwoDigit(date),
          this.user
        )
      );
    }
  }

  alertHandler(alert: Alert) {
    this.showResetMsg(alert.message, alert.type);
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
    this.alertTimeout = setTimeout(() => {
      this.alert = new Alert(null, '');
    }, 5000);
  }

  showResetMsg(msg: string, type: string) {
    this.alert.message = msg;
    this.alert.type = type;
  }

  logout() {
    this.localStoreService.resetLocalStorage();
    this.router.navigateByUrl('/');
  }

  openDefaultersModal() {
    this.modalService.openDefaulterListModal();
  }

  openAddUserModal() {
    const comp = this.modalService.openAdduserModal();
    comp.alertEmitter.subscribe((alert) => {
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
    this.statusList.forEach((status) => {
      if (status.ticketId.trim().length) {
        status.description = status.description.trim();
        status.ticketId = status.ticketId.trim();
        if (status.description.length > 250) {
          this.alertHandler({
            message: 'Description cannot be more than 250 characters.',
            type: 'fail',
          });
          isStsLenCorrect = false;
        }
        statusList.push(status);
      }
    });
    return isStsLenCorrect;
  }
}
