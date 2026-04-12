import { Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { RouteAnimationService } from '../core/services/route-animation.service';
import { PatientRepository } from '../../core/domain/repositories/patient.repository';
import { RoutineApiService } from '../core/infrastructure/api/routine-api.service';
import { TrackingApiService } from '../core/infrastructure/api/tracking-api.service';
import { PhysiotherapistApiService } from '../core/infrastructure/api/physiotherapist-api.service';
import { NotificationApiService } from '../core/infrastructure/api/notification-api.service';
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
    initials: '...',
    progress: 0,
    specialist: 'Fisioterapeuta',
    nextAppointment: '—',
    routineName: 'Tu rutina',
  });

  dias = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  diasActivos = signal<boolean[]>([false, false, false, false, false, false, false]);
  unreadCount = signal(0);

  constructor(
    private router: Router,
    private routeAnimationService: RouteAnimationService,
    private patientRepo: PatientRepository,
    private routineApi: RoutineApiService,
    private trackingApi: TrackingApiService,
    private physioApi: PhysiotherapistApiService,
    private notificationApi: NotificationApiService,
    private storage: Storage
  ) {}

  async ngOnInit() {
    await this.storage.create();
    const patientId = await this.storage.get('currentPatientId');

    // Si no hay ID guardado, el usuario no ha iniciado sesión
    if (!patientId) {
      this.user.update(u => ({ ...u, fullName: 'Inicia sesión', initials: '?' }));
      return;
    }

    // Cargar datos del paciente desde Storage (ya vienen del login)
    const patient = await this.storage.get('currentPatient');
    if (patient) {
      const firstName = patient.firstName || '';
      const lastNameP = patient.lastNameP || '';
      const fullName = [firstName, lastNameP].filter(Boolean).join(' ') || 'Paciente';
      const initials = [firstName[0], lastNameP[0]].filter(Boolean).join('').toUpperCase() || 'P';
      this.user.update(u => ({ ...u, fullName, initials }));

      // Cargar nombre del fisio si está asignado
      if (patient.physiotherapistId) {
        this.physioApi.getById(patient.physiotherapistId).subscribe((p) => {
          if (p) this.user.update(u => ({ ...u, specialist: p.fullName }));
        });
      }
    }

    // Cargar rutina activa
    this.routineApi.getRoutines(patientId).subscribe((routines) => {
      if (routines.length > 0) {
        const r = routines[0];
        const startDate = r.startDate
          ? new Date(r.startDate).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
          : '';
        this.user.update(u => ({
          ...u,
          routineName: r.name,
          nextAppointment: startDate ? `${startDate} • Rutina activa` : 'Rutina activa'
        }));
      }
    });

    // Cargar tracking de los últimos 7 días
    this.trackingApi.getByPatientId(patientId, 7).subscribe((trackings) => {
      const count = trackings.length;
      const progress = Math.min(count / 7, 1);
      this.user.update(u => ({ ...u, progress }));
      const activos = this.dias.map((_, i) => i < count);
      this.diasActivos.set(activos);
    });

    // Contar notificaciones no leídas
    this.notificationApi.getUnreadCount(patientId).subscribe((c) => this.unreadCount.set(c));
  }

  ionViewWillEnter() {
    this.storage.get('currentPatientId').then((id) => {
      if (id) this.notificationApi.getUnreadCount(id).subscribe((c) => this.unreadCount.set(c));
    });
  }

  ionViewWillLeave() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  goToProfile() {
    this.routeAnimationService.navigateWithAnimation(['/tabs/profile'], 'slide');
  }

  goToNotifications() {
    this.router.navigate(['/tabs/notifications']);
  }
}
