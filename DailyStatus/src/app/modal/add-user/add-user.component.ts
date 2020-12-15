import { Component, OnInit } from '@angular/core';
import { moduleList, roleList, userTypeList } from 'src/app/app.constant';
import { User } from 'src/app/model/user';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit {
  user: User;
  moduleList = moduleList;
  userTypeList = userTypeList;
  roleList = roleList;
  constructor(private userService: UserService) {}

  ngOnInit(): void {}

  addUser(
    firstName: string,
    lastName: string,
    userName: string,
    password: string,
    moduleSelIndex: number,
    userSelIndex: number,
    roleSelIndex: number
  ) {
    this.user = new User('', '', '', '', '', 'Workbench 9.2', 'ADMIN', 'DEV');

    if (this.validate(firstName, lastName, userName, password)) {
      //show notification
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
          //success
        } else {
          //failure
        }
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
}
