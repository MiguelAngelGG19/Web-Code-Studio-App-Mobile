import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { RoutineApiService } from '../core/infrastructure/api/routine-api.service';
import { PhysiotherapistApiService, Physiotherapist } from '../core/infrastructure/api/physiotherapist-api.service';
import { PatientApiService, PatientProfile } from '../core/infrastructure/api/patient-api.service';
import { SessionService, SessionPatient } from '../core/services/session.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  session: SessionPatient | null = null;
  patient: PatientProfile | null = null;
  physio: Physiotherapist | null = null;
  tratamiento = '—';
  loading = true;
  clinicName = environment.clinicName ?? 'ACTIVA Health Center';

  constructor(
    private router: Router,
    private sessionSvc: SessionService,
    private routineApi: RoutineApiService,
    private physioApi: PhysiotherapistApiService,
    private patientApi: PatientApiService,
    private alert: AlertController
  ) {}

  async ngOnInit() {
    await this.sessionSvc.init();
    const s = this.sessionSvc.current;
    if (!s) { this.loading = false; return; }
    this.session = s;

    // 1. Datos completos del paciente desde el back
    this.patientApi.getById(s.id).subscribe({
      next: (p) => { this.patient = p; this.loading = false; },
      error: () => { this.loading = false; }
    });

    // 2. Fisioterapeuta asignado
    if (s.physiotherapistId) {
      this.physioApi.getById(s.physiotherapistId).subscribe({
        next: (ph) => (this.physio = ph)
      });
    }

    // 3. Rutina activa
    this.routineApi.getRoutines(s.id).subscribe({
      next: (routines) => {
        if (routines.length > 0) this.tratamiento = routines[0].name ?? '—';
      }
    });
  }

  // ─ Getters ───────────────────────────────────────────────────────────

  get fullName(): string {
    if (!this.patient) return this.session?.firstName ?? 'Paciente';
    const parts = [
      this.patient.firstName,
      this.patient.lastNameP,
      this.patient.lastNameM
    ].filter(Boolean);
    return parts.join(' ') || 'Paciente';
  }

  /** birthYear viene del back (ej. 1995) */
  get age(): string {
    const year = this.patient?.birthYear;
    if (!year) return '—';
    return `${new Date().getFullYear() - year}`;
  }

  get weight(): string {
    const w = this.patient?.weight;
    return w != null ? `${w} kg` : '—';
  }

  get height(): string {
    const h = this.patient?.height;
    return h != null ? `${h} m` : '—';
  }

  get imc(): string {
    const w = this.patient?.weight;
    const h = this.patient?.height;
    if (!w || !h || h === 0) return '—';
    return (w / (h * h)).toFixed(1);
  }

  get imcLabel(): string {
    const v = parseFloat(this.imc);
    if (isNaN(v)) return '—';
    if (v < 18.5) return 'Bajo peso';
    if (v < 25)   return 'Normal';
    if (v < 30)   return 'Sobrepeso';
    return 'Obesidad';
  }

  get imcClass(): string {
    const v = parseFloat(this.imc);
    if (isNaN(v)) return '';
    if (v < 18.5) return 'imc-low';
    if (v < 25)   return 'imc-normal';
    if (v < 30)   return 'imc-warning';
    return 'imc-danger';
  }

  /** 'M' → 'Masculino', 'F' → 'Femenino', 'Other' → 'Otro' */
  get gender(): string {
    const map: Record<string, string> = { M: 'Masculino', F: 'Femenino', Other: 'Otro' };
    const s = this.patient?.sex;
    return s ? (map[s] ?? '—') : '—';
  }

  get physioName(): string {
    if (!this.physio) return 'Sin asignar';
    return [
      (this.physio as any).firstName,
      (this.physio as any).lastNamePaternal
    ].filter(Boolean).join(' ') || (this.physio as any).fullName || 'Sin asignar';
  }

  // ─ Navegación ──────────────────────────────────────────────────────

  goToHistorial()     { this.router.navigate(['/tabs/historial']); }
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
            await this.sessionSvc.clear();
            this.router.navigate(['/login']);
          },
        },
      ],
    });
    await a.present();
  }

  ionViewWillLeave() {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  }
}
