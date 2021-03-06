import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from 'src/app/app.constant';

@Injectable({
  providedIn: 'root',
})
export class WsrService {
  constructor(private httpClient: HttpClient) {}

  getSheetNames(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post<any>(`${BASE_URL}sheetNames`, formData);
  }

  uploadLeaveReport(
    file: File,
    sheetName: string,
    start: number,
    end: number
  ): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sheetName', sheetName);
    return this.httpClient.post<any>(
      `${BASE_URL}wsrReport?start=${start}&end=${end}`,
      formData
    );
  }

  createWSRReport() {}
}
