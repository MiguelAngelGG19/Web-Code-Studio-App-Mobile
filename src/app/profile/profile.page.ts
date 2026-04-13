import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RoutineApiService } from '../core/infrastructure/api/routine-api.service';
import { PhysiotherapistApiService, Physiotherapist } from '../core/infrastructure/api/physiotherapist-api.service';
import { PatientRepository } from '../../core/domain/repositories/patient.repository';
import { environment } from '../../environments/environment';
import { ACTIVA_PATIENT_CACHE_KEY } from '../core/constants/patient-cache';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage {
  userName      = 'Cargando...';
  patient: any  = null;
  currentYear   = new Date().getFullYear();
  physio: Physiotherapist | null = null;
  pacienteDesde = '—';
  clinicName    = (environment as any).clinicName ?? 'ACTIVA Health Center';

  // Stats
  edad   = '—';
  peso   = '—';
  altura = '—';

  // IMC
  imc: number | null = null;
  imcLabel = '';
  imcColor = 'medium';

  constructor(
    private router: Router,
    private storage: Storage,
    private routineApi: RoutineApiService,
    private physioApi: PhysiotherapistApiService,
    private patientRepo: PatientRepository
  ) {}

  async ionViewWillEnter() {
    await this.refreshProfile();
  }

  private readLocalPatientCache(): any | null {
    try {
      const raw = localStorage.getItem(ACTIVA_PATIENT_CACHE_KEY);
      if (!raw) {
        return null;
      }
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  private persistLocalPatientCache(p: any): void {
    try {
      localStorage.setItem(ACTIVA_PATIENT_CACHE_KEY, JSON.stringify(p));
    } catch {
      /* */
    }
  }

  /** Caché local + Storage lo antes posible; paciente por API sin bloquear por rutinas. */
  private async refreshProfile(): Promise<void> {
    const cached = this.readLocalPatientCache();
    if (cached?.id) {
      this.applyPatientBasics(cached);
    }

    await this.storage.create();
    const stored = await this.storage.get('currentPatient');
    const patientId = await this.storage.get('currentPatientId');
    const id = patientId ?? stored?.id ?? stored?.idpatient ?? cached?.id;
    if (!id) {
      this.userName = 'Inicia sesión';
      return;
    }

    if (stored) {
      this.applyPatientBasics(stored);
      this.persistLocalPatientCache(stored);
    }

    this.patientRepo
      .getPatientById(id)
      .pipe(catchError(() => of(null)))
      .subscribe((p) => {
        if (p) {
          this.patient = p;
          this.userName =
            [p.firstName, p.lastNameP, p.lastNameM].filter(Boolean).join(' ') || 'Paciente';
          this.calcularStats(p);
          void this.storage.set('currentPatient', p);
          this.persistLocalPatientCache(p);

          const physioId = p.physiotherapistId ?? (p as any).idphysio;
          if (physioId) {
            this.physioApi.getById(physioId).subscribe((ph) => (this.physio = ph));
          }
        } else if (stored) {
          this.applyPatientBasics(stored);
        } else if (cached) {
          this.applyPatientBasics(cached);
        }
      });

    this.routineApi
      .getRoutines(id)
      .pipe(catchError(() => of([])))
      .subscribe((routines) => {
        if (routines.length > 0 && routines[0].startDate) {
          const d = new Date(routines[0].startDate);
          this.pacienteDesde = d.toLocaleDateString('es-MX', {
            month: 'short',
            year: 'numeric',
          });
        }
      });
  }

  private applyPatientBasics(stored: any) {
    this.patient = stored;
    this.userName =
      [
        stored.firstName,
        stored.lastNameP,
        stored.lastNameM,
        stored.firstname,
        stored.lastnamepaternal,
        stored.lastnamematernal,
      ]
        .filter(Boolean)
        .join(' ') || 'Paciente';
    this.calcularStats(stored);
    const physioId = stored.physiotherapistId ?? stored.idphysio ?? stored.id_physio;
    if (physioId) {
      this.physioApi.getById(physioId).subscribe((ph) => (this.physio = ph));
    }
  }

  private calcularStats(p: any) {
    this.edad = '—';
    this.peso = '—';
    this.altura = '—';
    this.imc = null;

    const by = p.birthYear ?? p.birth_year;
    const bd = p.birthdate ?? p.birth_date ?? p.birthDate;
    if (by != null && by !== '' && !isNaN(Number(by)) && Number(by) > 1900) {
      this.edad = `${this.currentYear - Number(by)} años`;
    } else if (bd) {
      const year = new Date(bd).getFullYear();
      if (!isNaN(year) && year > 1900) {
        this.edad = `${this.currentYear - year} años`;
      }
    }

    const w = parseFloat(String(p.weight ?? ''));
    if (!isNaN(w) && w > 0) {
      this.peso = `${w} kg`;
    }

    const h = parseFloat(String(p.height ?? ''));
    if (!isNaN(h) && h > 0) {
      this.altura = `${h} m`;
    }

    if (!isNaN(w) && !isNaN(h) && h > 0 && w > 0) {
      this.imc = w / (h * h);
      if      (this.imc < 18.5) { this.imcLabel = 'Bajo peso';  this.imcColor = 'warning'; }
      else if (this.imc < 25)   { this.imcLabel = 'Normal';     this.imcColor = 'success'; }
      else if (this.imc < 30)   { this.imcLabel = 'Sobrepeso';  this.imcColor = 'warning'; }
      else                      { this.imcLabel = 'Obesidad';   this.imcColor = 'danger';  }
    }
  }

  goToHistorial()     { this.router.navigate(['/tabs/historial']); }
  goToPhysioProfile() { this.router.navigate(['/tabs/physiotherapist-profile']); }
  goToNotifications() { this.router.navigate(['/tabs/notifications']); }

  async cerrarSesion() {
    await this.storage.create();
    await this.storage.remove('currentPatientId');
    await this.storage.remove('currentPatient');
    await this.storage.remove('currentRoutineId');
    try {
      localStorage.removeItem(ACTIVA_PATIENT_CACHE_KEY);
    } catch {
      /* */
    }
    this.router.navigate(['/login']);
  }

  ionViewWillLeave() {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  }
}
