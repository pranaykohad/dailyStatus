import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/services/local-storage.service';
import { Setting } from '../model/Setting';

import { UserService } from './../../services/user.service';
import { User } from './../model/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  user: User;
  wrongCred = false;
  errorMsg = 'Wrong Credentials';

  constructor(
    private router: Router,
    private userService: UserService,
    private localStoreService: LocalStorageService
  ) {
    this.user = new User();
    this.localStoreService.resetLocalStorage();
    this.setSettings();
  }

  login() {
    this.userService.authenticateUser(this.user).subscribe((res) => {
      if (!res['data']) {
        this.wrongCred = true;
        setTimeout(() => {
          this.wrongCred = false;
        }, 5000);
      } else {
        this.localStoreService.setUser(res['data']);
        this.router.navigateByUrl('/main');
      }
    });
  }

  private setSettings() {
    this.userService.getSettings().subscribe((res) => {
      this.localStoreService.setSettings(res['data']);
    });
  }
}
