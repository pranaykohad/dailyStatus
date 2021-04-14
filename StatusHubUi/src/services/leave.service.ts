import { ILeave } from 'src/app/model/leave';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from 'src/app/app.constant';
import { DateUtilService } from './date-util.service';

@Injectable({
  providedIn: 'root',
})
export class LeaveService {
  constructor(
    private httpClient: HttpClient,
    private dateUtilService: DateUtilService
  ) {}

  getLeaves(type: string, month: string): Observable<any> {
    return this.httpClient.get<any>(
      `${BASE_URL}leaves?type=${type}&month=${month}`
    );
  }

  addLeaves(leaves: ILeave[]): Observable<any> {
    return this.httpClient.post<any>(`${BASE_URL}leaves`, leaves);
  }

  deleteLeaves(leavesIds: number[]): Observable<any> {
    return this.httpClient.delete<any>(
      `${BASE_URL}leaves?leavesIds=${leavesIds}`
    );
  }

  getResUtilreport(
    startDate: string,
    endDate: string,
    dateCount: number
  ): Observable<any> {
    const start: string = this.dateUtilService.formatHyphenDate(startDate);
    const end: string = this.dateUtilService.formatHyphenDate(endDate);
    return this.httpClient.get<any>(
      `${BASE_URL}res-utilization-report?&startDate=${start}&endDate=${end}&dateCount=${dateCount}`
    );
  }

  getLeaveReport(startDate: string, endDate: string): Observable<any> {
    const start: string = this.dateUtilService.formatHyphenDate(startDate);
    const end: string = this.dateUtilService.formatHyphenDate(endDate);
    return this.httpClient.get<any>(
      `${BASE_URL}leave-report?&startDate=${start}&endDate=${end}`
    );
  }
}
