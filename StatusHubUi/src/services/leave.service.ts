import { ILeave } from 'src/app/model/leave';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from 'src/app/app.constant';

@Injectable({
  providedIn: 'root',
})
export class LeaveService {
  constructor(private httpClient: HttpClient) {}

  addLeaves(leaves: ILeave[]): Observable<any> {
    return this.httpClient.post<any>(`${BASE_URL}leaves`, leaves);
  }

  deleteLeaves(leavesIds: number[]): Observable<any> {
    return this.httpClient.delete<any>(
      `${BASE_URL}leaves?leavesIds=${leavesIds}`
    );
  }
}
