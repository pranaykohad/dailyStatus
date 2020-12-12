import { UserService } from './../../services/user.service';
import { User } from './../model/user';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/services/local-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  user: User;
  wrongCred = false;
  errorMsg = 'Wrong Credentials';
  constructor(
    private router: Router,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private cdrf: ChangeDetectorRef
  ) {
    this.user = new User(null, null, null);
    this.localStorageService.resetLocalStorage();
  }

  ngOnInit(): void {
    this.user.userName = this.userService.getLocalUserName();
    this.user.moduleName = this.userService.getLocalModuleName();
    this.user.password = '';
    this.userService.setInitialUserName(this.user);
    this.userService.setInitialMouduleName(this.user);
  }

  login() {
    this.userService.authenticateUser(this.user).subscribe((res) => {
      if (!res['data']) {
        this.wrongCred = true;
      } else {
        this.userService.setInitialUserName(res['data']);
        this.userService.setInitialMouduleName(res['data']);
        this.router.navigateByUrl('/main');
      }
    });
  }
}
