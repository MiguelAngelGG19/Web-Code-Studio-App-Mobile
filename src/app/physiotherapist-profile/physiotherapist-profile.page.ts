import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { PhysiotherapistApiService, Physiotherapist } from '../core/infrastructure/api/physiotherapist-api.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-physiotherapist-profile',
  templateUrl: './physiotherapist-profile.page.html',
  styleUrls: ['./physiotherapist-profile.page.scss'],
  standalone: false,
})
export class PhysiotherapistProfilePage implements OnInit {
  physio: Physiotherapist | null = null;
  physioInitials = 'FT';
  age: number | null = null;
  currentYear = new Date().getFullYear();

  constructor(
    private storage: Storage,
    private physioApi: PhysiotherapistApiService,
    private toast: ToastController
  ) {}

  async ngOnInit() {
    await this.storage.create();
    const patient = await this.storage.get('currentPatient');
    if (patient && patient.physiotherapistId) {
      this.physioApi.getById(patient.physiotherapistId).subscribe((p) => {
        this.physio = p;
        if (p?.birthYear) {
          this.age = this.currentYear - p.birthYear;
        }
        if (p?.fullName) {
          this.physioInitials = p.fullName
            .split(' ')
            .map((w: string) => w[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
        }
      });
    }
  }

  // Devuelve las iniciales para el avatar de texto
  getInitials(): string {
    return this.physioInitials;
  }

  ionViewWillLeave() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }
}
