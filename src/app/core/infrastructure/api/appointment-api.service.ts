import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiBaseService } from '../../services/api-base.service';

export interface Appointment {
  id: number;
  patientId: number;
  physiotherapistId: number;
  appointmentDate: string;
  appointmentTime: string;
  type: string;
  notes?: string;
  createdAt?: string;
  /** pending | confirmed | cancelled | completed (misma semántica que el back y el front web) */
  status?: string;
}

@Injectable({ providedIn: 'root' })
export class AppointmentApiService {
  constructor(
    private http: HttpClient,
    private apiBase: ApiBaseService
  ) {}

  private get baseUrl(): string {
    return `${this.apiBase.apiRoot}/appointments`;
  }

  getNext(patientId: number): Observable<Appointment | null> {
    return this.http
      .get<any>(`${this.baseUrl}/patient/${patientId}`)
      .pipe(
        map((res) => {
          const rows = Array.isArray(res) ? res : (res?.rows ?? []);
          if (rows.length === 0) return null;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          // Igual que appointment-list en web: no mostrar como "próxima" canceladas ni completadas
          const sorted = rows
            .map((d: any) => this.mapAppointment(d))
            .filter((a: Appointment) => this.isOpenPatientAppointment(a))
            .filter((a: Appointment) => {
              if (!a.appointmentDate) return false;
              const dt = new Date(a.appointmentDate + 'T12:00:00');
              return dt >= today;
            })
            .sort(
              (a: Appointment, b: Appointment) =>
                new Date(a.appointmentDate + 'T12:00:00').getTime() -
                new Date(b.appointmentDate + 'T12:00:00').getTime()
            );
          return sorted[0] ?? null;
        }),
        catchError(() => of(null))
      );
  }

  list(patientId: number, limit = 50): Observable<Appointment[]> {
    return this.http
      .get<any>(`${this.baseUrl}/patient/${patientId}`)
      .pipe(
        map((res) => {
          const rows = Array.isArray(res) ? res : (res?.rows ?? []);
          return rows.map((d: any) => this.mapAppointment(d));
        }),
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
      id:                 d.id ?? d.idappointment ?? d.id_appointment ?? 0,
      patientId:          d.patientId   ?? d.patient_id   ?? d.idpatient   ?? 0,
      physiotherapistId:  d.physiotherapistId ?? d.physiotherapist_id ?? d.idphysio ?? 0,
      // El back puede devolver: appointmentDate, appointment_date, o simplemente date
      appointmentDate:    d.appointmentDate   ?? d.appointment_date   ?? d.date ?? '',
      // El back puede devolver: appointmentTime, appointment_time, starttime, start_time
      appointmentTime:    d.appointmentTime   ?? d.appointment_time   ?? d.starttime ?? d.start_time ?? '',
      type:               d.type ?? d.notes ?? 'Consulta',
      notes:              d.notes,
      createdAt:          d.createdAt ?? d.created_at ?? d.createdat ?? '',
      status:             d.status != null ? String(d.status) : 'pending',
    };
  }

  /** Alineado con Web-Fronted appointment-list: completadas/canceladas no cuentan como próximas. */
  private isOpenPatientAppointment(a: Appointment): boolean {
    const raw = (a.status ?? 'pending').toString().trim().toLowerCase();
    return raw !== 'cancelled' && raw !== 'completed';
  }
}
