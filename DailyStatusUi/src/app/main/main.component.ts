import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/services/local-storage.service';
import { StatusService } from 'src/services/status.service';
import { UserService } from 'src/services/user.service';

import { stateList } from '../app.constant';
import { User } from '../model/user';
import { numOfStatus } from './../app.constant';
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

  constructor(
    private statusService: StatusService,
    private userService: UserService,
    private localStoreService: LocalStorageService,
    private router: Router
  ) {
    this.alert = new Alert(null, null);
    this.user = this.localStoreService.getUser();
    this.stateList = stateList;
    this.resetStatusList();
  }

  ngOnInit(): void {
    if (!this.userService.getLocalUserName()) {
      this.router.navigateByUrl('/');
    }
  }

  changeState(index: number, row: Status) {
    row.state = this.stateList[index];
  }

  submitStatus() {
    const statusList: Status[] = [];
    this.statusList.forEach((status) => {
      if (status.ticketId.trim().length) {
        status.description = status.description.trim();
        status.ticketId = status.ticketId.trim();
        statusList.push(status);
      }
    });
    if (statusList.length) {
      this.statusService.saveStatus(statusList).subscribe((res) => {
        if (res['description'] === 'Status is saved successfully.') {
          this.resetStatusList();
        }
        this.alert.message = res['description'];
        this.alert.type = res['status'];
        this.alertHandler(this.alert);
      });
    } else {
      this.alert.message = 'You cannot submit status with empty Ticket Id.';
      this.alert.type = 'fail';
      this.alertHandler(this.alert);
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
    // setTimeout(() => {
    //   this.alert = new Alert(null, '');
    // }, 5000);
  }

  showResetMsg(msg: string, type: string) {
    this.alert.message = msg;
    this.alert.type = type;
  }

  logout() {
    this.localStoreService.resetLocalStorage();
    this.router.navigateByUrl('/');
  }
}
