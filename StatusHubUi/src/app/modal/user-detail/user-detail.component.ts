import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { moduleList, roleList } from 'src/app/app.constant';
import { Alert } from 'src/app/model/alert';

import { User } from 'src/app/model/user';
import { LocalStorageService } from 'src/services/local-storage.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-update-userdetail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  user: User;
  loggedUser: User;
  moduleList;
  roleList;
  private _userList: User[];
  @Output() alertEmitter = new EventEmitter<Alert>();

  constructor(
    private localStoreService: LocalStorageService,
    private userService: UserService,
    private crdf: ChangeDetectorRef
  ) {}

  @Input()
  set userList(userList: User[]) {
    this._userList = userList;
    this.loggedUser = this.user = this.localStoreService.getUser();
    this.initModuleList();
    this.initRoleList();
    this.crdf.markForCheck();
  }

  get userList() {
    return this._userList;
  }

  ngOnInit(): void {}

  changeUser(user: User) {
    this.user = user;
    this.crdf.markForCheck();
  }

  updateUserDetails(
    userName: string,
    password: string,
    moduleName: string,
    roleDropDown: HTMLSelectElement
  ) {
    alert(this.roleList[roleDropDown.selectedIndex]);
    // this.user.userName = userName;
    // this.user.password = password;
    // this.user.moduleName = moduleName;
    // let alert = null;
    // this.userService.updateUserDetails(this.user).subscribe((res) => {
    //   if (res['data']) {
    //     this.user.userName = res['data']['userName'];
    //     this.user.lastName = res['data']['lastName'];
    //     this.user.moduleName = res['data']['moduleName'];
    //     this.localStoreService.setUser(this.user);
    //     alert = {
    //       message: 'User Details updated successfully',
    //       type: 'success',
    //     };
    //   } else {
    //     alert = {
    //       message: res['descrition'],
    //       type: res['status'],
    //     };
    //   }
    //   this.alertEmitter.emit(alert);
    // });
  }

  private initModuleList() {
    this.moduleList = [];
    moduleList.forEach((module) => {
      this.moduleList.push(module);
    });
  }

  private initRoleList() {
    this.roleList = [];
    roleList.forEach((role) => {
      this.roleList.push(role);
    });
  }
}
