import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { ToastController } from '@ionic/angular';
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
  userName     = 'Cargando...';
  patient: any = null;
  currentYear  = new Date().getFullYear();
  physio: Physiotherapist | null = null;
  tratamiento  = '—';
  pacienteDesde = '—';
  clinicName   = (environment as any).clinicName ?? 'ACTIVA Health Center';

  // Stats mostrados en pantalla
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
    private toast: ToastController
  ) {}

  async ngOnInit() {
    await this.storage.create();
    const patient = await this.storage.get('currentPatient');
    if (patient) {
      this.patient = patient;
      this.userName = [patient.firstName, patient.lastNameP, patient.lastNameM]
        .filter(Boolean).join(' ') || 'Paciente';

      // Edad
      if (patient.birthdate ?? patient.birthDate) {
        const bd = new Date(patient.birthdate ?? patient.birthDate);
        const age = this.currentYear - bd.getFullYear();
        this.edad = `${age} años`;
      }

      // Peso
      if (patient.weight) {
        this.peso = `${patient.weight} kg`;
      }

      // Altura
      if (patient.height) {
        this.altura = `${patient.height} m`;
      }

      // IMC = peso / (altura^2)
      const p = parseFloat(patient.weight);
      const h = parseFloat(patient.height);
      if (!isNaN(p) && !isNaN(h) && h > 0) {
        this.imc = p / (h * h);
        if (this.imc < 18.5)      { this.imcLabel = 'Bajo peso';    this.imcColor = 'warning'; }
        else if (this.imc < 25)   { this.imcLabel = 'Normal';       this.imcColor = 'success'; }
        else if (this.imc < 30)   { this.imcLabel = 'Sobrepeso';    this.imcColor = 'warning'; }
        else                      { this.imcLabel = 'Obesidad';     this.imcColor = 'danger';  }
      }

      // Fisio
      const physioId = patient.physiotherapistId ?? patient.idphysio;
      if (physioId) {
        this.physioApi.getById(physioId).subscribe((p) => (this.physio = p));
      }

      // Rutina (para fecha "Paciente desde")
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

  goToHistorial()      { this.router.navigate(['/tabs/historial']); }
  goToPhysioProfile()  { this.router.navigate(['/tabs/physiotherapist-profile']); }
  goToNotifications()  { this.router.navigate(['/tabs/notifications']); }

  async cerrarSesion() {
    await this.storage.create();
    await this.storage.remove('currentPatientId');
    await this.storage.remove('currentPatient');
    await this.storage.remove('currentRoutineId');
    this.router.navigate(['/login']);
  }

  ionViewWillLeave() {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  }
}
