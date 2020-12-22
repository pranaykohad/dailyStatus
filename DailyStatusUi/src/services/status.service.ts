import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from 'src/app/app.constant';
import { Attachment } from 'src/app/model/attachment';
import { Status } from 'src/app/model/status';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  constructor(private httpClient: HttpClient) {}

  getTodaysReport(date: string): Observable<any> {
    date = this.formatToTwoDigit(date);
    return this.httpClient.get<any>(`${BASE_URL}report?date=${date}`);
  }

  getRecentStatus(date: string, userId: number): Observable<any> {
    date = this.formatToTwoDigit(date);
    return this.httpClient.get<any>(
      `${BASE_URL}recentStatus?date=${date}&&userId=${userId}`
    );
  }

  getDailyStsByUserIdAndDaterange(
    userId: string,
    startDate: string,
    endDate: string,
    reportType: string
  ): Observable<any> {
    startDate = this.formatToTwoDigit(startDate);
    endDate = this.formatToTwoDigit(endDate);
    return this.httpClient.get<any>(
      `${BASE_URL}reportByUserAndDateRange?userId=${userId}&startDate=${startDate}&endDate=${endDate}&reportType=${reportType}`
    );
  }

  saveStatus(statusList: Status[]): Observable<any> {
    return this.httpClient.post<any>(`${BASE_URL}status`, statusList);
  }

  downloadFile(res: Attachment) {
    const contentType = res.mimeType;
    const urlCreator = window.URL;
    const byteString = window.atob(res.fileContent);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: contentType });
    const url = urlCreator.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = res.fileName;
    a.click();
    window.URL.revokeObjectURL(url);
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