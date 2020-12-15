import { LocalStorageService } from './local-storage.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/model/user';
import { BASE_URL } from 'src/app/app.constant';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  user: User;

  constructor(
    private httpClient: HttpClient,
    private localStoreService: LocalStorageService
  ) {}

  addUser(user: User): Observable<User> {
    return this.httpClient.post<User>(`${BASE_URL}user`, user);
  }

  gteAllUser(): Observable<User> {
    return this.httpClient.get<User>(`${BASE_URL}user`);
  }

  updateUserDetails(user: User): Observable<User> {
    return this.httpClient.post<User>(`${BASE_URL}update`, user);
  }

  authenticateUser(user: User): Observable<User> {
    return this.httpClient.post<User>(`${BASE_URL}authenticate`, user);
  }

  getLocalUserName() {
    const USER = this.localStoreService.getUser();
    return USER && USER['userName'].length ? USER['userName'] : null;
  }
}
