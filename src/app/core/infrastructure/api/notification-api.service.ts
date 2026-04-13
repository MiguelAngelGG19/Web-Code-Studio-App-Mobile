import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiBaseService } from '../../services/api-base.service';

export interface Notification {
  id: number;
  patientId: number;
  title: string;
  body?: string;
  type: string;
  isRead: boolean;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationApiService {
  constructor(
    private http: HttpClient,
    private apiBase: ApiBaseService
  ) {}

  private get baseUrl(): string {
    return `${this.apiBase.apiRoot}/notifications`;
  }

  // ✅ Corregido: usar /notifications/patient/:patientId
  getByPatientId(patientId: number, limit = 50): Observable<Notification[]> {
    return this.http
      .get<any>(`${this.baseUrl}/patient/${patientId}`)
      .pipe(
        map((res) => {
          const rows = Array.isArray(res) ? res : (res?.rows ?? []);
          return rows.map((n: any) => ({
            id: n.id ?? n.id_notification,
            patientId: n.patientId ?? n.patient_id ?? n.id_patient,
            title: n.title || this.generateTitle(n.type),
            body: n.message ?? n.body ?? '',
            type: n.type ?? 'general',
            isRead: !!(n.isRead ?? n.is_read),
            createdAt: n.date ?? n.createdAt ?? n.created_at,
          }));
        }),
        catchError(() => of([]))
      );
  }

  private generateTitle(type?: string): string {
    switch (type?.toLowerCase()) {
      case 'rutina':        return 'Nueva Rutina Asignada';
      case 'cita':          return 'Recordatorio de Cita';
      case 'mensaje':       return 'Mensaje de tu Fisio';
      case 'progreso':      return 'Tu Progreso';
      case 'recordatorio':  return 'Recordatorio Importante';
      default:              return 'Notificación de ACTIVA';
    }
  }

  // ✅ Calcula no leídas desde getByPatientId en lugar de ruta inexistente
  getUnreadCount(patientId: number): Observable<number> {
    return this.getByPatientId(patientId).pipe(
      map((notifications) => notifications.filter(n => !n.isRead).length),
      catchError(() => of(0))
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
