import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from './../app/app.constant';

@Injectable({
  providedIn: 'root',
})
export class HolidayService {
  constructor(private httpClient: HttpClient) {}

  getAllHolidays(): Observable<any> {
    return this.httpClient.get<any>(`${BASE_URL}holidays`);
  }
}
