import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface Physiotherapist {
  id: number;
  firstName: string;
  lastNameP: string;
  lastNameM?: string;
  fullName: string;
  birthYear?: number;
  professionalLicense?: string;
  curp?: string;
  licenseDocUrl?: string;
  photoUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class PhysiotherapistApiService {
  private baseUrl = `${environment.apiUrl}/physiotherapists`;

  constructor(private http: HttpClient) {}

  getById(id: number): Observable<Physiotherapist | null> {
    return this.http.get<{ success: boolean; data?: any }>(`${this.baseUrl}/${id}`).pipe(
      map((res) => {
        const p = res.data;
        if (!p) return null;
        const first = p.firstName ?? p.first_name ?? '';
        const lastP = p.lastNameP ?? p.last_name_paternal ?? p.last_name_p ?? '';
        const lastM = p.lastNameM ?? p.last_name_maternal ?? p.last_name_m ?? '';
        let bYear = p.birthYear ?? p.birth_year;
        if (!bYear && p.birth_date) {
          bYear = new Date(p.birth_date).getFullYear();
        }
        return {
          id: p.id ?? p.id_physio ?? p.idFisioterapeuta,
          firstName: first,
          lastNameP: lastP,
          lastNameM: lastM,
          fullName: [first, lastP, lastM].filter(Boolean).join(' ') || 'Fisioterapeuta',
          birthYear: bYear,
          professionalLicense: p.professionalLicense ?? p.professional_license,
          curp: p.curp,
          licenseDocUrl: p.licenseDocUrl ?? p.license_doc_url,
          photoUrl: p.photoUrl ?? p.photo_url,
        };
      }),
      catchError(() => of(null))
    );
  }
}
