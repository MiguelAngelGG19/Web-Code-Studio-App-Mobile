import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { PhysiotherapistApiService, Physiotherapist } from '../core/infrastructure/api/physiotherapist-api.service';

@Component({
  selector: 'app-physiotherapist-profile',
  templateUrl: './physiotherapist-profile.page.html',
  styleUrls: ['./physiotherapist-profile.page.scss'],
  standalone: false,
})
export class PhysiotherapistProfilePage implements OnInit {
  physio: Physiotherapist | null = null;
  currentYear = new Date().getFullYear();

  constructor(
    private storage: Storage,
    private physioApi: PhysiotherapistApiService
  ) {}

  async ngOnInit() {
    await this.storage.create();
    const patient = await this.storage.get('currentPatient');
    if (patient && patient.physiotherapistId) {
      this.physioApi.getById(patient.physiotherapistId).subscribe((p) => {
        this.physio = p;
      });
    }
  }
}
