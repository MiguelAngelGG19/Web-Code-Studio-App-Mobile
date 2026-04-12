import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface PatientProfile {
  id: number;
  firstName: string | null;
  lastNameP: string | null;
  lastNameM: string | null;
  /** Género tal como lo manda el back: 'M' | 'F' | 'Other' | null */
  gender: string | null;
  height: number | null;
  weight: number | null;
  physiotherapistId: number;
}

@Injectable({ providedIn: 'root' })
export class PatientApiService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getById(id: number): Observable<PatientProfile> {
    return this.http
      .get<{ success: boolean; data: any }>(`${this.base}/patients/${id}`)
      .pipe(
        map((res) => {
          const d = res.data;
          // El back devuelve Sequelize.toJSON() → snake_case puro:
          // id_patient, first_name, last_name_paternal, last_name_maternal,
          // gender, height, weight, id_physio
          return {
            id:               d.id_patient       ?? d.id              ?? 0,
            firstName:        d.first_name       ?? d.firstName       ?? null,
            lastNameP:        d.last_name_paternal ?? d.lastNameP     ?? null,
            lastNameM:        d.last_name_maternal ?? d.lastNameM     ?? null,
            gender:           d.gender            ?? null,
            height:           d.height            != null ? Number(d.height) : null,
            weight:           d.weight            != null ? Number(d.weight) : null,
            physiotherapistId: d.id_physio        ?? d.physiotherapistId ?? 0,
          } as PatientProfile;
        })
      );
  }
}
