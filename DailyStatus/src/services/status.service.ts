import { Attachment } from './../app/model/attachment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Status } from 'src/app/model/status';
import { BASE_URL } from './../app/app.constant';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  constructor(private httpClient: HttpClient) {}

  generateReport(
    userId: string,
    startDate: string,
    endDate: string
  ): Observable<any> {
    return this.httpClient.get<any>(
      `${BASE_URL}report?userId=${userId}&startDate=${startDate}&endDate=${endDate}`
    );
  }

  saveStatus(status: Status[]): Observable<any> {
    return this.httpClient.post<any>(`${BASE_URL}status`, status);
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
