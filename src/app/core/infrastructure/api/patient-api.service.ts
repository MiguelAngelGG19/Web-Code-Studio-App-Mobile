import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface PatientProfile {
  id: number;
  firstName: string | null;
  lastNameP: string | null;
  lastNameM: string | null;
  birthYear: number | null;
  /** La BD guarda 'gender', el back puede mandarlo como 'sex' o 'gender' */
  sex: string | null;
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
          return {
            id:               d.id              ?? d.id_patient,
            firstName:        d.firstName       ?? d.first_name       ?? null,
            lastNameP:        d.lastNameP       ?? d.last_name_paternal ?? null,
            lastNameM:        d.lastNameM       ?? d.last_name_maternal ?? null,
            birthYear:        d.birthYear       ?? null,
            sex:              d.sex             ?? d.gender            ?? null,
            gender:           d.gender          ?? d.sex               ?? null,
            height:           d.height          ?? null,
            weight:           d.weight          ?? null,
            physiotherapistId: d.physiotherapistId ?? d.id_physio ?? 0,
          } as PatientProfile;
        })
      );
  }
}
