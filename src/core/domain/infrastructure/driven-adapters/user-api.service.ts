import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../../../domain/models/user.model';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserApiService implements UserRepository {
  constructor(private http: HttpClient) {}

  getUserById(id: number): Observable<User> {
    return this.http
      .get<{ success: boolean; data?: any }>(`${environment.apiUrl}/patients/${id}`)
      .pipe(
        map((res) => {
          const p = res.data;
          if (!p) {
            throw new Error('Usuario no encontrado');
          }
          const fn = p.firstName ?? p.first_name ?? '';
          const lp = p.lastNameP ?? p.last_name_paternal ?? '';
          const lm = p.lastNameM ?? p.last_name_maternal ?? '';
          const email = p.email ?? p.User?.email ?? '';
          const pid = p.id ?? p.id_patient ?? id;
          return {
            id: pid as number,
            fullName: `${fn} ${lp} ${lm}`.trim() || 'Paciente',
            email: email as string,
            nextAppointment: undefined,
            progress: 0,
          };
        }),
        catchError((err) => throwError(() => new Error(err.message ?? 'Error fetching user')))
      );
  }
}
