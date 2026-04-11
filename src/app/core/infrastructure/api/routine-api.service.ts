import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface Routine {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  physiotherapistId: number;
  patientId: number;
}

export interface RoutineExercise {
  id: number;
  name: string;
  bodyZone: string;
  description: string;  // Puede ser personalizada por rutina (descripcion del link) o la base del ejercicio
  videoUrl: string;
  series?: number;
  reps?: number;
  duration?: string;
  consejo?: string;
}

export interface RoutineWithExercises extends Routine {
  exercises: RoutineExercise[];
}

@Injectable({ providedIn: 'root' })
export class RoutineApiService {
  private baseUrl = `${environment.apiUrl}/routines`;

  constructor(private http: HttpClient) {}

  getRoutineById(id: number): Observable<RoutineWithExercises | null> {
    return this.http
      .get<{ success: boolean; data?: any }>(`${this.baseUrl}/${id}`)
      .pipe(
        map((res) => {
          const r = res.data;
          if (!r) return null;
          return {
            id: r.id,
            name: r.name ?? '',
            startDate: r.startDate ?? '',
            endDate: r.endDate ?? '',
            physiotherapistId: r.physiotherapistId ?? 0,
            patientId: r.patientId ?? 0,
            exercises: (r.exercises ?? []).map((e: any) => ({
              id: e.id,
              name: e.name ?? '',
              bodyZone: e.bodyZone ?? e.body_zone ?? '',
              description: e.description ?? '',
              videoUrl: e.videoUrl ?? e.video_url ?? '',
              series: e.series ?? 3,
              reps: e.reps ?? 10,
              duration: e.duration ?? '01:00',
              consejo: e.consejo ?? ''
            }))
          };
        }),
        catchError(() => of(null))
      );
  }

  getRoutines(patientId: number): Observable<Routine[]> {
    return this.http
      .get<{ success: boolean; rows?: any[] }>(`${this.baseUrl}?patientId=${patientId}`)
      .pipe(
        map((res) => {
          const rows = res.rows ?? [];
          return rows.map((r: any) => ({
            id: r.id,
            name: r.name ?? '',
            startDate: r.startDate ?? '',
            endDate: r.endDate ?? '',
            physiotherapistId: r.physiotherapistId ?? 0,
            patientId: r.patientId ?? 0,
          }));
        }),
        catchError(() => of([]))
      );
  }
}
