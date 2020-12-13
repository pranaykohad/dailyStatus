import { Component, Input } from '@angular/core';
import { moduleList } from 'src/app/app.constant';
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
  moduleList;

  constructor(
    private localStoreService: LocalStorageService,
    private userService: UserService
  ) {
    this.initModuleList();
  }

  updateUserDetails(
    userName: HTMLInputElement,
    password: HTMLInputElement,
    moduleName: HTMLSelectElement
  ) {
    this.user.userName = userName.value;
    this.user.password = password.value;
    this.user.moduleName = this.moduleList[moduleName.selectedIndex];
    this.userService.updateUserDetails(this.user).subscribe((res) => {
      if (res['data']) {
        this.user = res['data'];
        this.localStoreService.setUser(this.user);
      } else {
        //failrue
        //console.log(res['descrition']);
        //console.log(res['status']);
      }
    });
  }

  private initModuleList() {
    this.moduleList = [];
    moduleList.forEach((module) => {
      this.moduleList.push(module);
    });
  }
}
