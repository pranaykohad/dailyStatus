import { ChangeDetectorRef, EventEmitter, Input, Output } from '@angular/core';
import { moduleList } from 'src/app/app.constant';
import { Alert } from 'src/app/model/alert';
import { User } from 'src/app/model/user';
import { LocalStorageService } from 'src/services/local-storage.service';
import { UserService } from 'src/services/user.service';

export class UserDetailComponent {
  @Input() user: User;
  alert: Alert;
  @Output() alertEmitter = new EventEmitter<Alert>();
  moduleList;

  constructor(
    private localStoreService: LocalStorageService,
    private userService: UserService,
    private crdf: ChangeDetectorRef
  ) {
    this.initModuleList();
    this.alert = new Alert(null, null);
  }

  updateUserDetails(userName: string, password: string, moduleName: string) {
    this.user.userName = userName;
    this.user.password = password;
    this.user.moduleName = moduleName;
    this.userService.updateUserDetails(this.user).subscribe((res) => {
      if (res['data']) {
        this.user.userName = res['data']['userName'];
        this.user.lastName = res['data']['lastName'];
        this.user.moduleName = res['data']['moduleName'];
        this.localStoreService.setUser(this.user);
        this.setAlertMsg('User Details updated successfully.', 'success');
        this.alertEmitter.emit(this.alert);
      } else {
        this.setAlertMsg(res['descrition'], res['status']);
        this.alertEmitter.emit(this.alert);
      }
    });
  }

  private initModuleList() {
    this.moduleList = [];
    moduleList.forEach((module) => {
      this.moduleList.push(module);
    });
  }

  private setAlertMsg(msg: string, type: string) {
    this.alert.message = msg;
    this.alert.type = type;
  }
}
