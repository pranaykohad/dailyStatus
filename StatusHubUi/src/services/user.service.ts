import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from 'src/app/app.constant';
import { User } from 'src/app/model/user';
import { DateUtilService } from './date-util.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private httpClient: HttpClient,
    private localStoreService: LocalStorageService,
    private dateUtilService: DateUtilService
  ) {}

  addUser(user: User): Observable<User> {
    return this.httpClient.post<User>(`${BASE_URL}user`, user);
  }

  getUsersByUserType(userType: string): Observable<User> {
    return this.httpClient.get<User>(
      `${BASE_URL}user-by-type?userType=${userType}`
    );
  }

  findAllUsersButAmin(): Observable<User> {
    return this.httpClient.get<User>(`${BASE_URL}user-but-admin`);
  }

  getUsersById(userId: number): Observable<User> {
    return this.httpClient.get<User>(`${BASE_URL}user?userId=${userId}`);
  }

  updateUserDetails(user: User): Observable<User> {
    return this.httpClient.put<User>(`${BASE_URL}user`, user);
  }

  authenticateUser(user: User): Observable<User> {
    return this.httpClient.post<User>(`${BASE_URL}authenticate`, user);
  }

  deleteUser(userId: string) {
    return this.httpClient.delete<User>(`${BASE_URL}user?userId=${userId}`);
  }

  getLocalUserName() {
    const USER = this.localStoreService.getUser();
    return USER && USER['userName'].length ? USER['userName'] : null;
  }

  defaultersList(date: string): Observable<any> {
    date = this.dateUtilService.formatSlashDate(date);
    return this.httpClient.get<any>(`${BASE_URL}defaultersList?date=${date}`);
  }

  getCustomDefaulters(datesList: string[]): Observable<any> {
    const dates = [];
    datesList.forEach((date) => {
      dates.push(this.dateUtilService.formatSlashDate(date));
    });
    return this.httpClient.get<any>(
      `${BASE_URL}customDefaulters?datesList=${dates}`
    );
  }

  getSettings(): Observable<any> {
    return this.httpClient.get<any>(`${BASE_URL}setting`);
  }
}
