import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { ToastController, AlertController } from '@ionic/angular';
import { RoutineApiService } from '../core/infrastructure/api/routine-api.service';
import { PhysiotherapistApiService, Physiotherapist } from '../core/infrastructure/api/physiotherapist-api.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  patient: any = null;
  physio: Physiotherapist | null = null;
  tratamiento = '—';
  clinicName = environment.clinicName ?? 'ACTIVA Health Center';

  constructor(
    private router: Router,
    private storage: Storage,
    private routineApi: RoutineApiService,
    private physioApi: PhysiotherapistApiService,
    private toast: ToastController,
    private alert: AlertController
  ) {}

  async ngOnInit() {
    await this.storage.create();
    const patient = await this.storage.get('currentPatient');
    if (patient) {
      this.patient = patient;
      if (patient.physiotherapistId) {
        this.physioApi.getById(patient.physiotherapistId).subscribe((p) => (this.physio = p));
      }
      const patientId = await this.storage.get('currentPatientId') ?? patient.id;
      this.routineApi.getRoutines(patientId).subscribe((routines) => {
        if (routines.length > 0) {
          this.tratamiento = routines[0].name ?? '—';
        }
      });
    }
  }

  // --- Getters de datos ---

  get fullName(): string {
    if (!this.patient) return 'Paciente';
    const parts = [
      this.patient.firstName,
      this.patient.lastNameP ?? this.patient.lastNamePaternal,
      this.patient.lastNameM ?? this.patient.lastNameMaternal
    ].filter(Boolean);
    return parts.join(' ') || 'Paciente';
  }

  get initials(): string {
    const f = (this.patient?.firstName || '').charAt(0).toUpperCase();
    const l = (this.patient?.lastNameP ?? this.patient?.lastNamePaternal ?? '').charAt(0).toUpperCase();
    return (f + l) || 'P';
  }

  get avatarColor(): string {
    const colors = ['#01696f', '#437a22', '#006494', '#7a39bb', '#a12c7b'];
    const name = this.patient?.firstName || 'P';
    return colors[name.charCodeAt(0) % colors.length];
  }

  get age(): string {
    const birth = this.patient?.birthDate ?? this.patient?.birth_date;
    if (!birth) return '—';
    const d = new Date(birth);
    const today = new Date();
    let a = today.getFullYear() - d.getFullYear();
    const m = today.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) a--;
    return `${a}`;
  }

  get weight(): string {
    const w = this.patient?.weight;
    return w ? `${w} kg` : '—';
  }

  get height(): string {
    const h = this.patient?.height;
    return h ? `${h} m` : '—';
  }

  get memberSince(): string {
    const d = this.patient?.createdAt ?? this.patient?.created_at;
    if (!d) return '—';
    return new Date(d).toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
  }

  get gender(): string {
    const map: Record<string, string> = { M: 'Masculino', F: 'Femenino', Other: 'Otro' };
    return this.patient?.gender ? (map[this.patient.gender] ?? '—') : '—';
  }

  get physioName(): string {
    if (this.physio) {
      return [(this.physio as any).firstName, (this.physio as any).lastNamePaternal].filter(Boolean).join(' ')
        || (this.physio as any).fullName
        || 'Sin asignar';
    }
    return 'Sin asignar';
  }

  // --- Navegación ---

  goToHistorial() { this.router.navigate(['/tabs/historial']); }
  goToPhysioProfile() { this.router.navigate(['/tabs/physiotherapist-profile']); }
  goToNotifications() { this.router.navigate(['/tabs/notifications']); }

  async cerrarSesion() {
    const a = await this.alert.create({
      header: 'Cerrar sesión',
      message: '¿Estás seguro que deseas salir?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salir',
          role: 'destructive',
          handler: async () => {
            await this.storage.remove('currentPatientId');
            await this.storage.remove('currentPatient');
            await this.storage.remove('currentRoutineId');
            this.router.navigate(['/login']);
          }
        }
      ]
    });
    await a.present();
  }

  ionViewWillLeave() {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  }
}
