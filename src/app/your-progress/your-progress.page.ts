import { Component, ChangeDetectionStrategy, signal, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteAnimationService } from '../core/services/route-animation.service';
import { PatientRepository } from '../../core/domain/repositories/patient.repository';
import { RoutineApiService, Routine } from '../core/infrastructure/api/routine-api.service';
import { TrackingApiService } from '../core/infrastructure/api/tracking-api.service';
import { PhysiotherapistApiService } from '../core/infrastructure/api/physiotherapist-api.service';
import { NotificationApiService } from '../core/infrastructure/api/notification-api.service';
import { AppointmentApiService, Appointment } from '../core/infrastructure/api/appointment-api.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-your-progress',
  templateUrl: './your-progress.page.html',
  styleUrls: ['./your-progress.page.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Tab4Page implements OnInit {

  // --- Estado del paciente ---
  patientName = signal('Cargando...');
  avatarUrl = signal('https://i.pravatar.cc/150?u=default');
  unreadCount = signal(0);

  // --- Progreso ---
  progressValue = signal(0); // 0.0 - 1.0
  progressPercent = computed(() => Math.round(this.progressValue() * 100));

  // --- Rutina activa ---
  routine = signal<Routine | null>(null);
  exerciseCount = signal(0);

  // --- Próxima cita ---
  nextAppointment = signal<Appointment | null>(null);
  nextAppointmentLabel = computed(() => {
    const a = this.nextAppointment();
    if (!a) return null;
    const d = new Date(a.appointmentDate);
    return d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
  });
  nextAppointmentTime = computed(() => {
    const a = this.nextAppointment();
    if (!a?.appointmentTime) return '';
    return a.appointmentTime.slice(0, 5); // HH:mm
  });

  // --- Fisio ---
  physioName = signal('');

  // --- Semana ---
  readonly dias = ['L', 'M', 'X', 'J', 'V', 'S'];
  diasActivos = signal<boolean[]>([false, false, false, false, false, false]);

  // --- Saludo dinámico ---
  greeting = computed(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Buenos días ☀️';
    if (h < 19) return 'Buenas tardes 🌤';
    return 'Buenas noches 🌙';
  });

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
    const patientId = (await this.storage.get('currentPatientId')) ?? 1;
    this._loadAll(patientId);
  }

  ionViewWillEnter() {
    this.storage.get('currentPatientId').then((id) => {
      if (id) this.notificationApi.getUnreadCount(id).subscribe((c) => this.unreadCount.set(c));
    });
  }

  private _loadAll(patientId: number) {
    // Datos del paciente
    this.patientRepo.getPatientById(patientId).subscribe({
      next: (p) => {
        const name = [p.firstName, p.lastNameP].filter(Boolean).join(' ') || 'Paciente';
        this.patientName.set(name);
        this.avatarUrl.set(`https://i.pravatar.cc/150?u=${p.id}`);
        if (p.physiotherapistId) {
          this.physioApi.getById(p.physiotherapistId).subscribe((ph) => {
            if (ph) this.physioName.set(ph.fullName);
          });
        }
      },
      error: () => this.patientName.set('Paciente')
    });

    // Rutina activa
    this.routineApi.getRoutines(patientId).subscribe((routines) => {
      if (routines.length > 0) {
        const r = routines[0];
        this.routine.set(r);
        // Cargar número de ejercicios
        this.routineApi.getRoutineById(r.id).subscribe((rw) => {
          if (rw) this.exerciseCount.set(rw.exercises.length);
        });
      }
    });

    // Próxima cita real
    this.appointmentApi.getNext(patientId).subscribe((a) => {
      this.nextAppointment.set(a);
    });

    // Progreso semanal (trackings últimos 6 días)
    this.trackingApi.getByPatientId(patientId, 6).subscribe((trackings) => {
      const progress = Math.min(trackings.length / 6, 1);
      this.progressValue.set(progress);
      const activos = this.dias.map((_, i) => i < trackings.length);
      this.diasActivos.set(activos);
    });

    // Notificaciones no leídas
    this.notificationApi.getUnreadCount(patientId).subscribe((c) => this.unreadCount.set(c));
  }

  goToNotifications() {
    this.router.navigate(['/tabs/notifications']);
  }

  goToRutina() {
    this.router.navigate(['/tabs/detalle-rutina']);
  }

  goToProfile() {
    this.routeAnimationService.navigateWithAnimation(['/tabs/profile'], 'slide');
  }

  ionViewWillLeave() {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  }
}
