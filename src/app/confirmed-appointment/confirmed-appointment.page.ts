import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { RoutineApiService } from '../core/infrastructure/api/routine-api.service';
import { PhysiotherapistApiService } from '../core/infrastructure/api/physiotherapist-api.service';

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
    doctorPhoto: 'https://i.pravatar.cc/150?img=11',
    clinic: 'ACTIVA Health Center',
    fecha: '—',
    hora: '—',
    tipoTerapia: 'Rutina de ejercicios',
    direccion: 'Av. Principal 123, Ciudad',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Clínica+Fisioterapia',
  };
  loading = true;

  constructor(
    private storage: Storage,
    private routineApi: RoutineApiService,
    private physioApi: PhysiotherapistApiService
  ) {}

  async ngOnInit() {
    await this.storage.create();
    const patient = await this.storage.get('currentPatient');
    const patientId = await this.storage.get('currentPatientId') ?? patient?.id ?? 1;
    this.routineApi.getRoutines(patientId).subscribe((routines) => {
      if (routines.length > 0) {
        const r = routines[0];
        const start = r.startDate ? new Date(r.startDate) : null;
        this.cita = {
          ...this.cita,
          tipoTerapia: r.name,
          fecha: start ? start.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' }) : '—',
          hora: 'Rutina activa',
        };
        if (r.physiotherapistId) {
          this.physioApi.getById(r.physiotherapistId).subscribe((p) => {
            if (p) {
              this.cita = { ...this.cita, doctorName: p.fullName, doctorPhoto: `https://i.pravatar.cc/150?u=physio${p.id}` };
            }
          });
        }
      }
      this.loading = false;
    });
  }

  openMaps() {
    const url = this.cita.mapsUrl || 'https://www.google.com/maps/search/?api=1&query=Clínica+Fisioterapia';
    window.open(url, '_blank', 'noopener');
  }

  ionViewWillLeave() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }
}
