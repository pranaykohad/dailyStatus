import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from 'src/app/app.constant';
import { User } from 'src/app/model/user';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private httpClient: HttpClient,
    private localStoreService: LocalStorageService
  ) {}

  addUser(user: User): Observable<User> {
    return this.httpClient.post<User>(`${BASE_URL}user`, user);
  }

  getAllUser(): Observable<User> {
    return this.httpClient.get<User>(`${BASE_URL}user`);
  }

  updateUserDetails(user: User): Observable<User> {
    return this.httpClient.post<User>(`${BASE_URL}update`, user);
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
    date = this.formatToTwoDigit(date);
    return this.httpClient.get<any>(`${BASE_URL}defaultersList?date=${date}`);
  }

  getCustomDefaulters(datesList: string[]): Observable<any> {
    const dates = [];
    datesList.forEach((date) => {
      dates.push(this.formatToTwoDigit(date));
    });
    return this.httpClient.get<any>(
      `${BASE_URL}customDefaulters?datesList=${dates}`
    );
  }

  formatToTwoDigit(date: string): string {
    const tokens: string[] = date.split('/');
    return `${this.formatDate(tokens[0])}/${this.formatDate(tokens[1])}/${
      tokens[2]
    }`;
  }

  private formatDate(value: string): string {
    return value.length === 1 ? '0' + value : value;
  }
}
