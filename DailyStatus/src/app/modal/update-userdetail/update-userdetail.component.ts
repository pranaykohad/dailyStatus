import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { LocalStorageService } from 'src/services/local-storage.service';

@Component({
  selector: 'app-update-userdetail',
  templateUrl: './update-userdetail.component.html',
  styleUrls: ['./update-userdetail.component.scss'],
})
export class UpdateUserdetailComponent implements OnInit {
  @Input() user: User;
  @Input() moduleList = [];

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {}
  updateUserDetails(userName: HTMLInputElement, moduleName: HTMLSelectElement) {
    this.user.userName = userName.value;
    this.localStorageService.setUser(this.user);
    this.localStorageService.setModuleName(
      this.moduleList[moduleName.selectedIndex],
      this.user
    );
  }
}
