import { Component, Input } from '@angular/core';
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
  @Input() moduleList = [];

  constructor(
    private localStoreService: LocalStorageService,
    private userService: UserService
  ) {}

  updateUserDetails(
    userName: HTMLInputElement,
    password: HTMLInputElement,
    moduleName: HTMLSelectElement
  ) {
    this.user.userName = userName.value;
    this.user.password = password.value;
    this.user.moduleName = this.moduleList[moduleName.selectedIndex];
    this.localStoreService.setUser(this.user);
    this.userService.updateUserDetails(this.user).subscribe((res) => {
      if (res['data']) {
        this.user = res['data'];
      }
    });
  }
}
