import { Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteAnimationService } from '../core/services/route-animation.service';
import { PatientRepository } from '../../core/domain/repositories/patient.repository';
import { RoutineApiService } from '../core/infrastructure/api/routine-api.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-your-progress',
  templateUrl: './your-progress.page.html',
  styleUrls: ['./your-progress.page.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Tab4Page implements OnInit {
  user = signal({
    fullName: 'Cargando...',
    progress: 0.65,
    specialist: 'Fisioterapeuta',
    nextAppointment: '—',
    routineName: 'Tu rutina',
    avatarUrl: 'https://i.pravatar.cc/150?u=default'
  });

  dias = ['L', 'M', 'X', 'J', 'V', 'S'];

  constructor(
    private router: Router,
    private routeAnimationService: RouteAnimationService,
    private patientRepo: PatientRepository,
    private routineApi: RoutineApiService,
    private storage: Storage
  ) {}

  async ngOnInit() {
    await this.storage.create();
    const patientId = await this.storage.get('currentPatientId');
    const id = patientId ?? 1;
    this.patientRepo.getPatientById(id).subscribe({
      next: (patient) => {
        const fullName = [patient.firstName, patient.lastNameP, patient.lastNameM].filter(Boolean).join(' ') || 'Paciente';
        const avatarUrl = `https://i.pravatar.cc/150?u=${patient.id}`;
        this.user.update(u => ({ ...u, fullName, avatarUrl }));
      },
      error: () => {
        this.user.update(u => ({ ...u, fullName: 'Inicia sesión' }));
      }
    });
    this.routineApi.getRoutines(id).subscribe((routines) => {
      if (routines.length > 0) {
        const r = routines[0];
        const startDate = r.startDate ? new Date(r.startDate).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }) : '';
        this.user.update(u => ({
          ...u,
          routineName: r.name,
          nextAppointment: startDate ? `${startDate} • Rutina activa` : 'Rutina activa'
        }));
      }
    });
  }

  goToProfile() {
    this.routeAnimationService.navigateWithAnimation(['/profile'], 'slide');
  }

  ionViewWillLeave() {
    // Evita el aviso "aria-hidden" al navegar: blur del elemento con foco
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }
}
