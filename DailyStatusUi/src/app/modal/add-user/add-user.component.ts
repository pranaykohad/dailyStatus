import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
  alert: Alert;
  @Output() alertEmitter = new EventEmitter<Alert>();

  constructor(
    private userService: UserService,
    public activeModal: NgbActiveModal
  ) {
    this.alert = new Alert(null, null);
  }

  addUser(
    firstName: string,
    lastName: string,
    userName: string,
    password: string,
    moduleSelIndex: number,
    userSelIndex: number,
    roleSelIndex: number
  ) {
    this.user = new User(null, '', '', '', '', 'Workbench 9.2', 'ADMIN', 'DEV');
    if (this.validate(firstName, lastName, userName, password)) {
      this.setAlertMsg('All fields are compulsory.', 'fail');
      this.alertEmitter.emit(this.alert);
      this.activeModal.dismiss('close');
    } else {
      this.user.firstName = firstName;
      this.user.lastName = lastName;
      this.user.userName = userName;
      this.user.password = password;
      this.user.moduleName = this.moduleList[moduleSelIndex];
      this.user.type = this.userTypeList[userSelIndex];
      this.user.role = this.roleList[roleSelIndex];
      this.userService.addUser(this.user).subscribe((res) => {
        if (res['data']) {
          this.setAlertMsg('User is added successfullly.', res['status']);
          this.alertEmitter.emit(this.alert);
          this.resetAllFields();
        } else {
          this.setAlertMsg(res['descrition'], res['status']);
          this.alertEmitter.emit(this.alert);
        }
        this.activeModal.dismiss('close');
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

  private setAlertMsg(msg: string, type: string) {
    this.alert.message = msg;
    this.alert.type = type;
  }

  private resetAllFields() {
    const firstName: HTMLInputElement = document.querySelector('#newFirstName');
    const lastName: HTMLInputElement = document.querySelector('#newLastName');
    const userName: HTMLInputElement = document.querySelector('#newUserName');
    const password: HTMLInputElement = document.querySelector('#newPassword');
    firstName.value = lastName.value = userName.value = password.value = '';
  }
}
