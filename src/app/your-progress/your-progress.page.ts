import { Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteAnimationService } from '../core/services/route-animation.service';
import { PatientRepository } from '../../core/domain/repositories/patient.repository';
import { RoutineApiService } from '../core/infrastructure/api/routine-api.service';
import { TrackingApiService } from '../core/infrastructure/api/tracking-api.service';
import { PhysiotherapistApiService } from '../core/infrastructure/api/physiotherapist-api.service';
import { NotificationApiService } from '../core/infrastructure/api/notification-api.service';
import { AppointmentApiService } from '../core/infrastructure/api/appointment-api.service';
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
    progress: 0,
    specialist: 'Fisioterapeuta',
    nextAppointment: 'Sin citas programadas',
    routineName: 'Tu rutina',
    avatarUrl: 'https://i.pravatar.cc/150?u=default',
    physioAvatarUrl: ''
  });

  dias = ['L', 'M', 'X', 'J', 'V', 'S'];
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
    private appointmentApi: AppointmentApiService,
    private storage: Storage
  ) {}

  async ngOnInit() {
    await this.storage.create();
    const patientId = await this.storage.get('currentPatientId');
    const id = patientId ?? 1;

    // Datos del paciente
    this.patientRepo.getPatientById(id).subscribe({
      next: (patient) => {
        const fullName = [patient.firstName, patient.lastNameP, patient.lastNameM].filter(Boolean).join(' ') || 'Paciente';
        const avatarUrl = `https://i.pravatar.cc/150?u=${patient.id}`;
        this.user.update(u => ({ ...u, fullName, avatarUrl }));
        if (patient.physiotherapistId) {
          this.physioApi.getById(patient.physiotherapistId).subscribe((p) => {
            if (p) this.user.update(u => ({
              ...u,
              specialist: p.fullName,
              physioAvatarUrl: `https://i.pravatar.cc/150?u=physio${p.id}`
            }));
          });
        }
      },
      error: () => {
        this.user.update(u => ({ ...u, fullName: 'Inicia sesión' }));
      }
    });

    // ✅ Próxima cita REAL del back
    this.appointmentApi.getNext(id).subscribe((appt) => {
      if (appt) {
        const fecha = this.formatAppointmentDate(appt.appointmentDate, appt.appointmentTime);
        this.user.update(u => ({ ...u, nextAppointment: fecha }));
      } else {
        this.user.update(u => ({ ...u, nextAppointment: 'Sin citas programadas' }));
      }
    });

    // Rutina activa
    this.routineApi.getRoutines(id).subscribe((routines) => {
      if (routines.length > 0) {
        this.user.update(u => ({ ...u, routineName: routines[0].name }));
      }
    });

    // Tracking semanal
    this.trackingApi.getByPatientId(id, 7).subscribe((trackings) => {
      const count = trackings.length;
      const progress = Math.min(count / 7, 1);
      this.user.update(u => ({ ...u, progress }));
      const activos = this.dias.map((_, i) => i < count);
      this.diasActivos.set(activos);
    });

    // Contador notificaciones
    this.notificationApi.getUnreadCount(id).subscribe((c) => this.unreadCount.set(c));
  }

  ionViewWillEnter() {
    this.storage.get('currentPatientId').then((id) => {
      if (!id) return;
      this.notificationApi.getUnreadCount(id).subscribe((c) => this.unreadCount.set(c));
      // Refresca la cita al volver a la pantalla
      this.appointmentApi.getNext(id).subscribe((appt) => {
        const fecha = appt
          ? this.formatAppointmentDate(appt.appointmentDate, appt.appointmentTime)
          : 'Sin citas programadas';
        this.user.update(u => ({ ...u, nextAppointment: fecha }));
      });
    });
  }

  // Formatea la fecha de la cita de forma legible
  private formatAppointmentDate(dateStr: string, timeStr?: string): string {
    if (!dateStr) return 'Sin fecha';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const opciones: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
    const fechaTexto = d.toLocaleDateString('es-MX', opciones);
    if (timeStr) {
      // Convierte "14:30:00" a "2:30 PM"
      const [h, m] = timeStr.split(':').map(Number);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const hora12 = h % 12 || 12;
      return `${fechaTexto} • ${hora12}:${String(m).padStart(2, '0')} ${ampm}`;
    }
    return fechaTexto;
  }

  goToProfile() {
    this.routeAnimationService.navigateWithAnimation(['/tabs/profile'], 'slide');
  }

  goToNotifications() {
    this.router.navigate(['/tabs/notifications']);
  }

  ionViewWillLeave() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }
}
