import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Exercise } from '../../../domain/models/exercise.model';
import { ExerciseRepository } from '../../../domain/repositories/exercise.repository';
import { ApiBaseService } from '../../../../app/core/services/api-base.service';

@Injectable({
  providedIn: 'root'
})
export class ExerciseApiService implements ExerciseRepository {
  constructor(
    private http: HttpClient,
    private apiBase: ApiBaseService
  ) {}

  private get baseUrl(): string {
    return `${this.apiBase.apiRoot}/exercises`;
  }

  getExercises(): Observable<Exercise[]> {
    return this.http.get<{ success: boolean; rows?: any[] }>(this.baseUrl).pipe(
      map((res) => {
        const rows = res.rows ?? [];
        return rows.map((e: any) => ({
          id: e.id ?? e.idEjercicio,
          name: e.name,
          bodyZone: e.bodyZone ?? e.body_zone,
          description: e.description,
          videoUrl: e.videoUrl ?? e.video_url
        }));
      }),
      catchError(err => throwError(() => new Error(err.message ?? 'Error fetching exercises')))
    );
  }
}