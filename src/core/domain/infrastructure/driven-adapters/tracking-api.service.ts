import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Tracking } from '../../../domain/models/tracking.model';
import { TrackingRepository } from '../../../domain/repositories/tracking.repository';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrackingApiService implements TrackingRepository {
  // 🔥 CORRECCIÓN: Se quitó el /api extra porque ya viene en environment.apiUrl
  private readonly baseUrl = `${environment.apiUrl}/tracking`;

  constructor(private http: HttpClient) {}

  registerPainLevel(tracking: Tracking): Observable<void> {
    console.debug('tracking-api: sending', tracking, 'to', this.baseUrl);
    const body: Record<string, unknown> = {
      startTime: tracking.startTime,
      endTime: tracking.endTime,
      painLevel: Number(tracking.painLevel),
      postObservations: tracking.postObservations,
      intraObservations: tracking.intraObservations,
      routineId: Number(tracking.routineId),
    };
    if (tracking.exerciseId != null && tracking.exerciseId > 0) {
      body['exerciseId'] = Number(tracking.exerciseId);
    }
    if (tracking.alert !== undefined && tracking.alert !== null) {
      body['alert'] = Number(tracking.alert);
    }

    return this.http.post(this.baseUrl, body).pipe(
      map(() => undefined),
      catchError(err => {
        console.error('tracking-api error', err);
        const errBody = err?.error;
        const msg = errBody?.details || errBody?.message || err?.message || 'Error al registrar';
        const status = err?.status || err?.statusCode;
        const e = new Error(`${msg} (status ${status})`) as any;
        e.error = errBody;
        return throwError(() => e);
      })
    );
  }

  getTrackingByRoutine(routineId: number): Observable<Tracking[]> {
    return this.http.get<any[]>(`${this.baseUrl}?routineId=${routineId}`).pipe(
      map(apiTrackings => apiTrackings.map(apiTracking => ({
        id: apiTracking.id,
        startTime: apiTracking.start_time,
        endTime: apiTracking.end_time,
        painLevel: apiTracking.pain_level,
        postObservations: apiTracking.post_observations,
        intraObservations: apiTracking.intra_observations,
        alert: apiTracking.alert,
        routineId: apiTracking.routine_id
      }))),
      catchError(err => throwError(() => new Error(err.message ?? 'Error fetching tracking')))
    );
  }
}