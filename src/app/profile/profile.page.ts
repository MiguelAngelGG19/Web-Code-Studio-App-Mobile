import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { RoutineApiService } from '../core/infrastructure/api/routine-api.service';
import { PhysiotherapistApiService, Physiotherapist } from '../core/infrastructure/api/physiotherapist-api.service';
import { SessionService, SessionPatient } from '../core/services/session.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  patient: SessionPatient | null = null;
  physio: Physiotherapist | null = null;
  tratamiento = '—';
  clinicName = environment.clinicName ?? 'ACTIVA Health Center';

  constructor(
    private router: Router,
    private session: SessionService,
    private routineApi: RoutineApiService,
    private physioApi: PhysiotherapistApiService,
    private toast: ToastController,
    private alert: AlertController
  ) {}

  async ngOnInit() {
    await this.session.init();
    const p = this.session.current;
    if (!p) return;
    this.patient = p;

    if (p.physiotherapistId) {
      this.physioApi.getById(p.physiotherapistId).subscribe((ph) => (this.physio = ph));
    }

    this.routineApi.getRoutines(p.id).subscribe((routines) => {
      if (routines.length > 0) this.tratamiento = routines[0].name ?? '—';
    });
  }

  // ─ Getters ───────────────────────────────────────────────────────────

  get fullName(): string {
    if (!this.patient) return 'Paciente';
    const parts = [this.patient.firstName, this.patient.lastNameP, this.patient.lastNameM].filter(Boolean);
    return parts.join(' ') || 'Paciente';
  }

  /** El modelo guarda birthYear (número), no birthDate */
  get age(): string {
    const year = (this.patient as any)?.birthYear;
    if (!year) return '—';
    return `${new Date().getFullYear() - year}`;
  }

  get weight(): string {
    const w = (this.patient as any)?.weight;
    return w ? `${w} kg` : '—';
  }

  get height(): string {
    const h = (this.patient as any)?.height;
    return h ? `${h} m` : '—';
  }

  get imc(): string {
    const w = (this.patient as any)?.weight;
    const h = (this.patient as any)?.height;
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

  get memberSince(): string {
    const d = (this.patient as any)?.createdAt;
    if (!d) return '—';
    return new Date(d).toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
  }

  get gender(): string {
    const map: Record<string, string> = { M: 'Masculino', F: 'Femenino', Other: 'Otro' };
    const s = (this.patient as any)?.sex ?? (this.patient as any)?.gender;
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
            await this.session.clear();  // limpia token + IDs en Storage
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
