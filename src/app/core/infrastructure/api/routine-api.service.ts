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
  description: string;
  videoUrl: string;
  series?: number;
  reps?: number;
  duration?: string;
  consejo?: string;
}

export interface RoutineWithExercises extends Routine {
  exercises: RoutineExercise[];
}

// ─── MOCK (Fase 1) ───────────────────────────────────────────
const MOCK_ROUTINES: Routine[] = [
  {
    id: 1,
    name: 'Rehabilitación lumbar',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 días
    physiotherapistId: 1,
    patientId: 1,
  },
];

const MOCK_ROUTINE_DETAIL: RoutineWithExercises = {
  ...MOCK_ROUTINES[0],
  exercises: [
    { id: 1, name: 'Extensión lumbar', bodyZone: 'Lumbar', description: 'Tumbado boca abajo, eleva el tronco suavemente.', videoUrl: '', series: 3, reps: 10, consejo: 'Respira profundo en cada repetición.' },
    { id: 2, name: 'Puente glúteo',    bodyZone: 'Glúteos', description: 'Tumbado boca arriba, eleva las caderas.', videoUrl: '', series: 3, reps: 12, consejo: 'Mantén la posición 2 segundos arriba.' },
    { id: 3, name: 'Estiramiento isquiotibial', bodyZone: 'Pierna', description: 'Sentado, estira la pierna y alcanza el pie.', videoUrl: '', series: 2, reps: 1, duration: '00:30', consejo: 'No rebotes, mantente quieto.' },
    { id: 4, name: 'Fortalecimiento abdominal', bodyZone: 'Abdomen', description: 'Crunch lento y controlado.', videoUrl: '', series: 3, reps: 15, consejo: 'No jales el cuello con las manos.' },
  ],
};
// ─────────────────────────────────────────────────────────────

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
        // ↓ Fase 1: si el backend falla, devuelve el mock
        catchError(() => of(MOCK_ROUTINE_DETAIL))
      );
  }

  getRoutines(patientId: number): Observable<Routine[]> {
    return this.http
      .get<{ success: boolean; data?: any[] }>(`${this.baseUrl}/patient/${patientId}`)
      .pipe(
        map((res) => {
          const rows = res.data ?? [];
          if (rows.length === 0) return MOCK_ROUTINES; // array vacío → mock
          return rows.map((r: any) => ({
            id: r.id,
            name: r.name ?? '',
            startDate: r.startDate ?? r.start_date ?? '',
            endDate: r.endDate ?? r.end_date ?? '',
            physiotherapistId: r.physiotherapistId ?? r.physiotherapist_id ?? 0,
            patientId: r.patientId ?? r.patient_id ?? 0,
          }));
        }),
        // ↓ Fase 1: si el backend falla, devuelve mock
        catchError(() => of(MOCK_ROUTINES))
      );
  }
}
