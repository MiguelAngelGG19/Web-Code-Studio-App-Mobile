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

@Injectable({ providedIn: 'root' })
export class NotificationApiService {
  private baseUrl = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) {}

  getByPatientId(patientId: number, limit = 50): Observable<Notification[]> {
    return this.http
      .get<{ success: boolean; rows?: any[] }>(`${this.baseUrl}?patientId=${patientId}&limit=${limit}`)
      .pipe(
        map((res) =>
          (res.rows ?? []).map((n: any) => ({
            id: n.id,
            patientId: n.patientId ?? n.patient_id,
            title: n.title ?? '',
            body: n.body,
            type: n.type ?? 'general',
            isRead: !!(n.isRead ?? n.is_read),
            createdAt: n.createdAt ?? n.created_at,
          }))
        ),
        catchError(() => of([]))
      );
  }

  markAsRead(id: number, patientId: number): Observable<boolean> {
    return this.http
      .patch<{ success: boolean }>(`${this.baseUrl}/${id}/read?patientId=${patientId}`, {})
      .pipe(
        map((res) => res.success),
        catchError(() => of(false))
      );
  }

  getUnreadCount(patientId: number): Observable<number> {
    return this.http
      .get<{ success: boolean; count?: number }>(`${this.baseUrl}/unread-count?patientId=${patientId}`)
      .pipe(
        map((res) => res.count ?? 0),
        catchError(() => of(0))
      );
  }
}
