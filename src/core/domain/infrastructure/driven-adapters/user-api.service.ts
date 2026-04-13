import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../../../domain/models/user.model';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { ApiBaseService } from '../../../../app/core/services/api-base.service';

@Injectable({
  providedIn: 'root'
})
export class UserApiService implements UserRepository {
  constructor(
    private http: HttpClient,
    private apiBase: ApiBaseService
  ) {}

  private get baseUrl(): string {
    return `${this.apiBase.apiRoot}/users`;
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(apiUser => ({
        id: apiUser.id as number,
        fullName: apiUser.name as string,
        email: apiUser.email as string,
        nextAppointment: undefined,
        progress: 0
      })),
      catchError(err => throwError(() => new Error(err.message ?? 'Error fetching user')))
    );
  }
}
