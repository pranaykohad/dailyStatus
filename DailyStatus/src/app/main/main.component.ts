import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/services/local-storage.service';
import { StatusService } from 'src/services/status.service';
import { UserService } from 'src/services/user.service';
import { numOfStatus, stateList } from '../app.constant';
import { Status } from '../model/status';
import { User } from '../model/user';

@Component({
  selector: 'main-root',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  user: User;
  stateList;
  statusList: Status[];

  constructor(
    private statusService: StatusService,
    private userService: UserService,
    private localStoreService: LocalStorageService,
    private router: Router
  ) {
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
        statusList.push(status);
      }
    });
    this.statusService.saveStatus(statusList).subscribe((res) => {
      console.log(res);
    });
  }

  resetStatusList() {
    this.statusList = [];
    for (let row = 1; row <= numOfStatus; row++) {
      this.statusList.push(
        new Status('', '', 'In progress', new Date().toString(), this.user)
      );
    }
  }
}
