import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from 'src/app/app.constant';
import { Attachment } from 'src/app/model/attachment';
import { Status } from 'src/app/model/status';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  constructor(
    private httpClient: HttpClient,
    private utilService: UtilService
  ) {}

  getTodaysReport(date: string): Observable<any> {
    date = this.utilService.formatToTwoDigit(date);
    return this.httpClient.get<any>(`${BASE_URL}report?date=${date}`);
  }

  statusByDateAndUserId(date: string, userId: number): Observable<any> {
    date = this.utilService.formatToTwoDigit(date);
    return this.httpClient.get<any>(
      `${BASE_URL}statusByDateAndUserId?date=${date}&&userId=${userId}`
    );
  }

  getDailyStsByUserIdAndDaterange(
    userIdList: string[],
    startDate: string,
    endDate: string,
    reportType: string
  ): Observable<any> {
    startDate = this.utilService.formatToTwoDigit(startDate);
    endDate = this.utilService.formatToTwoDigit(endDate);
    return this.httpClient.get<any>(
      `${BASE_URL}reportByUserAndDateRange?userIdList=${userIdList}&startDate=${startDate}&endDate=${endDate}&reportType=${reportType}`
    );
  }

  updateStatus(statusList: Status[]): Observable<any> {
    return this.httpClient.post<any>(`${BASE_URL}status`, statusList);
  }
}
