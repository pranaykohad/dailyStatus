import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/model/user';
import { BASE_URL } from './../app/app.constant';
import { LocalStorageService } from './local-storage.service';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  user: User;

  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  getUserDetails(userId: number): Observable<User> {
    return this.httpClient.get<User>(`${BASE_URL}user/${userId}`);
  }

  authenticateUser(user: User): Observable<User> {
    return this.httpClient.post<User>(`${BASE_URL}authnticateUser`, user);
  }

  getLocalUserName() {
    return localStorage.getItem('USER') ? localStorage.getItem('USER') : '';
  }

  getLocalModuleName() {
    return localStorage.getItem('MODULE_NAME')
      ? localStorage.getItem('USER')
      : '';
  }

  setInitialUserName(user: User) {
    if (!localStorage.getItem('USER')) {
      this.localStorageService.setUser(user);
    } else {
      user.userName = localStorage.getItem('USER');
    }
  }

  setInitialMouduleName(user: User) {
    if (!localStorage.getItem('MODULE_NAME')) {
      const moduleName = user.moduleName;
      this.localStorageService.setModuleName(moduleName, user);
    } else {
      user.moduleName = localStorage.getItem('MODULE_NAME');
    }
  }
}
