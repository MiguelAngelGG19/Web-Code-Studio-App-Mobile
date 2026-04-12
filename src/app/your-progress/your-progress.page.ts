import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { RouteAnimationService } from '../core/services/route-animation.service';
import { PatientRepository } from '../../core/domain/repositories/patient.repository';
import { RoutineApiService, Routine } from '../core/infrastructure/api/routine-api.service';
import { PhysiotherapistApiService } from '../core/infrastructure/api/physiotherapist-api.service';
import { NotificationApiService } from '../core/infrastructure/api/notification-api.service';
import { AppointmentApiService, Appointment } from '../core/infrastructure/api/appointment-api.service';
import { Storage } from '@ionic/storage-angular';

// Tips del día — uno por cada día de la semana (0=Dom ... 6=Sáb)
const DAILY_TIPS: string[] = [
  'Recuerda calentar al menos 5 minutos antes de empezar tu rutina.',
  'Mantén una buena postura durante el día; apoya tu espalda cuando estés sentado.',
  'Hídratatate bien: 8 vasos de agua al día ayudan a la recuperación muscular.',
  'Descansar también es parte del tratamiento. No saltes tu día de recuperación.',
  'Realiza tus ejercicios a la misma hora cada día para crear el hábito.',
  'El dolor leve es normal; si sientes dolor agudo, consulta a tu fisioterapeuta.',
  'Termina siempre con estiramientos para reducir la tensión muscular.',
];

@Component({
  selector: 'app-your-progress',
  templateUrl: './your-progress.page.html',
  styleUrls: ['./your-progress.page.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tab4Page implements OnInit {
  // Datos del paciente
  patientFirstName = signal('...');
  patientFullName = signal('Cargando...');
  patientInitials = signal('?');
  avatarColor = signal('#01696f');

  // Notificaciones
  unreadCount = signal(0);

  // Rutina activa
  routine = signal<Routine | null>(null);
  exerciseCount = signal(0);

  // Próxima cita
  nextAppointment = signal<Appointment | null>(null);
  nextAppointmentLabel = computed(() => {
    const a = this.nextAppointment();
    if (!a) return null;
    const d = new Date(a.appointmentDate);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
  });
  nextAppointmentTime = computed(() => {
    const t = this.nextAppointment()?.appointmentTime;
    return t ? t.slice(0, 5) : '';
  });

  // Fisio
  physioName = signal('');

  // Semana — sólo visual por ahora (backend no expone tracking GET)
  // TODO backend: exponer GET /tracking/patient/:id para leer historial
  readonly dias = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  diasActivos = signal<boolean[]>([false, false, false, false, false, false, false]);

  // Saludo
  greeting = computed(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Buenos días ☀️';
    if (h < 19) return 'Buenas tardes 🌤️';
    return 'Buenas noches 🌙';
  });

  // Tip del día (rota por día de la semana)
  dailyTip = signal(DAILY_TIPS[new Date().getDay()]);

  constructor(
    private router: Router,
    private routeAnimationService: RouteAnimationService,
    private patientRepo: PatientRepository,
    private routineApi: RoutineApiService,
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
    // Paciente
    this.patientRepo.getPatientById(patientId).subscribe({
      next: (p) => {
        const first = p.firstName || '';
        const lastP = p.lastNameP || '';
        const full = [first, lastP].filter(Boolean).join(' ') || 'Paciente';
        this.patientFirstName.set(first || 'Paciente');
        this.patientFullName.set(full);
        const initials = (
          (first[0] || '') + (lastP[0] || '')
        ).toUpperCase() || (full[0] || 'P').toUpperCase();
        this.patientInitials.set(initials);
        this.avatarColor.set(this._colorFromName(full));
        if (p.physiotherapistId) {
          this.physioApi.getById(p.physiotherapistId).subscribe((ph) => {
            if (ph) this.physioName.set(ph.fullName);
          });
        }
      },
      error: () => {
        this.patientFirstName.set('Paciente');
        this.patientFullName.set('Paciente');
        this.patientInitials.set('P');
      },
    });

    // Rutina activa
    this.routineApi.getRoutines(patientId).subscribe((routines) => {
      if (routines.length > 0) {
        const r = routines[0];
        this.routine.set(r);
        this.routineApi.getRoutineById(r.id).subscribe((rw) => {
          if (rw) this.exerciseCount.set(rw.exercises.length);
        });
      }
    });

    // Próxima cita
    this.appointmentApi.getNext(patientId).subscribe((a) => this.nextAppointment.set(a));

    // Notificaciones no leídas
    this.notificationApi.getUnreadCount(patientId).subscribe((c) => this.unreadCount.set(c));

    // Nota: tracking GET no disponible en backend aún
    // TODO: cuando el backend exponga GET /tracking/patient/:id,
    //       reemplazar of([]) en TrackingApiService y conectar aquí los días activos.
  }

  // Genera un color teal/verde determinista basado en el nombre
  private _colorFromName(name: string): string {
    const palette = ['#01696f', '#0c7c81', '#0e6b8a', '#1a6b5a', '#3b7a6f', '#2d6e7e'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return palette[Math.abs(hash) % palette.length];
  }

  goToNotifications() { this.router.navigate(['/tabs/notifications']); }
  goToRutina() { this.router.navigate(['/tabs/detalle-rutina']); }
  goToProfile() { this.routeAnimationService.navigateWithAnimation(['/tabs/profile'], 'slide'); }

  ionViewWillLeave() {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  }
}
