import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Routine } from '../../../domain/models/routine.model';
import { RoutineRepository } from '../../../domain/repositories/routine.repository';
import { ApiBaseService } from '../../../../app/core/services/api-base.service';

@Injectable({
  providedIn: 'root'
})
export class RoutineApiService implements RoutineRepository {
  constructor(
    private http: HttpClient,
    private apiBase: ApiBaseService
  ) {}

  private get baseUrl(): string {
    return `${this.apiBase.apiRoot}/routines`;
  }

  getRoutines(): Observable<Routine[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(apiRoutines => apiRoutines.map(apiRoutine => ({
        id: apiRoutine.idRutina,
        name: apiRoutine.name,
        startDate: new Date(apiRoutine.start_date),
        endDate: new Date(apiRoutine.end_date),
        physiotherapistId: apiRoutine.physiotherapist_id,
        patientId: apiRoutine.patient_id
      }))),
      catchError(err => throwError(() => new Error(err.message ?? 'Error fetching routines')))
    );
  }

  getRoutinesByPatient(patientId: number): Observable<Routine[]> {
    return this.http.get<any[]>(`${this.baseUrl}?patientId=${patientId}`).pipe(
      map(apiRoutines => apiRoutines.map(apiRoutine => ({
        id: apiRoutine.idRutina,
        name: apiRoutine.name,
        startDate: new Date(apiRoutine.start_date),
        endDate: new Date(apiRoutine.end_date),
        physiotherapistId: apiRoutine.physiotherapist_id,
        patientId: apiRoutine.patient_id
      }))),
      catchError(err => throwError(() => new Error(err.message ?? 'Error fetching routines by patient')))
    );
  }

  getRoutineById(id: number): Observable<Routine> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(apiRoutine => ({
        id: apiRoutine.idRutina,
        name: apiRoutine.name,
        startDate: new Date(apiRoutine.start_date),
        endDate: new Date(apiRoutine.end_date),
        physiotherapistId: apiRoutine.physiotherapist_id,
        patientId: apiRoutine.patient_id
      })),
      catchError(err => throwError(() => new Error(err.message ?? 'Error fetching routine')))
    );
  }
}