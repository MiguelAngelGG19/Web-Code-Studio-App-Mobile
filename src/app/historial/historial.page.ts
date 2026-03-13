import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { TrackingApiService, Tracking } from '../core/infrastructure/api/tracking-api.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: false,
})
export class HistorialPage implements OnInit {
  trackings: Tracking[] = [];
  loading = true;

  constructor(
    private storage: Storage,
    private trackingApi: TrackingApiService
  ) {}

  async ngOnInit() {
    await this.storage.create();
    const patientId = await this.storage.get('currentPatientId');
    if (patientId) {
      this.trackingApi.getByPatientId(patientId).subscribe({
        next: (rows) => {
          this.trackings = rows;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
    } else {
      this.loading = false;
    }
  }

  getPainLabel(level: number): string {
    if (level <= 2) return 'Bajo';
    if (level <= 5) return 'Moderado';
    return 'Alto';
  }

  getPainColor(level: number): string {
    if (level <= 2) return 'success';
    if (level <= 5) return 'warning';
    return 'danger';
  }

  ionViewWillLeave() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }
}
