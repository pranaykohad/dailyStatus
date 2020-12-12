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
    private router: Router
  ) {
    this.user = new User('', '', '');
    const moduleList: string[] = [
      'OCR',
      'Connector',
      'Workbench 9.2',
      'Automation',
    ];
    moduleList.forEach((element) => {
      this.moduleList.push(element);
    });
    this.statusList = [];
    for (let row = 1; row <= this.numOfRow; row++) {
      this.statusList.push(
        new Status('', '', 'In progress', new Date().toString())
      );
    }
  }

  ngOnInit(): void {
    if (
      !this.userService.getLocalUserName() ||
      !this.userService.getLocalModuleName()
    ) {
      this.router.navigateByUrl('/');
    } else {
      this.userService.setInitialUserName(this.user);
      this.userService.setInitialMouduleName(this.user);
    }
  }

  changeState(index: number, row: Status) {
    row.state = this.stateList[index];
  }

  submitStatus() {
    // this.statusService.saveStatus(this.statusList).subscribe((res) => {
    //   console.log(res);
    // });
    // this.userService.getUserDetails(1).subscribe((res) => {
    //   console.log(res);
    // });
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
}
