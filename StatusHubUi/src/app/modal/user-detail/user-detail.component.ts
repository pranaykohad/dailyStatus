import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { moduleList } from 'src/app/app.constant';
import { Alert } from 'src/app/model/alert';
import { User } from 'src/app/model/user';
import { LocalStorageService } from 'src/services/local-storage.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-update-userdetail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent {
  @Input() user: User;
  @Output() alertEmitter = new EventEmitter<Alert>();
  moduleList;

  constructor(
    private localStoreService: LocalStorageService,
    private userService: UserService,
    private crdf: ChangeDetectorRef
  ) {
    this.initModuleList();
  }

  updateUserDetails(userName: string, password: string, moduleName: string) {
    this.user.userName = userName;
    this.user.password = password;
    this.user.moduleName = moduleName;
    let alert = null;
    this.userService.updateUserDetails(this.user).subscribe((res) => {
      if (res['data']) {
        this.user.userName = res['data']['userName'];
        this.user.lastName = res['data']['lastName'];
        this.user.moduleName = res['data']['moduleName'];
        this.localStoreService.setUser(this.user);
        alert = {
          message: 'User Details updated successfully',
          type: 'success',
        };
      } else {
        alert = {
          message: res['descrition'],
          type: res['status'],
        };
      }
      this.alertEmitter.emit(alert);
    });
  }

  private initModuleList() {
    this.moduleList = [];
    moduleList.forEach((module) => {
      this.moduleList.push(module);
    });
  }
}
