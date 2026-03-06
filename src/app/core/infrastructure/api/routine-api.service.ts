import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoutineApiService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getRoutines(patientId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/routines?patientId=${patientId}`);
  }
}
