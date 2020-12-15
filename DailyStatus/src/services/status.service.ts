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
    return this.httpClient.get<any>(`${BASE_URL}report?date=${date}`);
  }

  getDailyStsByUserIdAndDaterange(
    userId: string,
    startDate: string,
    endDate: string
  ): Observable<any> {
    return this.httpClient.get<any>(
      `${BASE_URL}report?userId=${userId}&startDate=${startDate}&endDate=${endDate}`
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
}
