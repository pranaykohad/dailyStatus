import { BASE_URL } from './../app/app.constant';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Status } from 'src/app/model/status';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  constructor(private httpClient: HttpClient) {}

  getStatus(
    userId: string,
    startDate: string,
    endDate: string
  ): Observable<any> {
    return this.httpClient.get<any>(
      `${BASE_URL}status?userId=${userId}&startDate=${startDate}&endDate=${endDate}`
    );
  }

  saveStatus(status: Status[]): Observable<any> {
    return this.httpClient.post<any>(`${BASE_URL}status`, status);
  }
}
