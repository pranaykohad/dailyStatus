import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from 'src/app/app.constant';

@Injectable({
  providedIn: 'root',
})
export class WsrService {
  constructor(private httpClient: HttpClient) {}

  uploadLeaveReport(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post<any>(
      `${BASE_URL}upload-leave-report`,
      formData
    );
  }

  getSheetNames(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post<any>(`${BASE_URL}sheetNames`, formData);
  }

  createWSRReport(file: File, sheetName: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sheetName', sheetName);
    return this.httpClient.post<any>(`${BASE_URL}wsrReport`, formData);
  }
}
