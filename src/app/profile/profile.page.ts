import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { ToastController } from '@ionic/angular';
import { RoutineApiService } from '../core/infrastructure/api/routine-api.service';
import { PhysiotherapistApiService, Physiotherapist } from '../core/infrastructure/api/physiotherapist-api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  userName = 'Cargando...';
  patient: any = null;
  physio: Physiotherapist | null = null;
  tratamiento = '—';
  pacienteDesde = '—';
  clinicName = 'ACTIVA Health Center';

  constructor(
    private router: Router,
    private storage: Storage,
    private routineApi: RoutineApiService,
    private physioApi: PhysiotherapistApiService,
    private toast: ToastController
  ) {}

  async ngOnInit() {
    await this.storage.create();
    const patient = await this.storage.get('currentPatient');
    if (patient) {
      this.patient = patient;
      this.userName = [patient.firstName, patient.lastNameP, patient.lastNameM].filter(Boolean).join(' ') || 'Paciente';
      if (patient.physiotherapistId) {
        this.physioApi.getById(patient.physiotherapistId).subscribe((p) => (this.physio = p));
      }
      const patientId = await this.storage.get('currentPatientId') ?? patient.id;
      this.routineApi.getRoutines(patientId).subscribe((routines) => {
        if (routines.length > 0) {
          const r = routines[0];
          this.tratamiento = r.name;
          if (r.startDate) {
            const d = new Date(r.startDate);
            this.pacienteDesde = d.toLocaleDateString('es-MX', { month: 'short', year: 'numeric' });
          }
        }
      });
    } else {
      this.userName = 'Paciente';
    }
  }

  getAvatarUrl(): string {
    return this.patient?.id ? `https://i.pravatar.cc/150?u=${this.patient.id}` : 'https://i.pravatar.cc/150?u=default';
  }

  goToHistorial() {
    this.router.navigate(['/tabs/historial']);
  }

  async proximamente(feature: string) {
    const t = await this.toast.create({ message: `${feature} próximamente`, duration: 2000, position: 'bottom', color: 'primary' });
    await t.present();
  }

  async cerrarSesion() {
    await this.storage.create();
    await this.storage.remove('currentPatientId');
    await this.storage.remove('currentPatient');
    await this.storage.remove('currentRoutineId');
    this.router.navigate(['/login']);
  }

  ionViewWillLeave() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }
}
