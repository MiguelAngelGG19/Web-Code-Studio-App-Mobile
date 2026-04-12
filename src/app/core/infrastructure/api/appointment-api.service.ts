import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface Appointment {
  id: number;
  patientId: number;
  physiotherapistId: number;
  appointmentDate: string;
  appointmentTime: string;
  type: string;
  notes?: string;
  createdAt?: string;
}

// ─── MOCK (Fase 1) ───────────────────────────────────────────
function _nextWeekdayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 3); // 3 días desde hoy
  return d.toISOString().split('T')[0];
}

const MOCK_APPOINTMENT: Appointment = {
  id: 1,
  patientId: 1,
  physiotherapistId: 1,
  appointmentDate: _nextWeekdayISO(),
  appointmentTime: '10:00',
  type: 'Seguimiento',
  notes: 'Revisar progreso lumbar',
};
// ─────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class AppointmentApiService {
  private baseUrl = `${environment.apiUrl}/appointments`;

  constructor(private http: HttpClient) {}

  getNext(patientId: number): Observable<Appointment | null> {
    return this.http
      .get<{ success: boolean; rows?: any[] }>(`${this.baseUrl}/patient/${patientId}`)
      .pipe(
        map((res) => {
          const rows = res.rows ?? [];
          if (rows.length === 0) return MOCK_APPOINTMENT;
          const sorted = rows
            .map((d) => this._map(d))
            .filter((a) => a.appointmentDate)
            .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
          return sorted[0] ?? MOCK_APPOINTMENT;
        }),
        catchError(() => of(MOCK_APPOINTMENT))
      );
  }

  list(patientId: number): Observable<Appointment[]> {
    return this.http
      .get<{ success: boolean; rows?: any[] }>(`${this.baseUrl}/patient/${patientId}`)
      .pipe(
        map((res) => (res.rows ?? []).map((d) => this._map(d))),
        catchError(() => of([MOCK_APPOINTMENT]))
      );
  }

  create(data: { patientId: number; physiotherapistId: number; appointmentDate: string; appointmentTime: string; type?: string; notes?: string }): Observable<Appointment | null> {
    return this.http.post<{ success: boolean; data?: any }>(`${this.baseUrl}`, data).pipe(
      map((res) => (res.data ? this._map(res.data) : null)),
      catchError(() => of(null))
    );
  }

  private _map(d: any): Appointment {
    return {
      id: d.id,
      patientId: d.patientId ?? d.patient_id,
      physiotherapistId: d.physiotherapistId ?? d.physiotherapist_id,
      appointmentDate: d.appointmentDate ?? d.appointment_date,
      appointmentTime: d.appointmentTime ?? d.appointment_time,
      type: d.type ?? 'consulta',
      notes: d.notes,
      createdAt: d.createdAt ?? d.created_at,
    };
  }
}
