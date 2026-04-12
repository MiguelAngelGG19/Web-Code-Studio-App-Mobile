import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

export interface SessionPatient {
  id: number;
  firstName: string;
  lastNameP: string;
  lastNameM: string;
  email: string;
  physiotherapistId?: number;
}

@Injectable({ providedIn: 'root' })
export class SessionService {
  private _patient$ = new BehaviorSubject<SessionPatient | null>(null);
  readonly patient$ = this._patient$.asObservable();

  private _ready = false;

  constructor(private storage: Storage, private router: Router) {}

  /** Llama una vez en AppComponent.ngOnInit */
  async init(): Promise<void> {
    if (this._ready) return;
    await this.storage.create();
    const saved = await this.storage.get('currentPatient');
    if (saved) {
      this._patient$.next(saved as SessionPatient);
    } else {
      // No hay sesión guardada → redirigir al login
      this.router.navigate(['/login'], { replaceUrl: true });
    }
    this._ready = true;
  }

  /** Guarda la sesión tras login exitoso */
  async save(patient: SessionPatient, token: string): Promise<void> {
    await this.storage.set('patient_token', token);
    await this.storage.set('currentPatientId', patient.id);
    await this.storage.set('currentPatient', patient);
    this._patient$.next(patient);
  }

  /** Cierra sesión */
  async clear(): Promise<void> {
    await this.storage.remove('patient_token');
    await this.storage.remove('currentPatientId');
    await this.storage.remove('currentPatient');
    this._patient$.next(null);
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  get current(): SessionPatient | null {
    return this._patient$.getValue();
  }

  get currentId(): number {
    return this._patient$.getValue()?.id ?? 0;
  }
}
