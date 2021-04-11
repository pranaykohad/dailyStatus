import { Component, Input, OnInit } from '@angular/core';
import { moduleList, POSITION_LIST, userTypeList } from 'src/app/app.constant';
import { IUser } from 'src/app/model/user';

@Component({
  selector: 'app-user-console',
  templateUrl: './user-console.component.html',
  styleUrls: ['./user-console.component.scss'],
})
export class UserConsoleComponent implements OnInit {
  userTypeList = userTypeList;
  POSITION_LIST = POSITION_LIST;
  moduleList = moduleList;
  @Input() loggedInUser: IUser;
  users: IUser[];
  private _userList: IUser[];

  constructor() {}

  ngOnInit(): void {
    this.moduleList.push('Not Applicable');
  }

  @Input()
  set userList(userList: IUser[]) {
    this._userList = userList;
    // this.setInitialSelectedUser();
  }

  get userList() {
    return this._userList;
  }

  userChange(user: string) {}
}
