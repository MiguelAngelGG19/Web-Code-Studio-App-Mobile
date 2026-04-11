import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

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
  private baseUrl = `${environment.apiUrl}/tracking`;

  constructor(private http: HttpClient) {}

  getByPatientId(patientId: number, limit = 50): Observable<Tracking[]> {
    return this.http
      .get<{ success: boolean; rows?: any[] }>(`${this.baseUrl}?patientId=${patientId}&limit=${limit}`)
      .pipe(
        map((res) => (res.rows ?? []).map((t: any) => ({
          id: t.id,
          routineId: t.routineId ?? t.routine_id,
          painLevel: t.painLevel ?? t.pain_level ?? 0,
          startTime: t.startTime ?? t.start_time,
          endTime: t.endTime ?? t.end_time,
          postObservations: t.postObservations ?? t.post_observations,
        }))),
        catchError(() => of([]))
      );
  }
}
