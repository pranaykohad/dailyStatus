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
    private localStoreService: LocalStorageService
  ) {}

  updateUserDetails(user: User): Observable<User> {
    return this.httpClient.post<User>(`${BASE_URL}update`, user);
  }

  authenticateUser(user: User): Observable<User> {
    return this.httpClient.post<User>(`${BASE_URL}authnticate`, user);
  }

  getLocalUserName() {
    const USER = this.localStoreService.getUser();
    return USER && USER['userName'].length ? USER['userName'] : null;
  }
}
