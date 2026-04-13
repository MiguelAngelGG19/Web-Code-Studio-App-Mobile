import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Storage } from '@ionic/storage-angular';

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
  private baseUrl = `${environment.apiUrl}/notifications`;

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) {}

  // Construye headers con JWT si existe
  private async getHeaders(): Promise<HttpHeaders> {
    const token = await this.storage.get('patient_token');
    if (token) {
      return new HttpHeaders({ Authorization: `Bearer ${token}` });
    }
    return new HttpHeaders();
  }

  getByPatientId(patientId: number, limit = 50): Observable<Notification[]> {
    return from(this.getHeaders()).pipe(
      switchMap((headers) =>
        this.http
          .get<any>(`${this.baseUrl}/patient/${patientId}`, { headers })
          .pipe(
            map((res) => {
              const rows = Array.isArray(res) ? res : (res?.rows ?? res?.data ?? []);
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
            catchError((err) => {
              console.warn('[notifications] Error al cargar', err);
              return of([]);
            })
          )
      )
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

  getUnreadCount(patientId: number): Observable<number> {
    return this.getByPatientId(patientId).pipe(
      map((notifications) => notifications.filter(n => !n.isRead).length),
      catchError(() => of(0))
    );
  }

  markAsRead(id: number, _patientId: number): Observable<boolean> {
    return from(this.getHeaders()).pipe(
      switchMap((headers) =>
        this.http.patch(`${this.baseUrl}/${id}/read`, {}, { headers }).pipe(
          map(() => true),
          catchError((err) => {
            console.warn('[notifications] markAsRead falló', id, err);
            return of(false);
          })
        )
      )
    );
  }
}
