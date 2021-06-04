import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Setting } from 'src/app/model/Setting';
import { BASE_URL } from '../app/app.constant';

@Injectable({
  providedIn: 'root',
})
export class SettingService {
  constructor(private httpClient: HttpClient) {}

  getAllSettings(): Observable<any> {
    return this.httpClient.get<any>(`${BASE_URL}setting`);
  }

  getSetting(key: string): Observable<any> {
    return this.httpClient.get<any>(`${BASE_URL}setting/${key}`);
  }

  saveSetting(setting: Setting): Observable<any> {
    return this.httpClient.post<any>(`${BASE_URL}setting`, setting);
  }
}
