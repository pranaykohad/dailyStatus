import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import {
  moduleList,
  NOT_APPLICABLE,
  POSITION_LIST,
  roleList,
  userTypeList,
} from 'src/app/app.constant';
import { Alert } from 'src/app/model/alert';
import { IUser, User } from 'src/app/model/user';
import { LocalStorageService } from 'src/services/local-storage.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-user-console',
  templateUrl: './user-console.component.html',
  styleUrls: ['./user-console.component.scss'],
})
export class UserConsoleComponent implements OnInit {
  userTypeList = userTypeList;
  positionList = POSITION_LIST;
  moduleList = moduleList;
  roleList = roleList;
  newUserFlag = false;
  loggedInUser: IUser;
  user: IUser;
  userList: IUser[];
  @Output() alertEmitter = new EventEmitter<Alert>();
  @Output() loggedInUserUpdateEmitter = new EventEmitter();

  constructor(
    private userService: UserService,
    private localStoreService: LocalStorageService,
    private cdrf: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userTypeList.push(NOT_APPLICABLE);
    this.moduleList.push(NOT_APPLICABLE);
    this.loggedInUser = this.localStoreService.getUser();
  }

  getLoggedUserDetail() {
    this.userService.getUsersById(this.loggedInUser.userId).subscribe((res) => {
      if (res['data']) {
        this.loggedInUser = res['data'];
        this.user = this.loggedInUser;
        this.cdrf.detectChanges();
      }
    });
  }

  getUserList() {
    this.userList = [];
    this.userService.findAllUsersButAmin().subscribe((res) => {
      if (res['status'] === 'FAILURE') {
        const alert: Alert = {
          message: res['description'],
          type: res['status'],
        };
        this.alertEmitter.emit(alert);
      } else {
        this.userList = res['data'];
      }
    });
  }

  createNewUser() {
    this.user = this.buildNewUser();
    this.newUserFlag = true;
  }

  buildNewUser(): IUser {
    const user: IUser = new User();
    user.firstName = 'New';
    user.lastName = 'User';
    user.userName = 'NewUser';
    user.password = 'NewUser';
    user.email = 'newuser@blueconchtech.com';
    user.baseHours = 8.5;
    user.type = 'DEV';
    user.position = 'Developer';
    user.moduleName = 'Workbench 9.2';
    user.role = 'NORMAL';
    user.billable = false;
    return user;
  }

  isNumberKey(evt: any): boolean {
    const charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode === 46) {
      return true;
    } else if (charCode < 48 || charCode > 57) {
      return false;
    }
    return true;
  }

  userChange(userId: any) {
    this.userService.getUsersById(userId).subscribe((res) => {
      if (res['data']) {
        this.user = res['data'];
        this.newUserFlag = false;
      }
    });
  }

  typeChange(type: string) {
    this.user.type = type;
  }

  positionChange(position: string) {
    this.user.position = position;
  }

  moduleChange(moduleName: string) {
    this.user.moduleName = moduleName;
  }
  roleChange(role: string) {
    this.user.role = role;
  }

  submitUser() {
    if (
      this.validate(
        this.user.firstName,
        this.user.lastName,
        this.user.userName,
        this.user.password,
        this.user.email,
        this.user.baseHours
      )
    ) {
      const alert = { message: 'All fields are compulsory.', type: 'fail' };
      this.alertEmitter.emit(alert);
      return;
    }
    this.user.firstName = this.user.firstName.trim();
    this.user.lastName = this.user.lastName.trim();
    if (this.newUserFlag) {
      this.addNewUser();
    } else {
      this.updateUser();
    }
  }

  private updateUser() {
    this.userService.updateUserDetails(this.user).subscribe((res) => {
      let alert: Alert = new Alert(res['descrition'], res['status']);
      if (res['data']) {
        this.user = res['data'];
        if (this.loggedInUser.userId == this.user.userId) {
          this.localStoreService.setUser(this.user);
          this.loggedInUser = this.user;
          this.loggedInUserUpdateEmitter.emit();
        }
        alert = {
          message: 'User Details updated successfully',
          type: 'success',
        };
        this.getUserList();
      }
      this.alertEmitter.emit(alert);
    });
  }

  private addNewUser() {
    this.userService.addUser(this.user).subscribe((res) => {
      let alert: Alert = new Alert(res['descrition'], res['status']);
      if (res['data']) {
        alert = {
          message: 'User is added successfully',
          type: res['status'],
        };
        this.getUserList();
      }
      this.alertEmitter.emit(alert);
    });
  }

  private validate(
    firstName: string,
    lastName: string,
    userName: string,
    password: string,
    email: string,
    baseHours: number
  ) {
    return (
      !firstName.trim().length ||
      !lastName.trim().length ||
      !userName.trim().length ||
      !email.trim().length ||
      !password.trim().length ||
      !baseHours.toString().trim().length
    );
  }
}
