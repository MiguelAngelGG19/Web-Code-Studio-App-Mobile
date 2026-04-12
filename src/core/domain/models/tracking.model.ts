export interface Tracking {
  id?: number;
  startTime: string;
  endTime: string;
  painLevel: number;
  postObservations: string;
  intraObservations: string;
  alert: number;
  routineId: number;
  /** Ejercicio al que aplica el reporte (coincide con `tracking.id_exercise` en el back) */
  exerciseId?: number;
}