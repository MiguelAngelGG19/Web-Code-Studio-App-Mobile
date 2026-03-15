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
  private baseUrl = `${environment.apiUrl}/citas`;

  constructor(private http: HttpClient) {}

  getNext(patientId: number): Observable<Appointment | null> {
    return this.http
      .get<{ success: boolean; data?: any }>(`${this.baseUrl}/next`, { params: { patientId: String(patientId) } })
      .pipe(
        map((res) => {
          const d = res.data;
          if (!d) return null;
          return this.mapAppointment(d);
        }),
        catchError(() => of(null))
      );
  }

  list(patientId: number, limit = 50): Observable<Appointment[]> {
    return this.http
      .get<{ success: boolean; rows?: any[] }>(`${this.baseUrl}`, { params: { patientId: String(patientId), limit: String(limit) } })
      .pipe(
        map((res) => (res.rows || []).map((d) => this.mapAppointment(d))),
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
