import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  userName = 'Cargando...';
  patient: any = null;

  constructor(private router: Router, private storage: Storage) {}

  async ngOnInit() {
    await this.storage.create();
    const patient = await this.storage.get('currentPatient');
    if (patient) {
      this.patient = patient;
      this.userName = [patient.firstName, patient.lastNameP, patient.lastNameM].filter(Boolean).join(' ') || 'Paciente';
    } else {
      this.userName = 'Paciente';
    }
  }

  getAvatarUrl(): string {
    return this.patient?.id ? `https://i.pravatar.cc/150?u=${this.patient.id}` : 'https://i.pravatar.cc/150?u=default';
  }

  async cerrarSesion() {
    await this.storage.create();
    await this.storage.remove('currentPatientId');
    await this.storage.remove('currentPatient');
    await this.storage.remove('currentRoutineId');
    this.router.navigate(['/login']);
  }
}
