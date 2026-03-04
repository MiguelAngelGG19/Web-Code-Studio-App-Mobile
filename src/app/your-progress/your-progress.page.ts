import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

@Component({
  selector: 'app-your-progress',
  templateUrl: './your-progress.page.html',
  styleUrls: ['./your-progress.page.scss'],
  standalone: false, // ¡No lo quites!
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Tab4Page {
  
  // Datos basados exactamente en tu diseño
  user = signal({
    fullName: 'Carlos',
    progress: 0.65, // 65% de progreso
    specialist: 'Dr. Garcia',
    nextAppointment: '24 Octubre • 10:00 AM'
  });

  // Días de la semana (X es miércoles)
  dias = ['L', 'M', 'X', 'J', 'V', 'S'];

  constructor() {}
}