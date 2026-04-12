import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Patient } from '../../../domain/models/patient.model';
import { PatientRepository } from '../../../domain/repositories/patient.repository';
import { environment } from '../../../../environments/environment';

// ─── MOCK (Fase 1) ───────────────────────────────────────────
const MOCK_PATIENT: Patient = {
  id: 1,
  firstName: 'Miguel',
  lastNameP: 'Ángel',
  lastNameM: 'González',
  birthYear: 2003,
  sex: 'M',
  height: 1.75,
  weight: 70,
  createdAt: new Date(),
  physiotherapistId: 1,
  email: 'miguel@example.com',
};
// ─────────────────────────────────────────────────────────────

@Injectable({
  providedIn: 'root'
})
export class PatientApiService implements PatientRepository {
  private readonly baseUrl = `${environment.apiUrl}/patients`;
  private readonly authUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  getPatientByEmail(email: string): Observable<Patient | null> {
    return this.http.post<{ success: boolean; patient?: any; token?: string }>(
      `${this.authUrl}/login-patient`,
      { email: email.trim() }
    ).pipe(
      map((res) => {
        if (!res?.patient) return null;
        if (res.token) localStorage.setItem('patient_token', res.token);
        return this._map(res.patient);
      }),
      // ↓ Login siempre propaga el error real (no mockear login)
      catchError((err) => throwError(() => err))
    );
  }

  getPatients(): Observable<Patient[]> {
    return this.http.get<{ success: boolean; rows?: any[] }>(this.baseUrl).pipe(
      map((res) => (res.rows ?? []).map((p: any) => this._map(p))),
      catchError(() => of([MOCK_PATIENT]))
    );
  }

  getPatientById(id: number): Observable<Patient> {
    return this.http.get<{ success: boolean; data?: any }>(`${this.baseUrl}/${id}`).pipe(
      map((res) => {
        const p = res.data;
        if (!p) return MOCK_PATIENT; // backend responde pero sin data
        return this._map(p);
      }),
      // ↓ Fase 1: si falla el backend (CORS, red, 404), usa mock
      catchError(() => of(MOCK_PATIENT))
    );
  }

  private _map(p: any): Patient {
    const birthDate = p.birthDate ?? p.birth_date;
    const birthYear = p.birthYear ?? p.birth_year ?? (birthDate ? new Date(birthDate).getFullYear() : null);
    return {
      id: p.id ?? p.id_patient ?? p.idPaciente,
      firstName: p.firstName ?? p.first_name,
      lastNameP: p.lastNameP ?? p.last_name_paternal ?? p.last_name_p,
      lastNameM: p.lastNameM ?? p.last_name_maternal ?? p.last_name_m,
      birthYear,
      sex: p.sex ?? p.gender,
      height: p.height,
      weight: p.weight,
      createdAt: p.createdAt ? new Date(p.createdAt) : (p.created_at ? new Date(p.created_at) : new Date()),
      physiotherapistId: p.physioId ?? p.physiotherapistId ?? p.id_physio ?? p.physiotherapist_id ?? 0,
      email: p.email,
    };
  }
}
