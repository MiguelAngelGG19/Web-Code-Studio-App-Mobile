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

@Injectable({ providedIn: 'root' })
export class AppointmentApiService {
  // ✅ Corregido: la ruta del backend es /appointments, no /citas
  private baseUrl = `${environment.apiUrl}/appointments`;

  constructor(private http: HttpClient) {}

  getNext(patientId: number): Observable<Appointment | null> {
    return this.http
      .get<{ success: boolean; rows?: any[] }>(`${this.baseUrl}/patient/${patientId}`)
      .pipe(
        map((res) => {
          const rows = res.rows ?? [];
          if (rows.length === 0) return null;
          // Ordenar por fecha y devolver la proxima
          const sorted = rows
            .map((d) => this.mapAppointment(d))
            .filter((a) => a.appointmentDate)
            .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
          return sorted[0] ?? null;
        }),
        catchError(() => of(null))
      );
  }

  list(patientId: number, limit = 50): Observable<Appointment[]> {
    return this.http
      .get<{ success: boolean; rows?: any[] }>(`${this.baseUrl}/patient/${patientId}`)
      .pipe(
        map((res) => (res.rows ?? []).map((d) => this.mapAppointment(d))),
        catchError(() => of([]))
      );
  }

  create(data: { patientId: number; physiotherapistId: number; appointmentDate: string; appointmentTime: string; type?: string; notes?: string }): Observable<Appointment | null> {
    return this.http.post<{ success: boolean; data?: any }>(`${this.baseUrl}`, data).pipe(
      map((res) => (res.data ? this.mapAppointment(res.data) : null)),
      catchError(() => of(null))
    );
  }

  private mapAppointment(d: any): Appointment {
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
