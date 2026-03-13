import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Patient } from '../../../domain/models/patient.model';
import { PatientRepository } from '../../../domain/repositories/patient.repository';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PatientApiService implements PatientRepository {
  private readonly baseUrl = `${environment.apiUrl}/patients`;

  constructor(private http: HttpClient) {}

  getPatientByEmail(email: string): Observable<Patient | null> {
    return this.http.get<{ success: boolean; rows?: any[] }>(this.baseUrl, {
      params: { email: email.trim(), limit: '1' }
    }).pipe(
      map((res) => {
        const rows = res.rows ?? [];
        return rows.length > 0 ? this.mapPatient(rows[0]) : null;
      }),
      catchError(() => of(null))
    );
  }

  getPatients(): Observable<Patient[]> {
    return this.http.get<{ success: boolean; rows?: any[] }>(this.baseUrl).pipe(
      map((res) => {
        const rows = res.rows ?? [];
        return rows.map((p: any) => this.mapPatient(p));
      }),
      catchError(err => throwError(() => new Error(err.message ?? 'Error fetching patients')))
    );
  }

  getPatientById(id: number): Observable<Patient> {
    return this.http.get<{ success: boolean; data?: any }>(`${this.baseUrl}/${id}`).pipe(
      map((res) => {
        const p = res.data;
        if (!p) throw new Error('Paciente no encontrado');
        return this.mapPatient(p);
      }),
      catchError(err => throwError(() => new Error(err.message ?? 'Error fetching patient')))
    );
  }

  private mapPatient(p: any): Patient {
    return {
      id: p.id ?? p.idPaciente,
      firstName: p.firstName ?? p.first_name,
      lastNameP: p.lastNameP ?? p.last_name_p,
      lastNameM: p.lastNameM ?? p.last_name_m,
      birthYear: p.birthYear ?? p.birth_year,
      sex: p.sex,
      height: p.height,
      weight: p.weight,
      createdAt: p.createdAt ? new Date(p.createdAt) : (p.created_at ? new Date(p.created_at) : new Date()),
      physiotherapistId: p.physiotherapistId ?? p.physiotherapist_id,
      email: p.email
    };
  }
}