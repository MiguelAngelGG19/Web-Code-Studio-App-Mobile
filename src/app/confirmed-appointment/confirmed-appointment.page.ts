import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { RoutineApiService } from '../core/infrastructure/api/routine-api.service';

@Component({
  selector: 'app-confirmed-appointment',
  templateUrl: 'confirmed-appointment.page.html',
  styleUrls: ['confirmed-appointment.page.scss'],
  standalone: false,
})
export class ConfirmedAppointmentPage implements OnInit {
  cita: any = {
    doctorName: 'Fisioterapeuta',
    specialty: 'Fisioterapia',
    doctorPhoto: 'https://i.pravatar.cc/150?u=physio',
    clinic: 'ACTIVA Health Center',
    fecha: '—',
    hora: '—',
    tipoTerapia: 'Rutina de ejercicios',
    direccion: 'Clínica ACTIVA',
  };
  loading = true;

  constructor(
    private storage: Storage,
    private routineApi: RoutineApiService
  ) {}

  async ngOnInit() {
    await this.storage.create();
    const patientId = await this.storage.get('currentPatientId') ?? 1;
    this.routineApi.getRoutines(patientId).subscribe((routines) => {
      if (routines.length > 0) {
        const r = routines[0];
        const start = r.startDate ? new Date(r.startDate) : null;
        this.cita = {
          ...this.cita,
          doctorName: 'Tu fisioterapeuta',
          tipoTerapia: r.name,
          fecha: start ? start.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' }) : '—',
          hora: 'Rutina activa',
        };
      }
      this.loading = false;
    });
  }
}
