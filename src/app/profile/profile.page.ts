import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { ToastController } from '@ionic/angular';
import { RoutineApiService } from '../core/infrastructure/api/routine-api.service';
import { PhysiotherapistApiService, Physiotherapist } from '../core/infrastructure/api/physiotherapist-api.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  userName = 'Cargando...';
  patient: any = null;
  photoTimestamp: number = Date.now();
  currentYear = new Date().getFullYear();
  physio: Physiotherapist | null = null;
  tratamiento = '—';
  pacienteDesde = '—';
  clinicName = environment.clinicName ?? 'ACTIVA Health Center';

  constructor(
    private router: Router,
    private storage: Storage,
    private routineApi: RoutineApiService,
    private physioApi: PhysiotherapistApiService,
    private http: HttpClient,
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
    if (this.patient?.photoUrl) {
      const url = this.patient.photoUrl;
      const base = environment.backendUrl;
      return `${base}/${url}?t=${this.photoTimestamp}`;
    }
    return '';
  }

  goToHistorial() {
    this.router.navigate(['/tabs/historial']);
  }

  goToPhysioProfile() {
    this.router.navigate(['/tabs/physiotherapist-profile']);
  }

  goToNotifications() {
    this.router.navigate(['/tabs/notifications']);
  }

  goToDocuments() {
    this.router.navigate(['/tabs/documents']);
  }

  async proximamente(feature: string) {
    const t = await this.toast.create({ message: `${feature} — disponible en futuras actualizaciones`, duration: 2500, position: 'bottom', color: 'medium' });
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
