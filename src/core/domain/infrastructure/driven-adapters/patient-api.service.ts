import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
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

  getPatients(): Observable<Patient[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(apiPatients => apiPatients.map(apiPatient => ({
        id: apiPatient.idPaciente,
        firstName: apiPatient.first_name,
        lastNameP: apiPatient.last_name_p,
        lastNameM: apiPatient.last_name_m,
        birthYear: apiPatient.birth_year,
        sex: apiPatient.sex,
        height: apiPatient.height,
        weight: apiPatient.weight,
        createdAt: new Date(apiPatient.created_at),
        physiotherapistId: apiPatient.physiotherapist_id,
        email: apiPatient.email
      }))),
      catchError(err => throwError(() => new Error(err.message ?? 'Error fetching patients')))
    );
  }

  getPatientById(id: number): Observable<Patient> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(apiPatient => ({
        id: apiPatient.idPaciente,
        firstName: apiPatient.first_name,
        lastNameP: apiPatient.last_name_p,
        lastNameM: apiPatient.last_name_m,
        birthYear: apiPatient.birth_year,
        sex: apiPatient.sex,
        height: apiPatient.height,
        weight: apiPatient.weight,
        createdAt: new Date(apiPatient.created_at),
        physiotherapistId: apiPatient.physiotherapist_id,
        email: apiPatient.email
      })),
      catchError(err => throwError(() => new Error(err.message ?? 'Error fetching patient')))
    );
  }
}