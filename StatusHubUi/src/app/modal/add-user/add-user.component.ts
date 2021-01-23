import { Component, EventEmitter, Output } from '@angular/core';
import { moduleList, roleList, userTypeList } from 'src/app/app.constant';
import { Alert } from 'src/app/model/alert';
import { User } from 'src/app/model/user';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
})
export class AddUserComponent {
  user: User;
  moduleList = moduleList;
  userTypeList = userTypeList;
  roleList = roleList;
  @Output() alertEmitter = new EventEmitter<Alert>();

  constructor(private userService: UserService) {}

  addUser(
    firstName: string,
    lastName: string,
    userName: string,
    password: string,
    moduleSelIndex: number,
    userSelIndex: number,
    roleSelIndex: number
  ) {
    this.user = new User();
    if (this.validate(firstName, lastName, userName, password)) {
      const alert = { message: 'All fields are compulsory.', type: 'fail' };
      this.alertEmitter.emit(alert);
    } else {
      this.user.firstName = firstName;
      this.user.lastName = lastName;
      this.user.userName = userName;
      this.user.password = password;
      this.user.moduleName = this.moduleList[moduleSelIndex];
      this.user.type = this.userTypeList[userSelIndex];
      this.user.role = this.roleList[roleSelIndex];
      let alert = null;
      this.userService.addUser(this.user).subscribe((res) => {
        if (res['data']) {
          alert = {
            message: 'User is added successfully',
            type: res['status'],
          };
          this.resetAllFields();
        } else {
          alert = { message: res['descrition'], type: res['status'] };
        }
        this.alertEmitter.emit(alert);
      });
    }
  }

  private validate(
    firstName: string,
    lastName: string,
    userName: string,
    password: string
  ) {
    return (
      !firstName.trim().length ||
      !lastName.trim().length ||
      !userName.trim().length ||
      !password.trim().length
    );
  }

  private resetAllFields() {
    const firstName: HTMLInputElement = document.querySelector('#newFirstName');
    const lastName: HTMLInputElement = document.querySelector('#newLastName');
    const userName: HTMLInputElement = document.querySelector('#newUserName');
    const password: HTMLInputElement = document.querySelector('#newPassword');
    firstName.value = lastName.value = userName.value = password.value = '';
  }
}
