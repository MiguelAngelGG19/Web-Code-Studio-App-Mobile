import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface LoginPatientResponse {
  success: boolean;
  token: string;
  patient: {
    id: number;
    firstName: string;
    lastNameP: string;
    lastNameM: string;
    email: string;
    physiotherapistId?: number;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private base = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  loginPatient(email: string, password: string): Observable<LoginPatientResponse> {
    return this.http.post<LoginPatientResponse>(`${this.base}/login-patient`, { email, password });
  }
}
