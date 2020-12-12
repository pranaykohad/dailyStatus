import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/services/local-storage.service';
import { StatusService } from 'src/services/status.service';
import { UserService } from 'src/services/user.service';
import { Status } from '../model/status';
import { User } from '../model/user';

@Component({
  selector: 'main-root',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  user: User;
  statusList: Status[];
  selectedState = 'In progress';
  moduleList = [];
  numOfRow = 6;
  stateList = ['In progress', 'Completed'];

  constructor(
    private statusService: StatusService,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private localStoreService: LocalStorageService,
    private router: Router
  ) {
    this.user = this.localStoreService.getUser();
    this.initModuleList();
    this.initStatusList();
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
      if (status.ticketId.length) {
        statusList.push(status);
      }
    });
    this.statusService.saveStatus(statusList).subscribe((res) => {
      console.log(res);
    });
  }

  resetStatuses() {
    this.selectedState = 'In progress';
    this.statusList.forEach((status) => {
      status.ticketId = '';
      status.description = '';
      status.state = 'In progress';
      status.date = '';
    });
  }

  private initStatusList() {
    this.statusList = [];
    for (let row = 1; row <= this.numOfRow; row++) {
      this.statusList.push(
        new Status('', '', 'In progress', new Date().toString(), this.user)
      );
    }
  }

  private initModuleList() {
    this.moduleList[0] = 'OCR';
    this.moduleList[1] = 'Connector';
    this.moduleList[2] = 'Workbench 9.2';
    this.moduleList[3] = 'Automation';
  }
}
