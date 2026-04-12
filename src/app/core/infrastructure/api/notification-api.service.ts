import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface Notification {
  id: number;
  patientId: number;
  title: string;
  body?: string;
  type: string;
  isRead: boolean;
  createdAt?: string;
}

// ─── MOCK (Fase 1) ───────────────────────────────────────────
const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 1, patientId: 1, title: 'Cita confirmada', body: 'Tu cita fue confirmada para el próximo lunes.', type: 'cita', isRead: false, createdAt: new Date().toISOString() },
  { id: 2, patientId: 1, title: 'Nueva rutina asignada', body: 'Tu fisioterapeuta te asignó una rutina de rehabilitación lumbar.', type: 'rutina', isRead: false, createdAt: new Date().toISOString() },
];
// ─────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class NotificationApiService {
  private baseUrl = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) {}

  getByPatientId(patientId: number): Observable<Notification[]> {
    return this.http
      .get<{ success: boolean; rows?: any[] }>(`${this.baseUrl}/patient/${patientId}`)
      .pipe(
        map((res) => {
          const rows = res.rows ?? [];
          if (rows.length === 0) return MOCK_NOTIFICATIONS;
          return rows.map((n: any) => ({
            id: n.id,
            patientId: n.patientId ?? n.patient_id,
            title: n.title ?? '',
            body: n.body,
            type: n.type ?? 'general',
            isRead: !!(n.isRead ?? n.is_read),
            createdAt: n.createdAt ?? n.created_at,
          }));
        }),
        catchError(() => of(MOCK_NOTIFICATIONS))
      );
  }

  getUnreadCount(patientId: number): Observable<number> {
    return this.getByPatientId(patientId).pipe(
      map((list) => list.filter((n) => !n.isRead).length),
      catchError(() => of(2))
    );
  }

  markAsRead(id: number, patientId: number): Observable<boolean> {
    return this.http
      .patch<{ success: boolean }>(`${this.baseUrl}/${id}/read`, {})
      .pipe(
        map((res) => res.success),
        catchError(() => of(false))
      );
  }
}
