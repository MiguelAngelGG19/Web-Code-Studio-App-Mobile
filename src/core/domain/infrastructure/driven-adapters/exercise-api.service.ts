import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Exercise } from '../../../domain/models/exercise.model';
import { ExerciseRepository } from '../../../domain/repositories/exercise.repository';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExerciseApiService implements ExerciseRepository {
  private readonly baseUrl = `${environment.apiUrl}/exercises`;

  constructor(private http: HttpClient) {}

  getExercises(): Observable<Exercise[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(apiExercises => apiExercises.map(apiExercise => ({
        id: apiExercise.idEjercicio,
        name: apiExercise.name,
        bodyZone: apiExercise.body_zone,
        description: apiExercise.description,
        videoUrl: apiExercise.video_url
      }))),
      catchError(err => throwError(() => new Error(err.message ?? 'Error fetching exercises')))
    );
  }
}