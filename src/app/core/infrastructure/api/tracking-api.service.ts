import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiBaseService } from '../../services/api-base.service';

export interface Tracking {
  id: number;
  routineId: number;
  painLevel: number;
  startTime?: string;
  endTime?: string;
  postObservations?: string;
}

@Injectable({ providedIn: 'root' })
export class TrackingApiService {
  constructor(
    private http: HttpClient,
    private apiBase: ApiBaseService
  ) {}

  private get baseUrl(): string {
    return `${this.apiBase.apiRoot}/tracking`;
  }

  // ✅ El backend solo tiene POST /tracking — get devuelve vacío de forma segura
  getByPatientId(patientId: number, limit = 50): Observable<Tracking[]> {
    return of([]);
  }

  create(data: {
    routineId: number;
    patientId: number;
    painLevel: number;
    startTime?: string;
    endTime?: string;
    postObservations?: string;
  }): Observable<boolean> {
    return this.http
      .post<{ success: boolean }>(this.baseUrl, data)
      .pipe(
        map((res) => res.success),
        catchError(() => of(false))
      );
  }
}
