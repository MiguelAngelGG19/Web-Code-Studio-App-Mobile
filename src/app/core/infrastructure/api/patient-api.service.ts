import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface PatientProfile {
  id: number;
  firstName: string | null;
  lastNameP: string | null;
  lastNameM: string | null;
  birthYear: number | null;
  sex: string | null;        // 'M' | 'F' | 'Other'
  height: number | null;
  weight: number | null;
  physiotherapistId: number;
}

@Injectable({ providedIn: 'root' })
export class PatientApiService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getById(id: number): Observable<PatientProfile> {
    return this.http
      .get<{ success: boolean; data: PatientProfile }>(`${this.base}/patients/${id}`)
      .pipe(map((res) => res.data));
  }
}
