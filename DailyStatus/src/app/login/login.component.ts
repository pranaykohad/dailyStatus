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
export class LoginComponent {
  user: User;
  wrongCred = false;
  errorMsg = 'Wrong Credentials';
  constructor(
    private router: Router,
    private userService: UserService,
    private localStoreService: LocalStorageService,
    private cdrf: ChangeDetectorRef
  ) {
    this.user = new User(null, null, null, null);
    this.localStoreService.resetLocalStorage();
  }

  login() {
    this.userService.authenticateUser(this.user).subscribe((res) => {
      if (!res['data']) {
        this.wrongCred = true;
      } else {
        this.localStoreService.setUser(res['data']);
        this.router.navigateByUrl('/main');
      }
    });
  }
}
