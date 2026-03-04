import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

interface Cita {
  doctorName: string;
  doctorPhoto: string;
  specialty: string;
  clinic: string;
  fecha: string;
  hora: string;
  tipoTerapia: string;
  direccion: string;
}

@Component({
  selector: 'app-appointment-detail',
  templateUrl: './appointment-detail.page.html',
  styleUrls: ['./appointment-detail.page.scss'],
  standalone: false, // Importante para tu configuración de módulos actual
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tab3Page {
  // Mantenemos tu signal con los datos del Dr. Alejandro Ruiz
  cita = signal<Cita>({
    doctorName: 'Dr. Alejandro Ruiz',
    doctorPhoto: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop',
    specialty: 'Fisioterapeuta Deportivo',
    clinic: 'Centro de Rehabilitación Integral',
    fecha: 'Lunes, 15 de Mayo',
    hora: '09:00 AM - 10:00 AM',
    tipoTerapia: 'Recuperación Muscular Post-Entrenamiento',
    direccion: 'Av. de la Constitución 123, Edificio Prisma, Local 4',
  });
}